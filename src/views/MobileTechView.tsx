import React, { useState } from 'react';
import { 
  Smartphone, 
  Wrench, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  WifiOff, 
  User, 
  Car, 
  ChevronRight, 
  Sparkles,
  Boxes,
  Play,
  RotateCcw,
  Phone,
  QrCode,
  Printer
} from 'lucide-react';
import { WorkOrder, Technician, Location, InventoryItem, VehicleSpec } from '../types';
import { HERO_IMAGES } from '../data/mockData';

interface MobileTechViewProps {
  workOrders: WorkOrder[];
  technicians: Technician[];
  currentLocation: Location;
  inventory: InventoryItem[];
  isOffline: boolean;
  onUpdateWorkOrder: (updated: WorkOrder) => void;
  onOpenAiAssistant: (wo?: WorkOrder) => void;
  onOpenQrScanner?: () => void;
  onPrintQrLabel?: (entity: { type: 'vehicle' | 'inventory'; vehicle?: VehicleSpec; workOrder?: WorkOrder; item?: InventoryItem }) => void;
}

export const MobileTechView: React.FC<MobileTechViewProps> = ({
  workOrders,
  technicians,
  currentLocation,
  inventory,
  isOffline,
  onUpdateWorkOrder,
  onOpenAiAssistant,
  onOpenQrScanner,
  onPrintQrLabel
}) => {
  const [activeTechId, setActiveTechId] = useState<string>(technicians[0]?.id || 'tech-in-1');
  const activeTech = technicians.find(t => t.id === activeTechId) || technicians[0];
  const [activeTab, setActiveTab] = useState<'assigned' | 'inspection' | 'parts_req'>('assigned');
  const [capturedPhoto, setCapturedPhoto] = useState<boolean>(false);

  // Filter jobs assigned to active tech or current location
  const techJobs = workOrders.filter(w => w.assignedTechIds.includes(activeTech.id) || w.locationId === currentLocation.id);

  const handleProgressStatus = (wo: WorkOrder, nextStatus: WorkOrder['status']) => {
    const updated = { ...wo, status: nextStatus };
    onUpdateWorkOrder(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-5 max-w-xl mx-auto space-y-4 pb-24">
      {/* Mobile Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-orange-400 font-mono uppercase">
              Bay Technician Terminal ({currentLocation.code})
            </div>
            <select
              value={activeTechId}
              onChange={(e) => setActiveTechId(e.target.value)}
              className="bg-transparent text-white font-extrabold text-sm focus:outline-none cursor-pointer"
            >
              {technicians.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {t.name} ({t.skillTier})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenQrScanner && (
            <button
              onClick={onOpenQrScanner}
              className="p-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white shadow-md active:scale-95 transition-transform cursor-pointer"
              title="Scan Vehicle or Part QR"
            >
              <QrCode className="w-5 h-5" />
            </button>
          )}

          {isOffline && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-950 border border-amber-800 rounded-lg text-amber-300 text-xs font-mono font-bold">
              <WifiOff className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">Offline</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick QR Scanner Action Card */}
      {onOpenQrScanner && (
        <div className="p-3 bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 border border-orange-500/40 rounded-2xl flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Quick QR / Barcode Scanner</div>
              <div className="text-[11px] text-slate-400">Scan car windshield tag or spare part packaging</div>
            </div>
          </div>
          <button
            onClick={onOpenQrScanner}
            className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-sm whitespace-nowrap active:scale-95 transition-transform cursor-pointer"
          >
            Launch Scanner
          </button>
        </div>
      )}

      {/* Tech Status & Time Clock Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-slate-200">Shift: {activeTech?.shiftHours}</span>
        </div>
        <div className="font-mono text-slate-400">
          Efficiency: <strong className="text-emerald-400">{activeTech?.efficiencyRating}%</strong>
        </div>
      </div>

      {/* Mobile Sub-Nav Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-medium text-center">
        <button
          onClick={() => setActiveTab('assigned')}
          className={`py-2 rounded-lg transition-colors ${activeTab === 'assigned' ? 'bg-orange-600 text-white font-bold' : 'text-slate-400'}`}
        >
          My Bay Jobs ({techJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('inspection')}
          className={`py-2 rounded-lg transition-colors ${activeTab === 'inspection' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
        >
          Inspect & OBD
        </button>
        <button
          onClick={() => setActiveTab('parts_req')}
          className={`py-2 rounded-lg transition-colors ${activeTab === 'parts_req' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'}`}
        >
          Spares Indent
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'assigned' && (
        <div className="space-y-4">
          {techJobs.map((wo) => (
            <div key={wo.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-orange-400">{wo.orderNumber}</span>
                <div className="flex items-center gap-1.5">
                  {onPrintQrLabel && (
                    <button
                      onClick={() => onPrintQrLabel({ type: 'vehicle', vehicle: wo.vehicle, workOrder: wo })}
                      className="p-1 text-slate-400 hover:text-white rounded bg-slate-950 border border-slate-800 cursor-pointer"
                      title="View / Print Vehicle Gate QR Label"
                    >
                      <QrCode className="w-3.5 h-3.5 text-orange-400" />
                    </button>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-950 text-blue-300 border border-blue-800">
                    {wo.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-base font-extrabold text-white">
                  {wo.vehicle.year} {wo.vehicle.make} {wo.vehicle.model}
                </div>
                <div className="text-xs text-slate-300 font-mono flex items-center justify-between">
                  <span className="font-bold bg-slate-950 px-1.5 py-0.5 rounded text-white border border-slate-800">{wo.vehicle.licensePlate}</span>
                  <span className="text-slate-400">{wo.vehicle.fuelType} · {wo.vehicle.mileage.toLocaleString()} {wo.vehicle.mileageUnit}</span>
                </div>
              </div>

              {/* Reported Issues */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">Reported Problem</span>
                <p>{wo.reportedIssues[0] || 'Scheduled service & multi-point check'}</p>
              </div>

              {/* Quick Action Touch Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {wo.status === 'scheduled' && (
                  <button
                    onClick={() => handleProgressStatus(wo, 'in_inspection')}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
                  >
                    <Play className="w-4 h-4" />
                    <span>Begin Inspection</span>
                  </button>
                )}

                {wo.status === 'in_inspection' && (
                  <button
                    onClick={() => handleProgressStatus(wo, 'in_repair')}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Start Bay Repair</span>
                  </button>
                )}

                {wo.status === 'in_repair' && (
                  <button
                    onClick={() => handleProgressStatus(wo, 'ready_pickup')}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Job</span>
                  </button>
                )}

                <button
                  onClick={() => onOpenAiAssistant(wo)}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-purple-800/60 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI DTC Assist</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'inspection' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-purple-400" />
              Service Bay Evidence & Undercarriage Photo
            </h3>
            {onOpenQrScanner && (
              <button
                onClick={onOpenQrScanner}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-mono rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan VIN Tag</span>
              </button>
            )}
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-center">
            <img
              src={capturedPhoto ? HERO_IMAGES.inspection : HERO_IMAGES.tablet}
              alt="Inspection reference"
              className="w-full h-44 object-cover rounded-lg border border-slate-800"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => {
                setCapturedPhoto(!capturedPhoto);
                if (isOffline) alert('Photo captured and queued in Offline Sync Store for auto-upload upon connection!');
                else alert('Photo uploaded and synced with Customer WhatsApp Portal!');
              }}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl w-full flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{capturedPhoto ? 'Retake Undercarriage Photo' : 'Capture Brake & Chassis Photo'}</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'parts_req' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Boxes className="w-4 h-4 text-amber-400" />
              Indent Spare Parts from Central Depot
            </h3>
            {onOpenQrScanner && (
              <button
                onClick={onOpenQrScanner}
                className="px-2.5 py-1 bg-amber-600/20 text-amber-300 border border-amber-800 rounded-lg text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                <span>Scan Box QR</span>
              </button>
            )}
          </div>

          {/* Quick Scanner Callout inside Parts Tab */}
          {onOpenQrScanner && (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <div className="text-slate-400">
                Holding a spare part box? Scan the packaging QR to auto-verify compatibility.
              </div>
              <button
                onClick={onOpenQrScanner}
                className="ml-2 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shrink-0 cursor-pointer"
              >
                Scan Now
              </button>
            </div>
          )}

          <div className="space-y-2">
            {inventory.slice(0, 5).map((item) => (
              <div key={item.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{item.partName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    SKU: {item.sku} · Rack: {item.locationStock[currentLocation.id]?.rackLocation || 'A-01'}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {onPrintQrLabel && (
                    <button
                      onClick={() => onPrintQrLabel({ type: 'inventory', item })}
                      className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-900 border border-slate-800 cursor-pointer"
                      title="View Bin QR Label"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => alert(`Indent slip for ${item.partName} generated for ${currentLocation.code} Store In-charge!`)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg cursor-pointer"
                  >
                    Indent
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Floating Scanner Button on Mobile */}
      {onOpenQrScanner && (
        <div className="fixed bottom-4 inset-x-4 max-w-xl mx-auto z-30 pointer-events-none">
          <button
            onClick={onOpenQrScanner}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-2xl border border-orange-400/30 active:scale-95 transition-transform pointer-events-auto cursor-pointer"
          >
            <QrCode className="w-5 h-5" />
            <span>Scan Vehicle / Parts QR Label</span>
          </button>
        </div>
      )}
    </div>
  );
};
