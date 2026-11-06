import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Wrench, 
  Boxes, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  DollarSign 
} from 'lucide-react';
import { WorkOrder, AiDiagnosticResult } from '../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWorkOrder?: WorkOrder | null;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  initialWorkOrder
}) => {
  const [activeTab, setActiveTab] = useState<'dtc' | 'parts' | 'draft'>('dtc');

  // DTC form states
  const [dtcCode, setDtcCode] = useState(initialWorkOrder?.dtcCodes[0] || 'P0300');
  const [make, setMake] = useState(initialWorkOrder?.vehicle.make || 'BMW');
  const [model, setModel] = useState(initialWorkOrder?.vehicle.model || '330i xDrive');
  const [year, setYear] = useState(initialWorkOrder?.vehicle.year || 2021);
  const [symptoms, setSymptoms] = useState(initialWorkOrder?.reportedIssues[0] || 'Engine misfire under acceleration');
  const [dtcResult, setDtcResult] = useState<AiDiagnosticResult | null>(null);
  const [isLoadingDtc, setIsLoadingDtc] = useState(false);

  // Parts search states
  const [partQuery, setPartQuery] = useState('Brake Pads Carbon Ceramic');
  const [partsResult, setPartsResult] = useState<any>(null);
  const [isLoadingParts, setIsLoadingParts] = useState(false);

  useEffect(() => {
    if (initialWorkOrder) {
      setDtcCode(initialWorkOrder.dtcCodes[0] || 'P0300');
      setMake(initialWorkOrder.vehicle.make);
      setModel(initialWorkOrder.vehicle.model);
      setYear(initialWorkOrder.vehicle.year);
      setSymptoms(initialWorkOrder.reportedIssues[0] || '');
    }
  }, [initialWorkOrder]);

  if (!isOpen) return null;

  const handleRunDtcDiagnosis = async () => {
    setIsLoadingDtc(true);
    setDtcResult(null);
    try {
      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dtcCode, make, model, year, reportedSymptoms: symptoms })
      });
      const data = await res.json();
      setDtcResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingDtc(false);
    }
  };

  const handleRunPartsSearch = async () => {
    setIsLoadingParts(true);
    setPartsResult(null);
    try {
      const res = await fetch('/api/ai/parts-cross-ref', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchQuery: partQuery, vehicleContext: `${year} ${make} ${model}` })
      });
      const data = await res.json();
      setPartsResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingParts(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">GearShift AI Master Mechanic Copilot</h3>
              <p className="text-[11px] text-slate-400">Powered by Server-Side Gemini API</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 bg-slate-950 text-xs font-medium">
          <button
            onClick={() => setActiveTab('dtc')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
              activeTab === 'dtc' ? 'border-purple-500 text-purple-300 font-bold' : 'border-transparent text-slate-400'
            }`}
          >
            OBD-II DTC Troubleshooter
          </button>
          <button
            onClick={() => setActiveTab('parts')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
              activeTab === 'parts' ? 'border-purple-500 text-purple-300 font-bold' : 'border-transparent text-slate-400'
            }`}
          >
            Parts Cross-Referencer
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'dtc' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-slate-400 font-mono block mb-1">DTC Code</label>
                  <input
                    type="text"
                    value={dtcCode}
                    onChange={(e) => setDtcCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Make</label>
                  <input
                    type="text"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Model & Year</label>
                  <input
                    type="text"
                    value={`${model} (${year})`}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-mono block mb-1 text-xs">Reported Symptoms</label>
                <input
                  type="text"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs"
                />
              </div>

              <button
                onClick={handleRunDtcDiagnosis}
                disabled={isLoadingDtc}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoadingDtc ? 'Analyzing DTC Diagnostic Telemetry...' : 'Run Gemini AI Diagnostic Scan'}</span>
              </button>

              {dtcResult && (
                <div className="bg-slate-950 border border-purple-800/60 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white text-sm">{dtcResult.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-950 text-red-300 border border-red-800">
                      Severity: {dtcResult.severity}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-purple-400 block uppercase">Probable Causes</span>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 mt-1">
                      {dtcResult.probableCauses?.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 block uppercase">Recommended Fix & Repair Steps</span>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 mt-1">
                      {dtcResult.recommendedFixes?.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 font-mono text-[11px]">
                    <span className="text-slate-400">Est. Labor: <strong className="text-white">{dtcResult.estimatedLaborHours} hrs</strong></span>
                    <span className="text-emerald-400 font-bold">Recommended Parts Ready in Depot</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'parts' && (
            <div className="space-y-4">
              <div className="space-y-1 text-xs">
                <label className="text-slate-400 font-mono">Part Name / Description / Part Number</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={partQuery}
                    onChange={(e) => setPartQuery(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                  <button
                    onClick={handleRunPartsSearch}
                    disabled={isLoadingParts}
                    className="px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs"
                  >
                    Search
                  </button>
                </div>
              </div>

              {partsResult && (
                <div className="p-4 bg-slate-950 border border-purple-800/60 rounded-xl space-y-3 text-xs">
                  <div className="font-bold text-white font-mono">{partsResult.oemMatch}</div>
                  <div className="text-slate-400">{partsResult.fitmentNotes}</div>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase block">Cross-Referenced Alternatives</span>
                    {partsResult.aftermarketAlternatives?.map((alt: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800">
                        <div>
                          <span className="font-bold text-white">{alt.brand} {alt.partNumber}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">{alt.tier}</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-400">${alt.priceEst?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
