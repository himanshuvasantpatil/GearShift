import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  Trash2, 
  UserCheck, 
  CheckCircle2, 
  FileText, 
  Lock, 
  Search,
  Globe2
} from 'lucide-react';
import { ComplianceConsentRecord, ComplianceAuditLog } from '../types';

interface ComplianceViewProps {
  consents: ComplianceConsentRecord[];
  auditLogs: ComplianceAuditLog[];
  onExportCustomerData: (customerId: string) => void;
  onAnonymizeCustomer: (customerId: string) => void;
}

export const ComplianceView: React.FC<ComplianceViewProps> = ({
  consents,
  auditLogs,
  onExportCustomerData,
  onAnonymizeCustomer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegFilter, setActiveRegFilter] = useState<string>('all');

  const filteredConsents = consents.filter(c => {
    const matchesSearch = 
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    const matchesReg = activeRegFilter === 'all' || c.regulation === activeRegFilter;
    return matchesSearch && matchesReg;
  });

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Data Privacy & Compliance (India DPDPA 2023 & Global GDPR)
          </h2>
          <p className="text-xs text-slate-400">
            India Digital Personal Data Protection Act (DPDPA 2023) consent management, Right to Erasure, and Global GDPR Subject Access Requests (SAR)
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-slate-300">DPDPA Sec 6 & GDPR Art 17 Ready</span>
        </div>
      </div>

      {/* Regulation Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveRegFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeRegFilter === 'all' ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          All Customers ({consents.length})
        </button>
        <button
          onClick={() => setActiveRegFilter('INDIA_DPDPA_2023')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeRegFilter === 'INDIA_DPDPA_2023' ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          🇮🇳 India DPDPA 2023 ({consents.filter(c => c.regulation === 'INDIA_DPDPA_2023').length})
        </button>
        <button
          onClick={() => setActiveRegFilter('EU_GDPR')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeRegFilter === 'EU_GDPR' ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          🌐 Global GDPR ({consents.filter(c => c.regulation === 'EU_GDPR').length})
        </button>
      </div>

      {/* Customer Consent Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white font-mono uppercase">
            Data Principal Consent Registry ({filteredConsents.length} Registered Principals)
          </span>

          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search customer, phone or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <th className="p-3">Data Principal</th>
                <th className="p-3">Regulation</th>
                <th className="p-3">Telemetry & Service Consent</th>
                <th className="p-3">WhatsApp Consent</th>
                <th className="p-3">Marketing</th>
                <th className="p-3 font-mono">Consent Timestamp & IP</th>
                <th className="p-3 text-right">Statutory Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredConsents.map((c) => (
                <tr key={c.customerId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-white">{c.customerName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{c.phone} · {c.email}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 text-orange-300 border border-slate-800">
                      {c.regulation === 'INDIA_DPDPA_2023' ? '🇮🇳 DPDPA 2023' : '🌐 EU GDPR'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      CONSENTED
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.whatsappUpdatesConsent ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {c.whatsappUpdatesConsent ? 'ACTIVE' : 'OPTED OUT'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.marketingConsent ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {c.marketingConsent ? 'OPTED IN' : 'NO'}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-400 text-[11px]">
                    <div>{c.updatedAt}</div>
                    <div className="text-[10px] text-slate-500">{c.ipAddress}</div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onExportCustomerData(c.customerId)}
                        title="Export Data Principal Access Report"
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded flex items-center gap-1"
                      >
                        <Download className="w-3 h-3 text-blue-400" />
                        <span>Export Data</span>
                      </button>

                      <button
                        onClick={() => onAnonymizeCustomer(c.customerId)}
                        title="Right to Erasure / Scrub PII"
                        className="px-2.5 py-1 bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 text-[11px] font-semibold rounded flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                        <span>Erasure</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Audit Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 bg-slate-950 border-b border-slate-800">
          <span className="text-xs font-bold text-white font-mono uppercase">
            Statutory Compliance Audit Log ({auditLogs.length} Entries)
          </span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <th className="p-3">Regulation</th>
              <th className="p-3">Action</th>
              <th className="p-3">Performed By</th>
              <th className="p-3">Target Customer</th>
              <th className="p-3">Details</th>
              <th className="p-3 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-mono font-bold text-orange-400 text-[11px]">
                  {log.regulation === 'INDIA_DPDPA_2023' ? 'DPDPA' : 'GDPR'}
                </td>
                <td className="p-3 font-mono font-bold text-emerald-400 uppercase">{log.action}</td>
                <td className="p-3 text-slate-300 font-medium">{log.performedBy}</td>
                <td className="p-3 text-white font-bold">{log.targetCustomer}</td>
                <td className="p-3 text-slate-400 font-mono text-[11px]">{log.details}</td>
                <td className="p-3 text-right font-mono text-slate-400 text-[11px]">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
