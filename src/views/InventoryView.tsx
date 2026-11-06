import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  ArrowLeftRight, 
  Plus, 
  Sparkles, 
  AlertTriangle, 
  Building2, 
  DollarSign, 
  Tag, 
  CheckCircle2, 
  ChevronRight,
  PackageCheck,
  RefreshCw,
  Truck,
  QrCode
} from 'lucide-react';
import { InventoryItem, Location } from '../types';
import { HERO_IMAGES } from '../data/mockData';

interface InventoryViewProps {
  inventory: InventoryItem[];
  locations: Location[];
  currentLocation: Location;
  onUpdateInventory: (updated: InventoryItem[]) => void;
  onOpenAiPartsFinder: () => void;
  onOpenQrScanner?: () => void;
  onPrintQrLabel?: (entity: { type: 'inventory'; item: InventoryItem }) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  locations,
  currentLocation,
  onUpdateInventory,
  onOpenAiPartsFinder,
  onOpenQrScanner,
  onPrintQrLabel
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [transferModalItem, setTransferModalItem] = useState<InventoryItem | null>(null);
  const [transferTargetLoc, setTransferTargetLoc] = useState<string>(locations[1]?.id || 'loc-in-2');
  const [transferQty, setTransferQty] = useState<number>(2);

  const categories = ['all', 'brakes', 'engine', 'suspension', 'fluids', 'electrical', 'filters', 'tires'];

  const filteredItems = inventory.filter(item => {
    const matchesSearch = 
      item.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.oemPartNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.hsnCode && item.hsnCode.includes(searchQuery)) ||
      item.aftermarketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.compatibleVehicles.some(v => v.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleExecuteTransfer = () => {
    if (!transferModalItem) return;
    const sourceLocId = currentLocation.id;

    const sourceStock = transferModalItem.locationStock[sourceLocId]?.quantity || 0;
    if (sourceStock < transferQty) {
      alert(`Insufficient stock in ${currentLocation.name}. Available: ${sourceStock}`);
      return;
    }

    const updated = inventory.map(item => {
      if (item.id === transferModalItem.id) {
        const newStock = { ...item.locationStock };
        newStock[sourceLocId] = {
          ...newStock[sourceLocId],
          quantity: (newStock[sourceLocId]?.quantity || 0) - transferQty
        };
        newStock[transferTargetLoc] = {
          rackLocation: newStock[transferTargetLoc]?.rackLocation || 'TRANSIT-DEPOT-BIN',
          quantity: (newStock[transferTargetLoc]?.quantity || 0) + transferQty
        };
        return { ...item, locationStock: newStock };
      }
      return item;
    });

    onUpdateInventory(updated);
    const targetLocName = locations.find(l => l.id === transferTargetLoc)?.name || 'target location';
    alert(`Transfer of ${transferQty} unit(s) of ${transferModalItem.partName} dispatched with e-Way Bill to ${targetLocName}!`);
    setTransferModalItem(null);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Visual Depot Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-8 p-6 lg:p-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Boxes className="w-4 h-4" />
              <span>Multi-Depot Spare Parts Distribution & Logistics Network</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              OEM & Aftermarket Auto Spare Parts Warehouses
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl">
              Cross-reference OEM parts with HSN codes, check inventory across regional distribution centers (Bengaluru, Mumbai, Delhi NCR, London, Dubai), and execute instant inter-depot transfers.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenAiPartsFinder}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-md transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Parts Cross-Reference & OEM Finder</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 relative min-h-[160px] lg:min-h-full">
            <img 
              src={HERO_IMAGES.warehouse} 
              alt="Spare Parts Depot Warehouse" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent lg:bg-gradient-to-r lg:from-slate-900 lg:to-transparent" />
          </div>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onOpenQrScanner && (
            <button
              onClick={onOpenQrScanner}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan Part QR</span>
            </button>
          )}

          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Part, SKU, HSN Code, Car Model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Spare Parts Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white font-mono uppercase">
            Depot Stock & Cross-Reference Table ({filteredItems.length} SKUs)
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Active Warehouse: <strong className="text-orange-400">{currentLocation.name}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <th className="p-3">Part Name & Compatibility</th>
                <th className="p-3">SKU / OEM Part #</th>
                <th className="p-3">HSN & GST</th>
                <th className="p-3">Stock ({currentLocation.code})</th>
                <th className="p-3 font-mono">Bin Location</th>
                <th className="p-3 text-right">Wholesale Cost</th>
                <th className="p-3 text-right">Retail Price</th>
                <th className="p-3 text-right">Logistics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredItems.map((item) => {
                const stockObj = item.locationStock[currentLocation.id];
                const currentQty = stockObj?.quantity || 0;
                const isLow = currentQty <= item.minThreshold;

                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white">{item.partName}</div>
                      <div className="text-[11px] text-slate-400">
                        Brand: <strong className="text-slate-300">{item.brand}</strong> · Fits: <span className="text-slate-300 font-medium">{item.compatibleVehicles.slice(0, 2).join(', ')}</span>
                      </div>
                    </td>

                    <td className="p-3 font-mono text-slate-300">
                      <div className="text-orange-400 font-semibold">{item.sku}</div>
                      <div className="text-[10px] text-slate-500">OEM: {item.oemPartNumber}</div>
                    </td>

                    <td className="p-3 font-mono">
                      <div className="text-slate-200">{item.hsnCode || '8708'}</div>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800 font-bold">
                        GST {item.gstRate}%
                      </span>
                    </td>

                    <td className="p-3 font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded ${
                        isLow ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'text-emerald-400'
                      }`}>
                        {currentQty} {item.unit}
                      </span>
                      {isLow && <span className="text-[10px] text-amber-400 ml-1.5 font-sans">(Reorder)</span>}
                    </td>

                    <td className="p-3 font-mono text-slate-300 text-[11px]">
                      {stockObj?.rackLocation || 'DEPOT-A1'}
                    </td>

                    <td className="p-3 text-right font-mono text-slate-400">
                      {currentLocation.currency} {item.costPrice.toLocaleString(currentLocation.region === 'INDIA' ? 'en-IN' : 'en-US')}
                    </td>

                    <td className="p-3 text-right font-mono font-bold text-emerald-400">
                      {currentLocation.currency} {item.retailPrice.toLocaleString(currentLocation.region === 'INDIA' ? 'en-IN' : 'en-US')}
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onPrintQrLabel && (
                          <button
                            onClick={() => onPrintQrLabel({ type: 'inventory', item })}
                            className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-700 transition-colors cursor-pointer"
                            title="Generate & Print Bin QR Label"
                          >
                            <QrCode className="w-3.5 h-3.5 text-orange-400" />
                          </button>
                        )}
                        <button
                          onClick={() => setTransferModalItem(item)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <ArrowLeftRight className="w-3 h-3 text-orange-400" />
                          <span>Transfer</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inter-Depot Stock Transfer Modal */}
      {transferModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-400" />
                Inter-Warehouse Logistics Transfer
              </h3>
              <button onClick={() => setTransferModalItem(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-white">{transferModalItem.partName}</div>
                <div className="text-slate-400 font-mono">SKU: {transferModalItem.sku} · HSN: {transferModalItem.hsnCode}</div>
                <div className="text-emerald-400 font-mono pt-1">
                  Available in {currentLocation.code}: {transferModalItem.locationStock[currentLocation.id]?.quantity || 0} units
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono">Destination Warehouse / Garage</label>
                <select
                  value={transferTargetLoc}
                  onChange={(e) => setTransferTargetLoc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-medium focus:outline-none"
                >
                  {locations.filter(l => l.id !== currentLocation.id).map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono">Quantity to Transfer</label>
                <input
                  type="number"
                  min="1"
                  max={transferModalItem.locationStock[currentLocation.id]?.quantity || 1}
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono focus:outline-none"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-orange-950/40 border border-orange-900/60 text-[11px] text-orange-300 font-mono">
                ✓ Automated e-Way Bill generated for inter-state consignment
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setTransferModalItem(null)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteTransfer}
                className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Dispatch Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
