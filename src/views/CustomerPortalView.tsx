import React, { useState } from 'react';
import { 
  UserCheck, 
  Car, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  FileText, 
  Camera, 
  Lock,
  ChevronRight,
  Download,
  Building2,
  QrCode,
  Smartphone
} from 'lucide-react';
import { WorkOrder, Location } from '../types';
import { HERO_IMAGES } from '../data/mockData';

interface CustomerPortalViewProps {
  workOrders: WorkOrder[];
  currentLocation: Location;
  onUpdateWorkOrder: (updated: WorkOrder) => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  workOrders,
  currentLocation,
  onUpdateWorkOrder
}) => {
  const [selectedWo, setSelectedWo] = useState<WorkOrder>(workOrders[0]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethodTab, setPaymentMethodTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [upiIdInput, setUpiIdInput] = useState('vikram@okaxis');

  const steps = [
    { key: 'scheduled', label: '1. Checked In' },
    { key: 'in_inspection', label: '2. Diagnostic Scan' },
    { key: 'in_repair', label: '3. Bay Overhaul' },
    { key: 'ready_pickup', label: '4. Ready for Pickup' }
  ];

  const handleApproveEstimate = () => {
    const updated = {
      ...selectedWo,
      estimateApprovedByCustomer: true,
      approvalTimestamp: new Date().toISOString()
    };
    onUpdateWorkOrder(updated);
    setSelectedWo(updated);
    alert('Namaste! Your repair estimate has been digitally authorized. Bay technicians have been notified to initiate parts installation.');
  };

  const handlePayInvoice = () => {
    setIsProcessingPay(true);
    setTimeout(() => {
      setIsProcessingPay(false);
      setShowPaymentModal(false);
      const updated = {
        ...selectedWo,
        paymentStatus: 'paid' as const,
        paymentMode: (paymentMethodTab === 'upi' ? 'UPI / QR' : 'Credit Card') as any,
        upiReference: paymentMethodTab === 'upi' ? `UPI-PAYTM-${Date.now().toString().slice(-6)}` : undefined
      };
      onUpdateWorkOrder(updated);
      setSelectedWo(updated);
      alert(`Payment of ${currentLocation.currency} ${selectedWo.totalAmount.toFixed(2)} successful via ${paymentMethodTab.toUpperCase()}! Official GST Tax Invoice sent to WhatsApp & Email.`);
    }, 1200);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-indigo-400 uppercase">Secure Client Service Portal</div>
              <h2 className="text-xl font-extrabold text-white">
                Live Vehicle Service Tracker & GST Invoicing
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-slate-300">256-Bit SSL Encrypted Access</span>
          </div>
        </div>

        {/* Vehicle Selection Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {workOrders.map((wo) => (
            <button
              key={wo.id}
              onClick={() => setSelectedWo(wo)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-all ${
                selectedWo.id === wo.id
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md font-bold'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Car className="w-3.5 h-3.5" />
                <span>{wo.vehicle.year} {wo.vehicle.make} {wo.vehicle.model}</span>
              </div>
              <div className="text-[10px] font-mono text-slate-300 font-semibold">{wo.vehicle.licensePlate}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Repair Tracker Card */}
      {selectedWo && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          {/* Status Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">Live Bay Progression</span>
              <span className="text-xs font-mono font-bold text-indigo-400">{selectedWo.orderNumber}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              {steps.map((st) => {
                const isCurrent = selectedWo.status === st.key;
                const isPast = (
                  (st.key === 'scheduled') ||
                  (st.key === 'in_inspection' && selectedWo.status !== 'scheduled') ||
                  (st.key === 'in_repair' && (selectedWo.status === 'in_repair' || selectedWo.status === 'ready_pickup' || selectedWo.status === 'completed')) ||
                  (st.key === 'ready_pickup' && (selectedWo.status === 'ready_pickup' || selectedWo.status === 'completed'))
                );

                return (
                  <div key={st.key} className="space-y-1.5">
                    <div className={`h-2 rounded-full transition-all ${
                      isPast ? 'bg-indigo-500' : 'bg-slate-950 border border-slate-800'
                    }`} />
                    <span className={`text-[11px] block font-medium ${
                      isCurrent ? 'text-white font-bold' : isPast ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vehicle & Service Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Vehicle Info</span>
              <div className="font-extrabold text-white text-sm">
                {selectedWo.vehicle.year} {selectedWo.vehicle.make} {selectedWo.vehicle.model}
              </div>
              <div className="text-slate-300 font-mono font-bold">Reg: {selectedWo.vehicle.licensePlate}</div>
              <div className="text-slate-400 font-mono text-[11px]">Fuel: {selectedWo.vehicle.fuelType} · Odometer: {selectedWo.vehicle.mileage.toLocaleString()} {selectedWo.vehicle.mileageUnit}</div>
              <div className="text-slate-500 font-mono text-[10px]">VIN: {selectedWo.vehicle.vin}</div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Garage Bay & Facility</span>
              <div className="font-bold text-slate-200">{currentLocation.name}</div>
              <div className="text-slate-400">{currentLocation.address}, {currentLocation.city}</div>
              {currentLocation.gstin && (
                <div className="text-slate-400 font-mono text-[11px]">GSTIN: {currentLocation.gstin}</div>
              )}
              <div className="text-emerald-400 font-mono pt-1">Est. Completion: {selectedWo.estimatedCompletion.replace('T', ' ')}</div>
            </div>
          </div>

          {/* High-Res Inspection Photo Gallery */}
          {selectedWo.inspectionPhotos.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-400" />
                Service Bay Digital Inspection Photos ({selectedWo.inspectionPhotos.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedWo.inspectionPhotos.map((img, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-800 group">
                    <img 
                      src={img} 
                      alt="Digital inspection photograph"
                      className="w-full h-44 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent p-3 flex items-end">
                      <span className="text-[11px] font-mono text-white font-semibold">
                        Inspection Evidence Photo #{idx + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Digital Estimate Authorization */}
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Itemized Repair Estimate & GST Bill</h4>
                <p className="text-xs text-slate-400">Review required spare parts, labor hours, and tax breakdown</p>
              </div>

              {selectedWo.estimateApprovedByCustomer ? (
                <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Digitally Authorized</span>
                </span>
              ) : (
                <button
                  onClick={handleApproveEstimate}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  Authorize Job ({currentLocation.currency} {selectedWo.totalAmount.toFixed(2)})
                </button>
              )}
            </div>

            {/* Line Items */}
            <div className="space-y-2 text-xs">
              {selectedWo.partsUsed.map((pt, i) => (
                <div key={i} className="flex justify-between p-2 rounded bg-slate-900 text-slate-300">
                  <span>{pt.partName} (Qty: {pt.quantity}) {pt.hsnCode && `· HSN: ${pt.hsnCode}`}</span>
                  <span className="font-mono font-bold">{currentLocation.currency} {(pt.unitPrice * pt.quantity).toFixed(2)}</span>
                </div>
              ))}
              {selectedWo.laborItems.map((lb, i) => (
                <div key={i} className="flex justify-between p-2 rounded bg-slate-900 text-slate-300">
                  <span>{lb.description} ({lb.hours} hrs) {lb.sacCode && `· SAC: ${lb.sacCode}`}</span>
                  <span className="font-mono font-bold">{currentLocation.currency} {(lb.hours * lb.hourlyRate).toFixed(2)}</span>
                </div>
              ))}

              <div className="pt-2 border-t border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-400 font-mono">
                  <span>Tax Amount ({currentLocation.taxJurisdiction.replace('_', ' ')}):</span>
                  <span>{currentLocation.currency} {selectedWo.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-white pt-1 border-t border-slate-900 font-mono">
                  <span>Total Payable:</span>
                  <span className="text-emerald-400">{currentLocation.currency} {selectedWo.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Instant Payment Section */}
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-slate-400 block">Payment Status:</span>
              <div className="text-sm font-bold text-white capitalize font-mono">
                {selectedWo.paymentStatus === 'paid' ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Paid in Full {selectedWo.upiReference && `(${selectedWo.upiReference})`}
                  </span>
                ) : (
                  <span className="text-amber-400 font-mono font-bold">Pending Settlement ({currentLocation.currency} {selectedWo.totalAmount.toFixed(2)})</span>
                )}
              </div>
            </div>

            {selectedWo.paymentStatus !== 'paid' && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-colors whitespace-nowrap"
              >
                <QrCode className="w-4 h-4" />
                <span>Pay via UPI / Card ({currentLocation.currency} {selectedWo.totalAmount.toFixed(2)})</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Payment Gateway Modal with UPI and Card options */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-400" />
                Instant Checkout & Settlement
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Payment Mode Selector */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setPaymentMethodTab('upi')}
                className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  paymentMethodTab === 'upi' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Instant UPI / QR</span>
              </button>
              <button
                onClick={() => setPaymentMethodTab('card')}
                className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  paymentMethodTab === 'card' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Credit / Debit Card</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-slate-300 flex justify-between">
                <span>Total Amount Due:</span>
                <span className="text-emerald-400 font-bold">{currentLocation.currency} {selectedWo.totalAmount.toFixed(2)}</span>
              </div>

              {paymentMethodTab === 'upi' ? (
                <div className="space-y-3 text-center">
                  <div className="p-4 bg-white rounded-xl mx-auto w-44 h-44 flex flex-col items-center justify-center space-y-2 border border-slate-700 shadow-inner">
                    <QrCode className="w-28 h-28 text-slate-900" />
                    <span className="text-[10px] text-slate-600 font-mono font-bold">Scan with GPay / PhonePe / Paytm</span>
                  </div>

                  <div className="text-left space-y-1">
                    <label className="text-slate-400 font-mono">Or Enter Virtual Payment Address (UPI ID)</label>
                    <input
                      type="text"
                      value={upiIdInput}
                      onChange={(e) => setUpiIdInput(e.target.value)}
                      placeholder="e.g. mobile@upi"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono">Cardholder Name</label>
                    <input
                      type="text"
                      defaultValue={selectedWo.customerName}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono">Card Number</label>
                    <input
                      type="text"
                      defaultValue="4532 •••• •••• 8812"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-mono">Expiry</label>
                      <input
                        type="text"
                        defaultValue="08/29"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-mono">CVV</label>
                      <input
                        type="text"
                        defaultValue="342"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handlePayInvoice}
              disabled={isProcessingPay}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              {isProcessingPay ? (
                <span>Processing Secure Gateway...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Pay {currentLocation.currency} {selectedWo.totalAmount.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
