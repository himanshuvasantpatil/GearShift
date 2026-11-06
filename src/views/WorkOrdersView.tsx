import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  Car, 
  FileText, 
  Send, 
  Sparkles, 
  Check, 
  ChevronRight, 
  X,
  Camera,
  Layers,
  ShieldCheck,
  MessageSquare,
  QrCode,
  Printer
} from 'lucide-react';
import { WorkOrder, Location, InventoryItem, Technician, VehicleSpec } from '../types';

interface WorkOrdersViewProps {
  workOrders: WorkOrder[];
  currentLocation: Location;
  inventory: InventoryItem[];
  technicians: Technician[];
  onUpdateWorkOrder: (updated: WorkOrder) => void;
  onOpenNewWorkOrder: () => void;
  onOpenAiAssistant: (wo?: WorkOrder) => void;
  onSendNotification: (wo: WorkOrder) => void;
  onOpenQrScanner?: () => void;
  onPrintQrLabel?: (entity: { type: 'vehicle' | 'inventory'; vehicle?: VehicleSpec; workOrder?: WorkOrder; item?: InventoryItem }) => void;
}

export const WorkOrdersView: React.FC<WorkOrdersViewProps> = ({
  workOrders,
  currentLocation,
  inventory,
  technicians,
  onUpdateWorkOrder,
  onOpenNewWorkOrder,
  onOpenAiAssistant,
  onSendNotification,
  onOpenQrScanner,
  onPrintQrLabel
}) => {
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const filteredOrders = workOrders.filter(wo => {
    const matchesSearch = 
      wo.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.vehicle.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || wo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { id: 'scheduled', label: 'Scheduled', color: 'border-slate-700 bg-slate-900/60' },
    { id: 'in_inspection', label: 'In Inspection', color: 'border-purple-800 bg-purple-950/20' },
    { id: 'parts_pending', label: 'Parts Pending', color: 'border-amber-800 bg-amber-950/20' },
    { id: 'in_repair', label: 'In Repair', color: 'border-blue-800 bg-blue-950/20' },
    { id: 'ready_pickup', label: 'Ready Pickup', color: 'border-emerald-800 bg-emerald-950/20' },
    { id: 'completed', label: 'Completed', color: 'border-slate-800 bg-slate-950/80' }
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* View Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-orange-400" />
            Job Cards & Workshop Work Orders
          </h2>
          <p className="text-xs text-slate-400">
            Real-time vehicle check-in, OBD-II DTC inspection, GST split invoicing, and customer WhatsApp dispatch
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Reg No (e.g. KA 03), VIN, Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* View Mode Segmented Controls */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs font-medium">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              List
            </button>
          </div>

          {onOpenQrScanner && (
            <button
              onClick={onOpenQrScanner}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
              title="Scan Vehicle Windshield QR or Gate Pass"
            >
              <QrCode className="w-3.5 h-3.5 text-orange-400" />
              <span>Scan Vehicle Tag</span>
            </button>
          )}

          <button
            onClick={onOpenNewWorkOrder}
            className="px-3.5 py-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Smart Job Card (Lookup Plate)</span>
          </button>
        </div>
      </div>

      {/* Smart Feature Notification Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span>
            <strong className="text-white">Smart Vehicle Lookup Active:</strong> New Job Cards auto-fill Make, Model, Year, Variant, VIN, and Insurance by registration plate (e.g. <span className="text-orange-400 font-mono font-bold">KA 03 MM 8899</span>, <span className="text-orange-400 font-mono font-bold">MH 02 FF 7700</span>).
          </span>
        </div>
        <button
          onClick={onOpenNewWorkOrder}
          className="text-orange-400 hover:text-orange-300 font-bold underline font-mono text-[11px] shrink-0"
        >
          Try Plate Lookup →
        </button>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colOrders = filteredOrders.filter(w => w.status === col.id);
            return (
              <div key={col.id} className={`rounded-xl border ${col.color} p-3 space-y-3 min-w-[260px]`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                    {col.label}
                  </span>
                  <span className="bg-slate-950 border border-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                    {colOrders.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[400px]">
                  {colOrders.length === 0 ? (
                    <div className="text-center py-10 text-[11px] text-slate-600">
                      No jobs
                    </div>
                  ) : (
                    colOrders.map((wo) => (
                      <div
                        key={wo.id}
                        onClick={() => setSelectedOrder(wo)}
                        className="p-3 bg-slate-900 border border-slate-800 hover:border-orange-500 rounded-xl cursor-pointer transition-all space-y-2 shadow-sm group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-orange-400 group-hover:underline">
                            {wo.orderNumber}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            wo.priority === 'urgent' ? 'bg-red-950 text-red-300 border border-red-800' :
                            wo.priority === 'high' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {wo.priority}
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-white">
                            {wo.vehicle.year} {wo.vehicle.make} {wo.vehicle.model}
                          </div>
                          <div className="text-[11px] text-slate-300 flex items-center justify-between font-mono">
                            <span className="font-bold bg-slate-950 px-1 rounded">{wo.vehicle.licensePlate}</span>
                            <span className="text-slate-400">{wo.vehicle.mileage.toLocaleString()} {wo.vehicle.mileageUnit}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-950 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="truncate max-w-[120px]">{wo.customerName}</span>
                          <span className="font-mono font-bold text-emerald-400">
                            {currentLocation.currency} {wo.totalAmount.toLocaleString(currentLocation.region === 'INDIA' ? 'en-IN' : 'en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <th className="p-3">Job Card #</th>
                <th className="p-3">Vehicle Details</th>
                <th className="p-3">Customer Info</th>
                <th className="p-3">Status</th>
                <th className="p-3">Bay Allocated</th>
                <th className="p-3 text-right">Estimate Total</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.map((wo) => (
                <tr key={wo.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-orange-400">{wo.orderNumber}</td>
                  <td className="p-3">
                    <div className="font-bold text-white">{wo.vehicle.year} {wo.vehicle.make} {wo.vehicle.model} ({wo.vehicle.fuelType})</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      <span className="font-bold text-slate-200">{wo.vehicle.licensePlate}</span> · VIN: {wo.vehicle.vin} · {wo.vehicle.mileage.toLocaleString()} {wo.vehicle.mileageUnit}
                    </div>
                  </td>
                  <td className="p-3 text-slate-300">
                    <div className="font-semibold text-white">{wo.customerName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{wo.customerPhone}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-950 text-blue-300 border border-blue-800">
                      {wo.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">{wo.bayId}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-400">
                    {currentLocation.currency} {wo.totalAmount.toLocaleString(currentLocation.region === 'INDIA' ? 'en-IN' : 'en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedOrder(wo)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium rounded transition-colors"
                    >
                      View Job Card
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Work Order Detail Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-end p-0 sm:p-4">
          <div className="w-full sm:max-w-2xl bg-slate-900 border-l sm:border border-slate-800 h-full sm:h-[92vh] sm:rounded-2xl flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Drawer Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-orange-400">{selectedOrder.orderNumber}</span>
                  <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold rounded uppercase">
                    {selectedOrder.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedOrder.vehicle.year} {selectedOrder.vehicle.make} {selectedOrder.vehicle.model}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {onPrintQrLabel && (
                  <button
                    onClick={() => onPrintQrLabel({ type: 'vehicle', vehicle: selectedOrder.vehicle, workOrder: selectedOrder })}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="View & Print QR Label"
                  >
                    <QrCode className="w-3.5 h-3.5 text-orange-400" />
                    <span>Print QR Label</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Content Body */}
            <div className="p-5 space-y-6 overflow-y-auto flex-1">
              {/* Vehicle & Customer Banner */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Vehicle & Registration</span>
                  <span className="font-bold text-white text-sm block">{selectedOrder.vehicle.licensePlate}</span>
                  <span className="text-slate-400 font-mono text-[11px]">Fuel: {selectedOrder.vehicle.fuelType} · {selectedOrder.vehicle.mileage.toLocaleString()} {selectedOrder.vehicle.mileageUnit}</span>
                  <span className="text-slate-500 font-mono text-[10px] block">VIN: {selectedOrder.vehicle.vin}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Customer & Contact</span>
                  <span className="font-bold text-white text-sm block">{selectedOrder.customerName}</span>
                  <span className="text-slate-300 font-mono text-[11px]">{selectedOrder.customerPhone}</span>
                  <span className="text-slate-500 text-[10px] block">{selectedOrder.customerEmail}</span>
                </div>
              </div>

              {/* Reported Issues */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Customer Reported Issues & Complaints</span>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                  {selectedOrder.reportedIssues.map((issue, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-orange-400 font-bold">•</span>
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diagnostic Codes & AI Button */}
              {selectedOrder.dtcCodes.length > 0 && (
                <div className="bg-purple-950/30 border border-purple-800/60 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                      <AlertCircle className="w-4 h-4 text-purple-400" />
                      <span>OBD-II DTC Diagnostic Codes ({selectedOrder.dtcCodes.join(', ')})</span>
                    </div>
                    <button
                      onClick={() => onOpenAiAssistant(selectedOrder)}
                      className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Diagnostic Copilot</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Inspection Photos Gallery */}
              {selectedOrder.inspectionPhotos.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-orange-400" />
                    Undercarriage & Inspection Evidence Photos ({selectedOrder.inspectionPhotos.length})
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedOrder.inspectionPhotos.map((img, idx) => (
                      <img 
                        key={idx}
                        src={img} 
                        alt="Vehicle Inspection photo"
                        className="w-full h-32 object-cover rounded-lg border border-slate-800"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Inspection Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300">Multi-Point Digital Inspection Checklist</span>
                <div className="space-y-1.5">
                  {selectedOrder.inspectionChecklist.map((chk, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-200">{chk.item}</span>
                        {chk.notes && <span className="text-[10px] text-slate-400 block font-mono">{chk.notes}</span>}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        chk.status === 'pass' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        chk.status === 'fail' ? 'bg-red-950 text-red-400 border border-red-800' :
                        'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {chk.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allocated Spare Parts with HSN and GST Rate */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300">Allocated Spare Parts from Warehouse</span>
                <div className="space-y-1.5">
                  {selectedOrder.partsUsed.map((pt, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                      <div>
                        <div className="font-semibold text-white">{pt.partName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          SKU: {pt.sku} {pt.hsnCode && `· HSN: ${pt.hsnCode}`} · Qty: {pt.quantity} {pt.gstRate && `· GST ${pt.gstRate}%`}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-emerald-400">
                        {currentLocation.currency} {(pt.unitPrice * pt.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Labor & GST Financial Breakdown */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-slate-400 font-mono">
                  <span>Subtotal (Parts & Labor):</span>
                  <span className="text-slate-200">{currentLocation.currency} {selectedOrder.subtotal.toFixed(2)}</span>
                </div>

                {/* CGST / SGST breakdown for India */}
                {currentLocation.taxJurisdiction === 'INDIA_GST' ? (
                  <>
                    <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                      <span>CGST (9.0% Central GST):</span>
                      <span className="text-slate-300">{currentLocation.currency} {(selectedOrder.taxBreakdown.cgst || (selectedOrder.taxAmount / 2)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                      <span>SGST (9.0% State GST):</span>
                      <span className="text-slate-300">{currentLocation.currency} {(selectedOrder.taxBreakdown.sgst || (selectedOrder.taxAmount / 2)).toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-slate-400 font-mono">
                    <span>Tax ({currentLocation.defaultTaxRate}%):</span>
                    <span className="text-slate-200">{currentLocation.currency} {selectedOrder.taxAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-slate-800 font-mono">
                  <span>Total Payable:</span>
                  <span className="text-emerald-400">{currentLocation.currency} {selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => onSendNotification(selectedOrder)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-white" />
                <span>Dispatch WhatsApp Alert</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedOrder.status !== 'ready_pickup' && selectedOrder.status !== 'completed' && (
                  <button
                    onClick={() => {
                      const updated = { ...selectedOrder, status: 'ready_pickup' as const };
                      onUpdateWorkOrder(updated);
                      setSelectedOrder(updated);
                    }}
                    className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Mark Ready for Pickup
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
