import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Wrench, 
  Car, 
  Boxes, 
  QrCode, 
  Settings, 
  History, 
  Smartphone, 
  UserCheck, 
  ShieldCheck, 
  ChevronRight,
  Zap,
  ArrowRight
} from 'lucide-react';
import { WorkOrder, InventoryItem, Location, ViewMode, VehicleSpec } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  workOrders: WorkOrder[];
  inventory: InventoryItem[];
  currentLocation: Location;
  onSelectView: (view: ViewMode) => void;
  onSelectWorkOrder: (wo: WorkOrder) => void;
  onSelectInventoryItem: (item: InventoryItem) => void;
  onOpenNewWorkOrder: () => void;
  onOpenQrScanner: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  workOrders,
  inventory,
  currentLocation,
  onSelectView,
  onSelectWorkOrder,
  onSelectInventoryItem,
  onOpenNewWorkOrder,
  onOpenQrScanner
}) => {
  const [query, setQuery] = useState('');

  // Global keydown handler for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  // Filtered job cards
  const matchedWorkOrders = workOrders.filter(w =>
    w.orderNumber.toLowerCase().includes(cleanQuery) ||
    w.customerName.toLowerCase().includes(cleanQuery) ||
    w.vehicle.licensePlate.toLowerCase().includes(cleanQuery) ||
    w.vehicle.make.toLowerCase().includes(cleanQuery) ||
    w.vehicle.model.toLowerCase().includes(cleanQuery) ||
    w.vehicle.vin.toLowerCase().includes(cleanQuery)
  ).slice(0, 5);

  // Filtered inventory parts
  const matchedInventory = inventory.filter(i =>
    i.partName.toLowerCase().includes(cleanQuery) ||
    i.sku.toLowerCase().includes(cleanQuery) ||
    i.brand.toLowerCase().includes(cleanQuery) ||
    i.oemPartNumber.toLowerCase().includes(cleanQuery) ||
    (i.hsnCode && i.hsnCode.includes(cleanQuery))
  ).slice(0, 5);

  // Quick navigation shortcuts
  const navigationItems = [
    { id: 'dashboard' as ViewMode, title: 'Dashboard & Margins', icon: <Wrench className="w-4 h-4 text-orange-400" /> },
    { id: 'work_orders' as ViewMode, title: 'Job Cards & Active Work Orders', icon: <Wrench className="w-4 h-4 text-slate-300" /> },
    { id: 'vehicle_history' as ViewMode, title: 'Vehicle Service History Passport', icon: <History className="w-4 h-4 text-orange-400" /> },
    { id: 'garage_setup' as ViewMode, title: 'First-Time Garage Setup Wizard', icon: <Settings className="w-4 h-4 text-emerald-400" /> },
    { id: 'inventory' as ViewMode, title: 'Spare Parts & Warehouse Depots', icon: <Boxes className="w-4 h-4 text-amber-400" /> },
    { id: 'mobile_tech' as ViewMode, title: 'Technician Bay Mobile App', icon: <Smartphone className="w-4 h-4 text-emerald-400" /> },
    { id: 'client_portal' as ViewMode, title: 'Customer Live Status & UPI Portal', icon: <UserCheck className="w-4 h-4 text-indigo-400" /> },
    { id: 'compliance' as ViewMode, title: 'DPDPA 2023 & GDPR Compliance', icon: <ShieldCheck className="w-4 h-4 text-purple-400" /> },
  ].filter(n => n.title.toLowerCase().includes(cleanQuery));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 p-3 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
      >
        {/* Command Search Header Input */}
        <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-orange-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type registration # (e.g. KA 03), VIN, SKU, or command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-slate-500 font-medium"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1 rounded-md bg-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded font-semibold">
            ESC
          </kbd>
        </div>

        {/* Action Quick Launch Bar */}
        <div className="p-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 text-xs overflow-x-auto">
          <button
            onClick={() => {
              onClose();
              onOpenNewWorkOrder();
            }}
            className="px-3 py-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/40 font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Smart Check-In (Auto-Fill)</span>
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenQrScanner();
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-orange-400" />
            <span>Scan Camera QR</span>
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Section: Job Cards */}
          {matchedWorkOrders.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase font-bold text-slate-500 px-2">
                Job Cards & Active Work Orders ({matchedWorkOrders.length})
              </div>
              {matchedWorkOrders.map((wo) => (
                <button
                  key={wo.id}
                  onClick={() => {
                    onSelectWorkOrder(wo);
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 hover:border-orange-500/60 flex items-center justify-between text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center font-bold font-mono">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-orange-400 transition-colors flex items-center gap-2">
                        <span>{wo.vehicle.year} {wo.vehicle.make} {wo.vehicle.model}</span>
                        <span className="font-mono text-[10px] text-orange-400">#{wo.orderNumber}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Plate: <strong className="text-slate-200">{wo.vehicle.licensePlate}</strong> · {wo.customerName} ({wo.customerPhone})
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-orange-400 transition-colors" />
                </button>
              ))}
            </div>
          )}

          {/* Section: Spare Parts */}
          {matchedInventory.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase font-bold text-slate-500 px-2">
                Spare Parts Depot Inventory ({matchedInventory.length})
              </div>
              {matchedInventory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectInventoryItem(item);
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 hover:border-emerald-500/60 flex items-center justify-between text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                      <Boxes className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {item.partName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        SKU: <span className="text-orange-300 font-semibold">{item.sku}</span> · Stock ({currentLocation.code}): <strong className="text-emerald-400">{item.locationStock[currentLocation.id]?.quantity || 0} {item.unit}</strong>
                      </div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-200 text-xs">
                    {currentLocation.currency} {item.retailPrice}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Section: Quick Views */}
          {navigationItems.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase font-bold text-slate-500 px-2">
                Quick Navigation & Workspaces
              </div>
              {navigationItems.map((nav) => (
                <button
                  key={nav.id}
                  onClick={() => {
                    onSelectView(nav.id);
                    onClose();
                  }}
                  className="w-full p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-left text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    {nav.icon}
                    <span className="font-medium">{nav.title}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                </button>
              ))}
            </div>
          )}

          {matchedWorkOrders.length === 0 && matchedInventory.length === 0 && navigationItems.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-xs">
              No results found for "{query}". Try entering a registration plate, SKU, or vehicle name.
            </div>
          )}
        </div>

        {/* Command Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>GearShift Global Search</span>
          <span className="hidden sm:inline">Press <kbd className="text-slate-400 bg-slate-900 px-1 py-0.5 rounded border border-slate-800">⌘K</kbd> to toggle</span>
        </div>
      </motion.div>
    </div>
  );
};
