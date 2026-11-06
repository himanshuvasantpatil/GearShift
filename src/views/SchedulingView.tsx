import React, { useState } from 'react';
import { 
  CalendarDays, 
  Clock, 
  UserCheck, 
  Wrench, 
  ShieldCheck, 
  Plus, 
  CheckCircle2,
  Building2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Location, Technician, WorkOrder } from '../types';

interface SchedulingViewProps {
  currentLocation: Location;
  technicians: Technician[];
  workOrders: WorkOrder[];
  onReassignTech: (techId: string, bayId: string) => void;
}

export const SchedulingView: React.FC<SchedulingViewProps> = ({
  currentLocation,
  technicians,
  workOrders,
  onReassignTech
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-11-05');
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);

  // Generate 8 Bays for current location
  const bays = Array.from({ length: currentLocation.baysCount }, (_, i) => ({
    id: `Bay ${String(i + 1).padStart(2, '0')}`,
    type: i === 2 ? 'Diagnostic & ECU' : i === 0 ? 'Lift 2-Post' : 'Standard Alignment Bay'
  }));

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-400" />
            Real-Time Technician Scheduling & Bay Allocation
          </h2>
          <p className="text-xs text-slate-400">
            Dynamic bay occupancy, master technician shifts, and live job progression for {currentLocation.name}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-1 rounded-lg text-xs">
          <button className="p-1 text-slate-400 hover:text-white">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono font-bold text-white px-2">Thursday, Nov 5, 2026</span>
          <button className="p-1 text-slate-400 hover:text-white">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Technicians Roster Cards */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
          Available Master Technicians & Specialists ({technicians.length})
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {technicians.map((tech) => (
            <div
              key={tech.id}
              onClick={() => setSelectedTech(tech)}
              className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                selectedTech?.id === tech.id
                  ? 'bg-blue-950/40 border-blue-500 shadow-md'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{tech.name}</span>
                <span className={`w-2 h-2 rounded-full ${
                  tech.status === 'busy' ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>{tech.skillTier}</span>
                <span className="font-mono font-bold text-emerald-400">${tech.hourlyRate}/hr</span>
              </div>

              <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-1 border-t border-slate-950">
                <span>Efficiency: <strong className="text-slate-300">{tech.efficiencyRating}%</strong></span>
                <span>{tech.completedJobsMonth} Jobs/Mo</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bay Allocation Gantt Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white font-mono uppercase">
            Service Bay Schedule Matrix ({bays.length} Bays)
          </span>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block" /> In Repair
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block" /> Diagnostic Scan
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded bg-slate-800 inline-block" /> Open Bay
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 font-mono border-b border-slate-800">
                <th className="p-3 w-48 min-w-[180px] border-r border-slate-800">Bay Name</th>
                {timeSlots.map((ts) => (
                  <th key={ts} className="p-2 text-center min-w-[90px] border-r border-slate-800">{ts}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {bays.map((bay) => {
                // Find work order assigned to this bay
                const activeWo = workOrders.find(w => w.bayId.includes(bay.id) || w.bayId === bay.id);
                return (
                  <tr key={bay.id} className="hover:bg-slate-800/30">
                    <td className="p-3 border-r border-slate-800 bg-slate-950/40">
                      <div className="font-bold text-slate-200">{bay.id}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{bay.type}</div>
                    </td>

                    {timeSlots.map((time, idx) => {
                      // Simulating occupied slots for bays
                      const isOccupied = activeWo && (idx >= 1 && idx <= 5);
                      return (
                        <td key={time} className="p-1 border-r border-slate-800 text-center">
                          {isOccupied ? (
                            <div className="bg-blue-600/90 border border-blue-400 text-white p-1.5 rounded text-[10px] font-bold font-mono shadow-sm truncate cursor-pointer hover:bg-blue-500">
                              {activeWo.orderNumber} ({activeWo.vehicle.make})
                            </div>
                          ) : (
                            <div className="h-8 rounded bg-slate-950/40 border border-dashed border-slate-800 flex items-center justify-center text-[10px] text-slate-600 hover:border-slate-600 cursor-pointer">
                              + Assign
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
