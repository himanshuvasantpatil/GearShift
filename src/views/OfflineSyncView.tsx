import React from 'react';
import { 
  WifiOff, 
  Wifi, 
  RefreshCw, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  HardDrive 
} from 'lucide-react';
import { OfflineSyncItem } from '../types';

interface OfflineSyncViewProps {
  isOffline: boolean;
  onToggleOffline: () => void;
  syncQueue: OfflineSyncItem[];
  onForceSync: () => void;
}

export const OfflineSyncView: React.FC<OfflineSyncViewProps> = ({
  isOffline,
  onToggleOffline,
  syncQueue,
  onForceSync
}) => {
  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <WifiOff className="w-5 h-5 text-amber-400" />
            Offline Mode & Remote Sync Queue Engine
          </h2>
          <p className="text-xs text-slate-400">
            Guaranteed data persistence for remote field garages with intermittent internet connectivity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleOffline}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 border transition-colors ${
              isOffline
                ? 'bg-amber-950 border-amber-800 text-amber-300'
                : 'bg-emerald-950 border-emerald-800 text-emerald-300'
            }`}
          >
            {isOffline ? <WifiOff className="w-4 h-4 animate-pulse" /> : <Wifi className="w-4 h-4" />}
            <span>{isOffline ? 'Simulating Remote Offline Area' : 'Online Connection Active'}</span>
          </button>

          <button
            onClick={onForceSync}
            disabled={syncQueue.length === 0}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Force Sync Local Database</span>
          </button>
        </div>
      </div>

      {/* Sync Queue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400">Offline Pending Queue Items</span>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">{syncQueue.length} Actions</div>
          <span className="text-[11px] text-slate-500 font-mono block">Stored safely in IndexedDB</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400">Network Telemetry Status</span>
          <div className="text-2xl font-bold font-mono text-white">
            {isOffline ? <span className="text-amber-400">DISCONNECTED</span> : <span className="text-emerald-400">CONNECTED</span>}
          </div>
          <span className="text-[11px] text-slate-500 font-mono block">Auto-retry on reconnect</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400">Conflict Resolution Strategy</span>
          <div className="text-lg font-bold font-mono text-blue-400">Server-Authoritative</div>
          <span className="text-[11px] text-slate-500 font-mono block">LWW (Last Write Wins) policy</span>
        </div>
      </div>

      {/* Pending Items Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 bg-slate-950 border-b border-slate-800">
          <span className="text-xs font-bold text-white font-mono uppercase">
            Pending Offline Queue Ledger ({syncQueue.length} Queue Items)
          </span>
        </div>

        {syncQueue.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="font-bold text-slate-300">All local offline changes are fully synchronized!</div>
            <p>Any work order or inspection updates captured while offline will be listed here.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <th className="p-3">Action Type</th>
                <th className="p-3">Payload Data</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Attempts</th>
                <th className="p-3 text-right">Sync Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {syncQueue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-amber-400 uppercase">{item.type}</td>
                  <td className="p-3 font-mono text-slate-300 max-w-xs truncate text-[11px]">
                    {JSON.stringify(item.payload)}
                  </td>
                  <td className="p-3 font-mono text-slate-400 text-[11px]">{item.timestamp}</td>
                  <td className="p-3 font-mono text-slate-300">{item.attempts}</td>
                  <td className="p-3 text-right font-mono font-bold text-amber-400">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
