import React, { useState } from 'react';
import { 
  Car, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Receipt, 
  FileText, 
  Camera, 
  Calendar, 
  ChevronRight,
  TrendingUp,
  User,
  ShieldCheck,
  Zap,
  RotateCcw
} from 'lucide-react';
import { WorkOrder, Location } from '../types';

interface VehicleHistoryViewProps {
  workOrders: WorkOrder[];
  currentLocation: Location;
  onOpenWorkOrder: (wo: WorkOrder) => void;
}

export const VehicleHistoryView: React.FC<VehicleHistoryViewProps> = ({
  workOrders,
  currentLocation,
  onOpenWorkOrder
}) => {
  // Unique list of vehicles by license plate
  const uniqueVehicles = Array.from(
    new Map(workOrders.map((wo) => [wo.vehicle.licensePlate, wo.vehicle])).values()
  );

  const [selectedPlate, setSelectedPlate] = useState<string>(uniqueVehicles[0]?.licensePlate || '');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVehicles = uniqueVehicles.filter(v =>
    v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeVehicle = uniqueVehicles.find(v => v.licensePlate === selectedPlate) || uniqueVehicles[0];

  // All work orders for this vehicle across all visits sorted newest to oldest
  const vehicleJobs = workOrders
    .filter(wo => wo.vehicle.licensePlate === activeVehicle?.licensePlate)
    .sort((a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime());

  // Aggregate metrics
  const totalLifetimeSpent = vehicleJobs.reduce((acc, j) => acc + j.totalAmount, 0);
  const totalVisits = vehicleJobs.length;
  const partsReplacedCount = vehicleJobs.reduce((acc, j) => acc + j.partsUsed.length, 0);
  const latestMileage = vehicleJobs[0]?.vehicle.mileage || activeVehicle?.mileage || 0;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Car className="w-5 h-5 text-orange-400" />
            Vehicle Digital Service Passport & Lifetime History
          </h2>
          <p className="text-xs text-slate-400">
            Complete audit trail of previous workshop visits, replaced OEM spare parts, recurring OBD-II diagnostic fault codes, and odometer progression
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Registration Plate / VIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Vehicle Quick Select Strip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {filteredVehicles.map((veh) => {
          const isSelected = selectedPlate === veh.licensePlate;
          return (
            <button
              key={veh.licensePlate}
              onClick={() => setSelectedPlate(veh.licensePlate)}
              className={`p-3 rounded-xl border text-xs font-medium text-left whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-orange-600 border-orange-500 text-white shadow-md font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-sm">{veh.licensePlate}</div>
              <div className="text-[11px] text-slate-200 mt-0.5">
                {veh.year} {veh.make} {veh.model}
              </div>
            </button>
          );
        })}
      </div>

      {activeVehicle && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Vehicle Health Dossier */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div>
                <span className="text-[10px] text-orange-400 font-mono uppercase font-bold">Vehicle Digital Passport</span>
                <h3 className="text-xl font-extrabold text-white">
                  {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                </h3>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Registration: <strong className="text-white bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{activeVehicle.licensePlate}</strong>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">VIN Number:</span>
                  <span className="text-slate-200 truncate max-w-[150px]">{activeVehicle.vin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fuel & Powertrain:</span>
                  <span className="text-emerald-400 font-bold">{activeVehicle.fuelType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Odometer:</span>
                  <span className="text-white font-bold">{latestMileage.toLocaleString()} {activeVehicle.mileageUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Color:</span>
                  <span className="text-slate-300">{activeVehicle.color}</span>
                </div>
                {activeVehicle.transmission && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gearbox:</span>
                    <span className="text-slate-300">{activeVehicle.transmission}</span>
                  </div>
                )}
              </div>

              {/* Lifetime Spend & Frequency */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Lifetime Spent</span>
                  <div className="text-base font-bold font-mono text-emerald-400">
                    {currentLocation.currency} {totalLifetimeSpent.toLocaleString(currentLocation.region === 'INDIA' ? 'en-IN' : 'en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Garage Visits</span>
                  <div className="text-base font-bold font-mono text-orange-400">
                    {totalVisits} Times
                  </div>
                </div>
              </div>

              {/* Replaced Parts Summary */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">
                  Cumulative Parts Installed ({partsReplacedCount})
                </span>
                <div className="space-y-1.5">
                  {vehicleJobs.flatMap(j => j.partsUsed).map((pt, i) => (
                    <div key={i} className="flex justify-between text-slate-300 text-[11px] pb-1 border-b border-slate-900">
                      <span className="truncate max-w-[180px]">{pt.partName}</span>
                      <span className="font-mono text-slate-500">Qty: {pt.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Historical Visits Timeline */}
          <div className="lg:col-span-8 space-y-4">
            <div className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center justify-between">
              <span>Chronological Workshop Visit History ({vehicleJobs.length} Records)</span>
              <span className="text-slate-500 font-normal">Sorted Newest First</span>
            </div>

            <div className="space-y-4">
              {vehicleJobs.map((job, idx) => (
                <div key={job.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-md relative group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-950 border border-orange-800/80 flex items-center justify-center text-orange-400 font-mono font-bold text-xs">
                        #{vehicleJobs.length - idx}
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-orange-400 block">{job.orderNumber}</span>
                        <span className="text-[11px] text-slate-400">
                          Visit Date: {job.scheduledTime.split('T')[0]} · Bay: {job.bayId}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-950 text-blue-300 border border-blue-800">
                        {job.status.replace('_', ' ')}
                      </span>
                      <button
                        onClick={() => onOpenWorkOrder(job)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Inspect Job Card
                      </button>
                    </div>
                  </div>

                  {/* Customer Complaints on this visit */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Complaints & Issues Fixed</span>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                      {job.reportedIssues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>

                  {/* OBD Fault Codes if any */}
                  {job.dtcCodes.length > 0 && (
                    <div className="flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-950/30 p-2 rounded border border-purple-800/50">
                      <span>DTC Codes Cleared:</span>
                      <span className="font-bold">{job.dtcCodes.join(', ')}</span>
                    </div>
                  )}

                  {/* Parts & Labor Costs */}
                  <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
                    <div className="text-slate-400">
                      <span>Customer: <strong className="text-slate-200">{job.customerName}</strong></span>
                      <span className="mx-2">·</span>
                      <span>Odometer at Service: <strong className="text-slate-200">{job.vehicle.mileage.toLocaleString()} {job.vehicle.mileageUnit}</strong></span>
                    </div>

                    <div className="font-bold text-emerald-400 text-sm">
                      Total: {currentLocation.currency} {job.totalAmount.toLocaleString(currentLocation.region === 'INDIA' ? 'en-IN' : 'en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
