import React, { useEffect, useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Car, 
  Boxes, 
  QrCode, 
  Copy, 
  Check, 
  Building2,
  ShieldCheck
} from 'lucide-react';
import QRCode from 'qrcode';
import { WorkOrder, InventoryItem, Location, VehicleSpec } from '../types';

interface QrLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: {
    type: 'vehicle' | 'inventory';
    vehicle?: VehicleSpec;
    workOrder?: WorkOrder;
    item?: InventoryItem;
  } | null;
  currentLocation: Location;
}

export const QrLabelModal: React.FC<QrLabelModalProps> = ({
  isOpen,
  onClose,
  entity,
  currentLocation
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Generate payload string
  const getPayloadString = () => {
    if (!entity) return '';
    if (entity.type === 'vehicle' && entity.vehicle) {
      return `GEARSHIFT:VEHICLE:${entity.vehicle.licensePlate}`;
    }
    if (entity.type === 'inventory' && entity.item) {
      return `GEARSHIFT:PART:${entity.item.sku}`;
    }
    return '';
  };

  const payloadString = getPayloadString();

  useEffect(() => {
    if (!isOpen || !payloadString) {
      setQrDataUrl('');
      return;
    }

    QRCode.toDataURL(payloadString, {
      width: 280,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate QR:', err));
  }, [isOpen, payloadString]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPayload = () => {
    if (!payloadString) return;
    navigator.clipboard.writeText(payloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!isOpen || !entity) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {entity.type === 'vehicle' ? 'Vehicle Service QR Label' : 'Warehouse Bin QR Label'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Official scannable RFID / Barcode label for tracking
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Printable Label Container */}
        <div className="p-4 space-y-4">
          <div 
            id="printable-qr-label"
            className="bg-white text-slate-900 p-4 rounded-2xl border-2 border-slate-300 space-y-3 shadow-lg select-text"
          >
            {/* Top Brand Header on Label */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-sm uppercase">
                  GEARSHIFT<span className="text-orange-600">ERP</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500 font-bold">
                  {currentLocation.code}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                {entity.type === 'vehicle' ? 'GATE PASS / CHECK-IN' : 'DEPOT INVENTORY'}
              </span>
            </div>

            {/* QR Code and Specs Side-by-Side */}
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-5 flex flex-col items-center justify-center">
                {qrDataUrl ? (
                  <img 
                    src={qrDataUrl} 
                    alt="GearShift QR Label" 
                    className="w-32 h-32 border border-slate-200 rounded-lg p-1 bg-white shadow-sm"
                  />
                ) : (
                  <div className="w-32 h-32 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400 font-mono">
                    Generating...
                  </div>
                )}
                <span className="text-[9px] font-mono text-slate-500 mt-1">
                  Scan with Camera
                </span>
              </div>

              {/* Label Specifications */}
              <div className="col-span-7 space-y-1.5 text-xs">
                {entity.type === 'vehicle' && entity.vehicle && (
                  <>
                    <div className="font-extrabold text-sm text-slate-950 font-mono tracking-tight bg-slate-100 p-1 rounded border border-slate-300 text-center">
                      {entity.vehicle.licensePlate}
                    </div>
                    <div className="font-bold text-slate-900 leading-tight">
                      {entity.vehicle.year} {entity.vehicle.make} {entity.vehicle.model}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {entity.vehicle.variant}
                    </div>
                    <div className="text-[10px] font-mono text-slate-600">
                      VIN: <span className="font-bold text-slate-900">{entity.vehicle.vin}</span>
                    </div>
                    {entity.workOrder && (
                      <div className="text-[10px] font-mono text-orange-700 font-bold pt-1 border-t border-slate-200">
                        Job Card: #{entity.workOrder.orderNumber}
                      </div>
                    )}
                  </>
                )}

                {entity.type === 'inventory' && entity.item && (
                  <>
                    <div className="font-extrabold text-sm text-slate-950 font-mono tracking-tight bg-slate-100 p-1 rounded border border-slate-300 text-center">
                      {entity.item.sku}
                    </div>
                    <div className="font-bold text-slate-900 leading-tight">
                      {entity.item.partName}
                    </div>
                    <div className="text-[10px] text-slate-600">
                      Brand: <span className="font-bold">{entity.item.brand}</span> · HSN: {entity.item.hsnCode}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 p-1 rounded border border-emerald-200 flex justify-between">
                      <span>Bin: {entity.item.locationStock[currentLocation.id]?.rackLocation || 'A-01'}</span>
                      <span>MRP: {currentLocation.currency} {entity.item.retailPrice}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom 1D Simulated Barcode & Security Strip */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] font-mono text-slate-500">
              <span className="truncate max-w-[200px]">{payloadString}</span>
              <span>VERIFIED SECURE</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={handlePrint}
              className="py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Label</span>
            </button>

            <button
              onClick={handleCopyPayload}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'Code Copied!' : 'Copy Raw Code'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
