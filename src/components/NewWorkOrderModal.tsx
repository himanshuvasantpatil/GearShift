import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wrench, 
  Plus, 
  Car, 
  User, 
  Sparkles, 
  Building2,
  HelpCircle,
  Fuel,
  Gauge,
  ShieldCheck,
  AlertCircle,
  Check,
  Search,
  CheckCircle2,
  Zap,
  RotateCcw,
  QrCode
} from 'lucide-react';
import { WorkOrder, Location, Technician, VehicleSpec } from '../types';
import { POPULAR_VEHICLE_CATALOG } from '../data/vehicleCatalog';
import { lookupVehicleByRegistration, MOCK_REGISTRATION_DATABASE } from '../data/registrationLookup';

interface NewWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: Location;
  technicians: Technician[];
  onCreateWorkOrder: (newWo: WorkOrder) => void;
  onOpenQrScanner?: () => void;
  initialVehicle?: VehicleSpec | null;
}

export const NewWorkOrderModal: React.FC<NewWorkOrderModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  technicians,
  onCreateWorkOrder,
  onOpenQrScanner,
  initialVehicle
}) => {
  // Smart Lookup Input State
  const [lookupQuery, setLookupQuery] = useState('KA 03 MM 8899');
  const [lookupFeedback, setLookupFeedback] = useState<string | null>(null);
  const [isLookupSuccess, setIsLookupSuccess] = useState<boolean>(false);

  // Vehicle Specifications
  const [selectedMake, setSelectedMake] = useState('Mahindra');
  const [selectedModel, setSelectedModel] = useState('Scorpio-N');
  const [selectedVariant, setSelectedVariant] = useState('Z8L 4x4 Diesel AT');
  const [year, setYear] = useState(2023);
  const [fuelType, setFuelType] = useState<VehicleSpec['fuelType']>('Diesel');
  const [transmission, setTransmission] = useState<VehicleSpec['transmission']>('Automatic (AT/TC)');
  const [engineDisplacement, setEngineDisplacement] = useState('2.2L mHawk (2198 cc)');
  const [licensePlate, setLicensePlate] = useState('KA 03 MM 8899');
  const [vin, setVin] = useState('MA1TA2SK5N8A99120');
  const [engineNumber, setEngineNumber] = useState('MHWK22D98421');
  const [mileage, setMileage] = useState(38450);
  const [color, setColor] = useState('Deep Forest Green');
  const [fuelLevel, setFuelLevel] = useState(70);
  const [insuranceCompany, setInsuranceCompany] = useState('ICICI Lombard General Insurance');
  const [insurancePolicy, setInsurancePolicy] = useState('3001/29841029/00/000');
  const [fastagId, setFastagId] = useState('607417-001-998811');
  
  // Customer details
  const [customerName, setCustomerName] = useState('Vikramaditya Singhania');
  const [customerPhone, setCustomerPhone] = useState('+91 98210 55443');
  const [customerEmail, setCustomerEmail] = useState('vikram.singhania@corpindia.com');
  const [customerGstin, setCustomerGstin] = useState('');
  const [reportedIssue, setReportedIssue] = useState('Periodic 40,000 km general service, synthetic oil replacement & brake pad inspection');
  const [assignedTechId, setAssignedTechId] = useState(technicians[0]?.id || 'tech-in-1');

  // Active make catalog entry
  const activeMakeData = POPULAR_VEHICLE_CATALOG.find(m => m.make === selectedMake) || POPULAR_VEHICLE_CATALOG[0];
  const activeModelData = activeMakeData.models.find(m => m.name === selectedModel) || activeMakeData.models[0];

  useEffect(() => {
    if (initialVehicle) {
      setSelectedMake(initialVehicle.make);
      setSelectedModel(initialVehicle.model);
      setSelectedVariant(initialVehicle.variant || '');
      setYear(initialVehicle.year);
      setFuelType(initialVehicle.fuelType);
      setTransmission(initialVehicle.transmission);
      setEngineDisplacement(initialVehicle.engineDisplacement || '');
      setLicensePlate(initialVehicle.licensePlate);
      setVin(initialVehicle.vin);
      if (initialVehicle.engineNumber) setEngineNumber(initialVehicle.engineNumber);
      if (initialVehicle.color) setColor(initialVehicle.color);
      if (initialVehicle.insuranceCompany) setInsuranceCompany(initialVehicle.insuranceCompany);
      if (initialVehicle.insurancePolicyNumber) setInsurancePolicy(initialVehicle.insurancePolicyNumber);
      if (initialVehicle.fastagId) setFastagId(initialVehicle.fastagId);
      setLookupQuery(initialVehicle.licensePlate);
      setIsLookupSuccess(true);
      setLookupFeedback(`✓ Pre-filled from QR Label: ${initialVehicle.year} ${initialVehicle.make} ${initialVehicle.model} (${initialVehicle.licensePlate})`);
    }
  }, [initialVehicle]);

  const handleSmartRegistrationLookup = (queryOverride?: string) => {
    const q = queryOverride || lookupQuery;
    const match = lookupVehicleByRegistration(q);

    if (match) {
      setSelectedMake(match.make);
      setSelectedModel(match.model);
      setSelectedVariant(match.variant);
      setYear(match.year);
      setFuelType(match.fuelType);
      setTransmission(match.transmission);
      setEngineDisplacement(match.engineDisplacement);
      setLicensePlate(match.licensePlate);
      setVin(match.vin);
      setEngineNumber(match.engineNumber);
      setColor(match.color);
      setInsuranceCompany(match.insuranceCompany);
      setInsurancePolicy(match.insurancePolicyNumber);
      setFastagId(match.fastagId);
      setCustomerName(match.ownerName);
      setCustomerPhone(match.ownerPhone);
      setIsLookupSuccess(true);
      setLookupFeedback(`✓ Match verified in VAHAN & OEM database: ${match.year} ${match.make} ${match.model} (${match.variant})`);
    } else {
      setIsLookupSuccess(false);
      setLookupFeedback(`No direct registry match found for "${q}". You can enter custom details below.`);
    }
  };

  const handleMakeChange = (makeName: string) => {
    setSelectedMake(makeName);
    const mData = POPULAR_VEHICLE_CATALOG.find(m => m.make === makeName) || POPULAR_VEHICLE_CATALOG[0];
    const mod = mData.models[0];
    setSelectedModel(mod.name);
    setSelectedVariant(mod.variants[0]);
    setFuelType(mod.fuelTypes[0]);
    setTransmission(mod.transmissions[0]);
    setEngineDisplacement(mod.typicalEngineCC);
    setVin(`${mod.vinPrefix}SK${Math.floor(100000 + Math.random() * 900000)}`);
    setEngineNumber(`${mod.engineNumberPrefix}${Math.floor(10000 + Math.random() * 90000)}`);
  };

  const handleModelChange = (modelName: string) => {
    setSelectedModel(modelName);
    const mod = activeMakeData.models.find(m => m.name === modelName) || activeMakeData.models[0];
    setSelectedVariant(mod.variants[0]);
    setFuelType(mod.fuelTypes[0]);
    setTransmission(mod.transmissions[0]);
    setEngineDisplacement(mod.typicalEngineCC);
    setVin(`${mod.vinPrefix}SK${Math.floor(100000 + Math.random() * 900000)}`);
    setEngineNumber(`${mod.engineNumberPrefix}${Math.floor(10000 + Math.random() * 90000)}`);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !selectedMake || !selectedModel) {
      alert('Please fill customer name and vehicle make/model');
      return;
    }

    const baseLabor = currentLocation.region === 'INDIA' ? 2200 : 180;
    const taxRate = currentLocation.defaultTaxRate;
    const taxAmt = Number((baseLabor * (taxRate / 100)).toFixed(2));
    const totalAmt = Number((baseLabor + taxAmt).toFixed(2));

    const newWo: WorkOrder = {
      id: `wo-${Date.now()}`,
      orderNumber: `${currentLocation.region === 'INDIA' ? 'WO-IN' : 'WO-GL'}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      locationId: currentLocation.id,
      customerName,
      customerPhone: customerPhone || '+91 98450 00000',
      customerEmail: customerEmail || 'customer@gearshift.internal',
      customerGstin: customerGstin || undefined,
      isFleetCustomer: Boolean(customerGstin),
      vehicle: {
        vin: vin || 'MAT12345678901234',
        engineNumber,
        make: selectedMake,
        model: selectedModel,
        variant: selectedVariant,
        year: Number(year),
        licensePlate: licensePlate || 'MH 01 AB 1234',
        mileage: Number(mileage),
        mileageUnit: currentLocation.region === 'INDIA' ? 'km' : 'mi',
        fuelType,
        transmission,
        engineDisplacement,
        color: color || 'Carbon Metallic',
        insuranceCompany,
        insurancePolicyNumber: insurancePolicy,
        pucExpiryDate: '2027-05-15',
        fastagId
      },
      bayId: 'Bay 01 (Heavy Hydraulic Lift)',
      assignedTechIds: [assignedTechId],
      status: 'scheduled',
      priority: 'high',
      scheduledTime: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 86400000).toISOString(),
      reportedIssues: [reportedIssue],
      dtcCodes: [],
      fuelLevelPercentage: Number(fuelLevel),
      inspectionChecklist: [
        { item: 'Engine Oil & Filter Condition', status: 'attention' },
        { item: 'Front Disc & Pad Wear Scan', status: 'pass' },
        { item: 'Underbody & Exhaust Mounting', status: 'pass' },
        { item: 'Battery Voltage & Cranking Amps', status: 'pass' }
      ],
      inspectionPhotos: [],
      partsUsed: [],
      laborItems: [
        { description: 'Comprehensive Periodic Inspection & General Service Package', hours: 2.0, hourlyRate: baseLabor / 2, sacCode: '998714' }
      ],
      subtotal: baseLabor,
      taxBreakdown: {
        cgst: currentLocation.region === 'INDIA' ? taxAmt / 2 : undefined,
        sgst: currentLocation.region === 'INDIA' ? taxAmt / 2 : undefined,
        totalTax: taxAmt
      },
      taxAmount: taxAmt,
      totalAmount: totalAmt,
      estimateApprovedByCustomer: false,
      paymentStatus: 'unpaid'
    };

    onCreateWorkOrder(newWo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-4 my-8">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-orange-400" />
              Open New Job Card & Vehicle Check-In ({currentLocation.code})
            </h3>
            <p className="text-[11px] text-slate-400">
              Smart registration lookup with automated VIN, make, model, year, and insurance auto-fill
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
          {/* Smart Vehicle Lookup Feature Callout */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-950/50 to-slate-950 border border-orange-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-300 font-mono uppercase flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-orange-400" />
                Smart Vehicle Lookup by Registration Number (Instant Auto-Fill)
              </span>
              <span className="text-[10px] text-orange-400 font-mono">VAHAN / VIN Engine</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Registration Number (e.g. KA 03 MM 8899, MH 02 FF 7700)"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono font-bold text-xs uppercase focus:outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={() => handleSmartRegistrationLookup()}
                className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md transition-colors whitespace-nowrap cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Fetch Details</span>
              </button>
              {onOpenQrScanner && (
                <button
                  type="button"
                  onClick={onOpenQrScanner}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-orange-400 font-bold text-xs rounded-lg flex items-center gap-1.5 border border-slate-700 shadow-sm transition-colors whitespace-nowrap cursor-pointer"
                  title="Scan Vehicle Windshield QR or FASTag"
                >
                  <QrCode className="w-4 h-4" />
                  <span className="hidden sm:inline">Scan Tag</span>
                </button>
              )}
            </div>

            {/* Quick Demo Pre-fills */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <span className="font-semibold text-slate-300">Instant Sample Plates:</span>
              {[
                { plate: 'KA 03 MM 8899', desc: 'Mahindra Scorpio-N' },
                { plate: 'MH 02 FF 7700', desc: 'Hyundai Creta' },
                { plate: 'KA 01 EV 1024', desc: 'Tata Nexon EV' },
                { plate: 'DL 1C AA 2026', desc: 'Tata Harrier' },
                { plate: 'MH 12 QX 4040', desc: 'Mahindra Thar Roxx' },
                { plate: 'KA 05 NV 5500', desc: 'Maruti Grand Vitara' }
              ].map(({ plate, desc }) => (
                <button
                  key={plate}
                  type="button"
                  title={`Auto-fill ${desc}`}
                  onClick={() => {
                    setLookupQuery(plate);
                    handleSmartRegistrationLookup(plate);
                  }}
                  className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-orange-300 font-mono text-[11px] border border-slate-700/80 hover:border-orange-500/80 transition-colors flex items-center gap-1 shadow-sm"
                >
                  <span className="font-bold">{plate}</span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">({desc.split(' ')[0]})</span>
                </button>
              ))}
            </div>

            {lookupFeedback && (
              <div className={`p-2.5 rounded-lg text-xs font-mono flex items-center gap-2 ${
                isLookupSuccess
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                  : 'bg-slate-900 text-slate-300 border border-slate-800'
              }`}>
                {isLookupSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
                <span>{lookupFeedback}</span>
              </div>
            )}

            {/* Visual Specs Badge Grid on Success */}
            {isLookupSuccess && (
              <div className="p-3 rounded-lg bg-slate-900 border border-emerald-800/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Vehicle Identity</span>
                  <span className="text-white font-bold">{year} {selectedMake} {selectedModel}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Variant & Gearbox</span>
                  <span className="text-emerald-300 font-bold truncate block">{selectedVariant}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Engine CC & Fuel</span>
                  <span className="text-orange-300 font-bold">{fuelType} · {engineDisplacement}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Chassis / VIN</span>
                  <span className="text-slate-300 font-bold truncate block">{vin}</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 1: Customer & Communication */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <span className="font-bold text-orange-400 font-mono uppercase text-[10px] block">
              1. Customer Identity & WhatsApp Contact
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vikramaditya Singhania"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  WhatsApp Mobile (+91...) *
                </label>
                <input
                  type="text"
                  placeholder="+91 98450 12345"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-orange-500"
                />
                <span className="text-[10px] text-slate-500 block mt-0.5">Automated job card updates will be sent here</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Customer Email (Optional)</label>
                <input
                  type="email"
                  placeholder="customer@domain.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Customer GSTIN (For B2B Tax Credit)</label>
                <input
                  type="text"
                  placeholder="e.g. 29AAACQ4567M1ZV"
                  value={customerGstin}
                  onChange={(e) => setCustomerGstin(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Guided Vehicle Specification */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-orange-400 font-mono uppercase text-[10px] block">
                2. Auto-Filled Vehicle Specification
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                ✓ Auto-Filled from Registry
              </span>
            </div>

            {/* Make / Model / Variant Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Manufacturer (Make)</label>
                <select
                  value={selectedMake}
                  onChange={(e) => handleMakeChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-semibold focus:outline-none focus:border-orange-500"
                >
                  {POPULAR_VEHICLE_CATALOG.map((m) => (
                    <option key={m.make} value={m.make}>{m.make}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Model Name</label>
                <select
                  value={selectedModel}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-semibold focus:outline-none focus:border-orange-500"
                >
                  {activeMakeData.models.map((mod) => (
                    <option key={mod.name} value={mod.name}>{mod.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Trim / Variant</label>
                <input
                  type="text"
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Fuel / Transmission / Displacement */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Fuel & Powertrain</label>
                <select
                  value={fuelType}
                  onChange={(e: any) => setFuelType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
                >
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="EV">EV (Electric)</option>
                  <option value="CNG">CNG</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Transmission (Gearbox)</label>
                <select
                  value={transmission}
                  onChange={(e: any) => setTransmission(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
                >
                  <option value="Automatic (AT/TC)">Automatic (AT/TC)</option>
                  <option value="Manual 6-Speed">Manual 6-Speed</option>
                  <option value="Dual Clutch (DCT)">Dual Clutch (DCT)</option>
                  <option value="CVT">CVT</option>
                  <option value="Single-Speed (EV)">Single-Speed (EV)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Engine CC / Spec</label>
                <input
                  type="text"
                  value={engineDisplacement}
                  onChange={(e) => setEngineDisplacement(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Registration, VIN & Engine Number */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-300 font-semibold mb-1 flex items-center justify-between">
                  <span>Registration Plate *</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLookupQuery(licensePlate);
                      handleSmartRegistrationLookup(licensePlate);
                    }}
                    className="text-[10px] text-orange-400 hover:text-orange-300 font-mono underline cursor-pointer"
                  >
                    Auto-Fill from Registry
                  </button>
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono font-bold focus:border-orange-500 focus:outline-none uppercase"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLookupQuery(licensePlate);
                      handleSmartRegistrationLookup(licensePlate);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-orange-400 font-mono text-[11px] rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
                    title="Lookup this plate"
                  >
                    <Search className="w-3 h-3" />
                    <span className="hidden sm:inline">Fetch</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">17-Digit VIN Number</label>
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Engine Number</label>
                <input
                  type="text"
                  value={engineNumber}
                  onChange={(e) => setEngineNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Odometer, Color & Fuel Gauge */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Odometer Reading (km) *</label>
                <input
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Paint Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Fuel Tank Level: {fuelLevel}%</label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={fuelLevel}
                  onChange={(e) => setFuelLevel(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Issues Reported & Bay Allocation */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <span className="font-bold text-orange-400 font-mono uppercase text-[10px] block">
              3. Service Requirements & Technician Allocation
            </span>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Customer Reported Complaints / Service Request *</label>
              <textarea
                rows={2}
                value={reportedIssue}
                onChange={(e) => setReportedIssue(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Assign Service Bay Technician</label>
                <select
                  value={assignedTechId}
                  onChange={(e) => setAssignedTechId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-medium focus:outline-none"
                >
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.skillTier})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Insurance Company (If Accidental / Cashless)</label>
                <input
                  type="text"
                  value={insuranceCompany}
                  onChange={(e) => setInsuranceCompany(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Generate Job Card & Send WhatsApp Check-In</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
