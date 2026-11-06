import React, { useState } from 'react';
import { 
  Wrench, 
  MapPin, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  UserCheck, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  Layers, 
  RefreshCw,
  Building2,
  Globe2,
  History,
  Settings,
  Menu,
  X,
  Boxes,
  CalendarDays,
  Receipt,
  Bell,
  QrCode,
  Search
} from 'lucide-react';
import { Location, ViewMode } from '../types';

interface HeaderProps {
  currentLocation: Location;
  locations: Location[];
  onSelectLocation: (location: Location) => void;
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  pendingSyncCount: number;
  onOpenAiAssistant: () => void;
  onOpenNewWorkOrder: () => void;
  onOpenQrScanner: () => void;
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  locations,
  onSelectLocation,
  currentView,
  onSelectView,
  isOffline,
  onToggleOffline,
  pendingSyncCount,
  onOpenAiAssistant,
  onOpenNewWorkOrder,
  onOpenQrScanner,
  onOpenCommandPalette
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const indiaLocations = locations.filter(l => l.region === 'INDIA');
  const globalLocations = locations.filter(l => l.region === 'GLOBAL');

  const handleNavClick = (view: ViewMode) => {
    onSelectView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-3 lg:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Zone 1: Mobile Hamburger + Brand Wordmark + Location */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile menu trigger */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-900/30 group-hover:bg-orange-500 transition-colors">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap block">
                GearShift<span className="text-orange-500 font-extrabold">ERP</span>
              </span>
            </div>
          </div>

          {/* Multi-Location Switcher with India vs Global Tagging */}
          <div className="hidden md:flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select 
              value={currentLocation.id}
              onChange={(e) => {
                const loc = locations.find(l => l.id === e.target.value);
                if (loc) onSelectLocation(loc);
              }}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <optgroup label="🇮🇳 India Enterprise Hubs & Depots" className="bg-slate-900 text-orange-300 font-bold">
                {indiaLocations.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-slate-900 text-slate-200 font-normal">
                    {loc.city} ({loc.code}) - {loc.currency}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🌐 Global Facilities" className="bg-slate-900 text-blue-300 font-bold">
                {globalLocations.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-slate-900 text-slate-200 font-normal">
                    {loc.city} ({loc.code}) - {loc.currency}
                  </option>
                ))}
              </optgroup>
            </select>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-950/80 text-orange-300 font-mono font-semibold border border-orange-900/50">
              {currentLocation.taxJurisdiction.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Zone 2: Universal Search & Quick Feature Shortcuts */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-4">
          <button
            onClick={onOpenCommandPalette}
            className="w-full bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-orange-500/50 rounded-xl px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 flex items-center justify-between shadow-inner transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-orange-400 group-hover:text-orange-300" />
              <span>Search Reg Plate, VIN, SKU, Jobs...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded font-bold">
              ⌘K
            </kbd>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-1.5">
          <button
            onClick={() => handleNavClick('vehicle_history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              currentView === 'vehicle_history'
                ? 'bg-orange-600/20 text-orange-300 border-orange-500/50 shadow-sm'
                : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5 text-orange-400" />
            <span>Vehicle History</span>
          </button>

          <button
            onClick={() => handleNavClick('garage_setup')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              currentView === 'garage_setup'
                ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-emerald-400" />
            <span>Setup Wizard</span>
          </button>
        </div>

        {/* Zone 3: Actions & Offline Status */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Network & Offline Mode Toggle Button */}
          <button
            onClick={onToggleOffline}
            title={isOffline ? "Click to connect back online" : "Click to simulate offline remote area"}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isOffline
                ? 'bg-amber-950/80 border-amber-800 text-amber-200'
                : 'bg-slate-950 border-slate-800 text-emerald-400 hover:border-slate-700'
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline font-mono">Offline</span>
                {pendingSyncCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full font-bold text-[10px] tabular-nums">
                    {pendingSyncCount}
                  </span>
                )}
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline font-mono">Live</span>
              </>
            )}
          </button>

          {/* AI Diagnostic Assistant Button */}
          <button
            onClick={onOpenAiAssistant}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Copilot</span>
          </button>

          {/* QR Code Scanner Primary Button */}
          <button
            onClick={onOpenQrScanner}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
            title="Scan QR / Barcode for vehicles or inventory"
          >
            <QrCode className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>

          {/* New Work Order Primary Action */}
          <button
            onClick={onOpenNewWorkOrder}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Job Card</span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation (renders when hamburger menu is toggled) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex">
          <div className="w-72 max-w-[85vw] bg-slate-900 border-r border-slate-800 h-full p-4 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white text-sm">GearShift Navigation</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Fast Mobile QR Scanner Button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenQrScanner();
                }}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan Vehicle / Parts QR Label</span>
              </button>

              {/* Location Select on Mobile */}
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="text-[10px] text-slate-400 font-mono uppercase font-bold">Facility Location</div>
                <select 
                  value={currentLocation.id}
                  onChange={(e) => {
                    const loc = locations.find(l => l.id === e.target.value);
                    if (loc) {
                      onSelectLocation(loc);
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 text-xs font-semibold"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.currency})
                    </option>
                  ))}
                </select>
              </div>

              {/* Main Nav Links */}
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500 font-mono uppercase font-bold px-2 py-1">
                  Core Operations
                </div>
                {[
                  { id: 'dashboard' as ViewMode, label: 'Dashboard & Margins', icon: <Layers className="w-4 h-4 text-orange-400" /> },
                  { id: 'work_orders' as ViewMode, label: 'Job Cards & Work Orders', icon: <Wrench className="w-4 h-4 text-slate-300" /> },
                  { id: 'vehicle_history' as ViewMode, label: 'Vehicle Service History', icon: <History className="w-4 h-4 text-orange-400" /> },
                  { id: 'garage_setup' as ViewMode, label: 'Garage Setup Wizard', icon: <Settings className="w-4 h-4 text-emerald-400" /> },
                  { id: 'scheduling' as ViewMode, label: 'Bay & Tech Scheduling', icon: <CalendarDays className="w-4 h-4 text-blue-400" /> },
                  { id: 'inventory' as ViewMode, label: 'Spare Parts & Warehouses', icon: <Boxes className="w-4 h-4 text-amber-400" /> },
                  { id: 'financials' as ViewMode, label: 'Invoices & GST / Tax', icon: <Receipt className="w-4 h-4 text-emerald-400" /> },
                  { id: 'notifications' as ViewMode, label: 'WhatsApp & SMS Alerts', icon: <Bell className="w-4 h-4 text-indigo-400" /> },
                  { id: 'compliance' as ViewMode, label: 'DPDPA & GDPR Privacy', icon: <ShieldCheck className="w-4 h-4 text-purple-400" /> },
                  { id: 'offline_sync' as ViewMode, label: 'Offline Sync Queue', icon: <WifiOff className="w-4 h-4 text-slate-400" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      currentView === item.id
                        ? 'bg-orange-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Dedicated Terminals */}
              <div className="space-y-1 pt-2 border-t border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono uppercase font-bold px-2 py-1">
                  Dedicated Apps
                </div>
                <button
                  onClick={() => handleNavClick('mobile_tech')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentView === 'mobile_tech' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Technician Terminal</span>
                </button>
                <button
                  onClick={() => handleNavClick('client_portal')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentView === 'client_portal' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-indigo-400" />
                  <span>Customer Live Portal</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
              GearShift Enterprise v3.2 · India & Global
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};

