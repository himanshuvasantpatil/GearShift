import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Wrench, 
  CalendarDays, 
  Boxes, 
  Receipt, 
  Bell, 
  WifiOff, 
  ShieldCheck, 
  Smartphone, 
  UserCheck,
  History,
  Settings,
  Car
} from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  pendingSyncCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  pendingSyncCount
}) => {
  const navItems: Array<{ id: ViewMode; label: string; icon: React.ReactNode; badge?: number | string }> = [
    { id: 'dashboard', label: 'Dashboard & Margins', icon: <BarChart3 className="w-4 h-4 text-orange-400" /> },
    { id: 'work_orders', label: 'Job Cards & Work Orders', icon: <Wrench className="w-4 h-4 text-slate-300" /> },
    { id: 'vehicle_history', label: 'Vehicle Service History', icon: <History className="w-4 h-4 text-orange-400" /> },
    { id: 'garage_setup', label: 'Garage Setup Wizard', icon: <Settings className="w-4 h-4 text-emerald-400" /> },
    { id: 'scheduling', label: 'Bay & Tech Scheduling', icon: <CalendarDays className="w-4 h-4 text-blue-400" /> },
    { id: 'inventory', label: 'Spare Parts & Warehouses', icon: <Boxes className="w-4 h-4 text-amber-400" /> },
    { id: 'financials', label: 'Invoices & GST / Tax', icon: <Receipt className="w-4 h-4 text-emerald-400" /> },
    { id: 'notifications', label: 'WhatsApp & SMS Alerts', icon: <Bell className="w-4 h-4 text-indigo-400" /> },
    { id: 'offline_sync', label: 'Offline Sync Queue', icon: <WifiOff className="w-4 h-4 text-amber-400" />, badge: pendingSyncCount > 0 ? pendingSyncCount : undefined },
    { id: 'compliance', label: 'DPDPA & GDPR Privacy', icon: <ShieldCheck className="w-4 h-4 text-purple-400" /> },
  ];

  const appModes: Array<{ id: ViewMode; label: string; icon: React.ReactNode; desc: string }> = [
    { id: 'mobile_tech', label: 'Technician Terminal', icon: <Smartphone className="w-4 h-4 text-emerald-400" />, desc: 'Service Bay Inspection & DTC' },
    { id: 'client_portal', label: 'Customer Live Portal', icon: <UserCheck className="w-4 h-4 text-indigo-400" />, desc: 'Live Status, Photo Approval & UPI' },
  ];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between shrink-0 hidden lg:flex select-none">
      <div className="p-4 space-y-6">
        <div>
          <div className="px-3 mb-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            Garage Operations
          </div>
          <nav className="space-y-1 relative">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`w-full relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors z-10 cursor-pointer ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActivePill"
                      className="absolute inset-0 bg-orange-600 rounded-xl shadow-md -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <div className="flex items-center gap-2.5 whitespace-nowrap">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-white text-orange-950' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="px-3 mb-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            Client & Tech Portals
          </div>
          <div className="space-y-2">
            {appModes.map((mode) => {
              const isActive = currentView === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => onSelectView(mode.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 border-orange-500 text-white shadow-md font-semibold'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    {mode.icon}
                    <span>{mode.label}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {mode.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer System Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50 text-slate-400 text-[11px] space-y-1">
        <div className="flex items-center justify-between font-mono">
          <span>Enterprise Core:</span>
          <span className="text-emerald-400 font-semibold">India & Global v3.2</span>
        </div>
        <div className="flex items-center justify-between text-slate-500 text-[10px]">
          <span>GST / HSN Engine:</span>
          <span>Active (18% / 28%)</span>
        </div>
      </div>
    </aside>
  );
};

