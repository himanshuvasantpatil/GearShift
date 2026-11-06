import React, { useState } from 'react';
import { 
  Receipt, 
  DollarSign, 
  TrendingUp, 
  Building2, 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Filter, 
  Search,
  PieChart,
  QrCode
} from 'lucide-react';
import { Invoice, Location } from '../types';

interface FinancialsViewProps {
  invoices: Invoice[];
  locations: Location[];
  currentLocation: Location;
}

export const FinancialsView: React.FC<FinancialsViewProps> = ({
  invoices,
  locations,
  currentLocation
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.customerGstin && inv.customerGstin.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalTaxCollected = invoices.reduce((acc, inv) => acc + inv.taxBreakdown.taxAmount, 0);
  const totalPaid = invoices.filter(i => i.paymentStatus === 'paid').reduce((acc, i) => acc + i.totalAmount, 0);
  const totalUnpaid = invoices.filter(i => i.paymentStatus === 'unpaid').reduce((acc, i) => acc + i.totalAmount, 0);

  const handleExportTaxReport = () => {
    const jsonStr = JSON.stringify(invoices, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GST_Tax_Compliance_Report_${currentLocation.code}_2026.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-orange-400" />
            Invoicing & Multi-Location Tax / GST Compliance Module
          </h2>
          <p className="text-xs text-slate-400">
            Automated CGST (9%) + SGST (9%) calculation, IGST inter-state invoicing, and international VAT/Sales Tax ledgers
          </p>
        </div>

        <button
          onClick={handleExportTaxReport}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export GST Audit Ledger (JSON)</span>
        </button>
      </div>

      {/* 4 Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400">Total Billed Gross</span>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {currentLocation.currency} {totalInvoiced.toLocaleString(currentLocation.region === 'INDIA' ? 'en-IN' : 'en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500 font-mono block">All business locations combined</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400">GST / Tax Reserve</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {currentLocation.currency} {totalTaxCollected.toLocaleString(currentLocation.region === 'INDIA' ? 'en-IN' : 'en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500 font-mono block">Audited for GST Returns (GSTR-1 & 3B)</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400">Collections via UPI & Online</span>
          <div className="text-2xl font-bold font-mono text-blue-400 tabular-nums">
            {currentLocation.currency} {totalPaid.toLocaleString(currentLocation.region === 'INDIA' ? 'en-IN' : 'en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500 font-mono block">Settled via Instant Gateway</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400">Outstanding Receivables</span>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {currentLocation.currency} {totalUnpaid.toLocaleString(currentLocation.region === 'INDIA' ? 'en-IN' : 'en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500 font-mono block">Awaiting Customer Approval / Net30</span>
        </div>
      </div>

      {/* Multi-Location Tax Jurisdictions Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4 text-orange-400" />
          Active Tax Jurisdictions & GST Registrations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {locations.map((loc) => (
            <div key={loc.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{loc.code}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-950 text-orange-300 border border-orange-800">
                  {loc.taxJurisdiction}
                </span>
              </div>
              <div className="text-slate-300 font-semibold">{loc.name}</div>
              {loc.gstin && (
                <div className="text-[10px] font-mono text-slate-400">GSTIN: <span className="text-slate-200 font-bold">{loc.gstin}</span></div>
              )}
              <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-2 border-t border-slate-900">
                <span>Default Rate:</span>
                <span className="text-emerald-400 font-bold">{loc.defaultTaxRate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white font-mono uppercase">
            Invoices & GST Ledger ({filteredInvoices.length} Invoices)
          </span>
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter invoice #, customer or GSTIN..."
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
                <th className="p-3">Invoice #</th>
                <th className="p-3">Date</th>
                <th className="p-3">Customer & GSTIN</th>
                <th className="p-3">Tax Jurisdiction Breakdown</th>
                <th className="p-3 text-right">Subtotal</th>
                <th className="p-3 text-right">Tax / GST</th>
                <th className="p-3 text-right">Total Payable</th>
                <th className="p-3 text-right">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-orange-400">{inv.invoiceNumber}</td>
                  <td className="p-3 font-mono text-slate-400">{inv.date}</td>
                  <td className="p-3 text-slate-200">
                    <div className="font-semibold text-white">{inv.customerName}</div>
                    {inv.customerGstin && (
                      <div className="text-[10px] text-slate-400 font-mono">B2B GST: {inv.customerGstin}</div>
                    )}
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-400">
                    <div>{inv.taxBreakdown.jurisdictionName}</div>
                    {inv.taxBreakdown.cgstAmount && (
                      <div className="text-[10px] text-slate-500">CGST: {currentLocation.currency}{inv.taxBreakdown.cgstAmount.toFixed(2)} + SGST: {currentLocation.currency}{inv.taxBreakdown.sgstAmount?.toFixed(2)}</div>
                    )}
                  </td>
                  <td className="p-3 text-right font-mono text-slate-300">
                    {currentLocation.currency} {inv.subtotal.toFixed(2)}
                  </td>
                  <td className="p-3 text-right font-mono text-emerald-400">
                    {currentLocation.currency} {inv.taxBreakdown.taxAmount.toFixed(2)}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-white">
                    {currentLocation.currency} {inv.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      inv.paymentStatus === 'paid' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {inv.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
