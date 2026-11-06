import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Wrench, 
  DollarSign, 
  Boxes, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  ArrowUpRight, 
  ShieldCheck,
  ChevronRight,
  Zap,
  Globe2,
  History,
  Settings,
  Search,
  Sparkles,
  Plus,
  Car,
  QrCode
} from 'lucide-react';
import { Location, WorkOrder, InventoryItem, Technician, ViewMode } from '../types';
import { HERO_IMAGES } from '../data/mockData';
import { StatCard } from '../components/ui/StatCard';
import { motion } from 'motion/react';

interface DashboardViewProps {
  currentLocation: Location;
  locations: Location[];
  workOrders: WorkOrder[];
  inventory: InventoryItem[];
  technicians: Technician[];
  onSelectView: (view: ViewMode) => void;
  onOpenWorkOrder: (wo: WorkOrder) => void;
  onOpenNewWorkOrder?: () => void;
  onOpenQrScanner?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentLocation,
  locations,
  workOrders,
  inventory,
  technicians,
  onSelectView,
  onOpenWorkOrder,
  onOpenNewWorkOrder,
  onOpenQrScanner
}) => {
  const locationWos = workOrders.filter(w => w.locationId === currentLocation.id);
  const activeWos = locationWos.filter(w => w.status !== 'completed' && w.status !== 'invoiced');
  
  // Calculate revenue metrics
  const totalRevenue = locationWos.reduce((acc, w) => acc + w.totalAmount, 0);
  const totalTax = locationWos.reduce((acc, w) => acc + w.taxAmount, 0);

  // Low stock inventory items
  const lowStockItems = inventory.filter(item => {
    const stock = item.locationStock[currentLocation.id]?.quantity || 0;
    return stock <= item.minThreshold;
  });

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Hero Split */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 lg:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-orange-400">
                <Building2 className="w-4 h-4" />
                <span>{currentLocation.name}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400 font-semibold">{currentLocation.code}</span>
                {currentLocation.region === 'INDIA' && (
                  <span className="bg-orange-950 text-orange-300 px-1.5 py-0.5 rounded text-[10px] border border-orange-800/60 font-bold">
                    GSTIN: {currentLocation.gstin}
                  </span>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                India Enterprise & Global Auto Workshop Operating System
              </h1>
              <p className="text-slate-400 text-sm max-w-xl">
                Real-time bay occupancy, synchronized spare parts warehouses with HSN tracking, technician scheduling, and automated GST & tax compliance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectView('work_orders')}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg shadow-md transition-colors flex items-center gap-2"
              >
                <Wrench className="w-4 h-4" />
                <span>Job Cards ({activeWos.length} In Progress)</span>
              </button>

              <button
                onClick={() => onSelectView('inventory')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <Boxes className="w-4 h-4 text-emerald-400" />
                <span>Warehouse & Depot Sync</span>
              </button>

              {onOpenNewWorkOrder && (
                <button
                  onClick={onOpenNewWorkOrder}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white text-xs font-bold rounded-lg shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Smart Vehicle Lookup Check-In</span>
                </button>
              )}

              {onOpenQrScanner && (
                <button
                  onClick={onOpenQrScanner}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-orange-400" />
                  <span>Scan QR / Barcode</span>
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[200px] lg:min-h-full">
            <img 
              src={HERO_IMAGES.workshop} 
              alt="Automotive Garage Workshop" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent lg:bg-gradient-to-r lg:from-slate-900 lg:to-transparent" />
          </div>
        </div>
      </div>

      {/* High-Visibility Feature Launchpad Hub (Direct 1-Click Access) */}
      <div className="bg-slate-900/90 border border-orange-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Workshop Operations & Smart Automation Hub
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Quick access to mobile QR label scanner, registration auto-fill, service passport, and setup wizard
            </p>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-orange-950/80 text-orange-300 border border-orange-900/60">
            Enterprise Feature Suite Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Mobile QR Code Scanner */}
          <div className="bg-slate-950 border border-slate-800 hover:border-orange-500/60 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-colors group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center font-bold">
                  <QrCode className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-900">
                  Mobile Camera
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                Mobile QR & Label Scanner
              </h3>
              <p className="text-xs text-slate-400">
                Scan vehicle windshield FASTag barcodes or spare parts depot labels via device camera to eliminate manual typing errors.
              </p>
            </div>
            <button
              onClick={() => onOpenQrScanner && onOpenQrScanner()}
              className="w-full py-2 px-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Launch QR Scanner</span>
            </button>
          </div>

          {/* Card 2: Smart Vehicle Lookup */}
          <div className="bg-slate-950 border border-slate-800 hover:border-orange-500/60 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-colors group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center font-bold">
                  <Search className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-900">
                  Instant Auto-Fill
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                Smart Plate Lookup Check-In
              </h3>
              <p className="text-xs text-slate-400">
                Type registration number (e.g. <span className="text-orange-300 font-mono">KA 03 MM 8899</span>) to auto-fill Make, Model, Year, Variant, VIN, and Insurance.
              </p>
            </div>
            <button
              onClick={() => onOpenNewWorkOrder && onOpenNewWorkOrder()}
              className="w-full py-2 px-3 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Open Smart Check-In</span>
            </button>
          </div>

          {/* Card 3: Vehicle Service History Passport */}
          <div className="bg-slate-950 border border-slate-800 hover:border-blue-500/60 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-colors group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                  <History className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-900">
                  Audit Passport
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                Vehicle Service History Tracker
              </h3>
              <p className="text-xs text-slate-400">
                Search any customer's vehicle license plate to inspect full past visit logs, replaced spare parts, lifetime spend, and cleared OBD-II trouble codes.
              </p>
            </div>
            <button
              onClick={() => onSelectView('vehicle_history')}
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>Search Vehicle History</span>
            </button>
          </div>

          {/* Card 4: First-Time Garage Setup Wizard */}
          <div className="bg-slate-950 border border-slate-800 hover:border-emerald-500/60 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-colors group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Settings className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-900">
                  4-Step Wizard
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                First-Time Garage Setup Wizard
              </h3>
              <p className="text-xs text-slate-400">
                Setup guide for new garage owners: workshop profile, India GSTIN split / global VAT, hydraulic lifts & bays, WhatsApp API, and UPI QR gateway.
              </p>
            </div>
            <button
              onClick={() => onSelectView('garage_setup')}
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Launch Setup Wizard</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4-KPI Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Revenue & Tax */}
        <StatCard
          title="Location Revenue (MTD)"
          value={`${currentLocation.currency} ${totalRevenue.toLocaleString(currentLocation.region === 'INDIA' ? 'en-IN' : 'en-US', { minimumFractionDigits: 2 })}`}
          accentColor="orange"
          icon={<DollarSign className="w-4 h-4 text-orange-400" />}
          subtitle={
            <>
              <span>Tax ({currentLocation.taxJurisdiction.replace('_', ' ')}):</span>
              <span className="font-mono text-slate-300 font-semibold">{currentLocation.currency} {totalTax.toFixed(2)}</span>
            </>
          }
          onClick={() => onSelectView('financials')}
        />

        {/* Metric 2: Bay Utilization */}
        <StatCard
          title="Service Bay Utilization"
          value="89.2%"
          accentColor="emerald"
          trend={{ value: "+5.4%", isPositive: true }}
          icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
          subtitle={
            <div className="w-full space-y-1">
              <div className="flex justify-between text-[10px]">
                <span>Active Bays Occupied</span>
                <span>{currentLocation.baysCount} Bays</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '89.2%' }} />
              </div>
            </div>
          }
          onClick={() => onSelectView('scheduling')}
        />

        {/* Metric 3: Avg Turnaround Time */}
        <StatCard
          title="Avg Turnaround (TAT)"
          value="2.8 hrs"
          accentColor="purple"
          icon={<Clock className="w-4 h-4 text-purple-400" />}
          subtitle={
            <>
              <span>Tech Efficiency Score:</span>
              <span className="font-mono text-emerald-400 font-bold">98.6%</span>
            </>
          }
        />

        {/* Metric 4: Spare Parts Depot Stock */}
        <StatCard
          title="Warehouse Stock Alert"
          value={`${lowStockItems.length} SKUs`}
          accentColor="amber"
          icon={<Boxes className="w-4 h-4 text-amber-400" />}
          trend={{ value: lowStockItems.length > 0 ? "Reorder" : "Optimal", isPositive: lowStockItems.length === 0 }}
          subtitle={
            <>
              <span>Inter-Depot Sync:</span>
              <span className="text-emerald-400 font-medium">Synced Across Depots</span>
            </>
          }
          onClick={() => onSelectView('inventory')}
        />
      </div>

      {/* Main Grid: Efficiency Analytics + Active Work Orders Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profit & Service Analytics */}
        <div className="lg:col-span-7 space-y-6">
          {/* Service Efficiency & Margin Breakdown Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-orange-400" />
                  Service Efficiency & Profit Margin Analysis
                </h3>
                <p className="text-xs text-slate-400">
                  Gross margin performance across service labor vs spare parts markup
                </p>
              </div>
              <button 
                onClick={() => onSelectView('financials')}
                className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
              >
                <span>GST & Tax Ledgers</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Custom SVG Margin Stack Bar */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Service Bay Labor Gross Margin</span>
                  <span className="text-emerald-400 font-bold">64.5%</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-md overflow-hidden border border-slate-800">
                  <div className="bg-emerald-500 h-full rounded-md" style={{ width: '64.5%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Spare Parts Wholesale-to-Retail Markup</span>
                  <span className="text-orange-400 font-bold">38.2%</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-md overflow-hidden border border-slate-800">
                  <div className="bg-orange-500 h-full rounded-md" style={{ width: '38.2%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Overall Facility Net Operating Margin</span>
                  <span className="text-purple-400 font-bold">46.8%</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-md overflow-hidden border border-slate-800">
                  <div className="bg-purple-500 h-full rounded-md" style={{ width: '46.8%' }} />
                </div>
              </div>
            </div>

            {/* Multi-Location Comparison Matrix */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Enterprise Locations (India & Global)</span>
                <span className="text-[10px] text-slate-400 font-mono">6 Facilities</span>
              </div>
              <div className="space-y-2">
                {locations.map((loc) => (
                  <div key={loc.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${loc.id === currentLocation.id ? 'bg-orange-500' : 'bg-slate-600'}`} />
                      <span className="font-semibold text-slate-200">{loc.name}</span>
                      <span className="text-[10px] px-1 rounded bg-slate-900 text-slate-400 font-mono">{loc.region}</span>
                    </div>
                    <div className="flex items-center gap-4 font-mono text-[11px]">
                      <span className="text-slate-400">{loc.baysCount} Bays</span>
                      <span className="text-emerald-400 font-bold">{loc.defaultTaxRate}% {loc.taxJurisdiction.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Low Stock Warning */}
          {lowStockItems.length > 0 && (
            <div className="bg-amber-950/30 border border-amber-800/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Depot Low Stock Alert ({lowStockItems.length} SKUs Below Reorder Level)</span>
                </div>
                <button
                  onClick={() => onSelectView('inventory')}
                  className="text-xs text-amber-300 hover:text-amber-100 underline font-semibold"
                >
                  Transfer from NCR Depot
                </button>
              </div>

              <div className="space-y-1.5">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs bg-slate-900/90 p-2 rounded border border-amber-900/50">
                    <div>
                      <span className="font-semibold text-slate-200">{item.partName}</span>
                      <span className="text-slate-400 ml-2 font-mono text-[11px]">{item.sku} (HSN: {item.hsnCode})</span>
                    </div>
                    <div className="font-mono text-amber-400 font-bold">
                      Available: {item.locationStock[currentLocation.id]?.quantity || 0} / Threshold {item.minThreshold}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Work Orders Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-orange-400" />
                Active Garage Work Orders
              </h3>
              <button
                onClick={() => onSelectView('work_orders')}
                className="text-xs text-orange-400 hover:text-orange-300 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {activeWos.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No active work orders for {currentLocation.name}.
                </div>
              ) : (
                activeWos.map((wo) => (
                  <div 
                    key={wo.id}
                    onClick={() => onOpenWorkOrder(wo)}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/50 cursor-pointer transition-colors space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-orange-400 group-hover:underline">
                        {wo.orderNumber}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        wo.status === 'in_repair' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                        wo.status === 'in_inspection' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                        wo.status === 'ready_pickup' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {wo.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">
                        {wo.vehicle.year} {wo.vehicle.make} {wo.vehicle.model}
                      </span>
                      <span className="font-mono text-slate-300 font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {wo.vehicle.licensePlate}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center justify-between pt-1 border-t border-slate-900">
                      <span>Customer: {wo.customerName}</span>
                      <span className="font-mono font-bold text-slate-200">
                        {currentLocation.currency} {wo.totalAmount.toLocaleString(currentLocation.region === 'INDIA' ? 'en-IN' : 'en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
