import React, { useState } from 'react';
import { 
  Building2, 
  Wrench, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  CreditCard, 
  Sparkles, 
  Plus, 
  Trash2,
  AlertCircle,
  HelpCircle,
  Smartphone,
  QrCode
} from 'lucide-react';
import { GarageSetupConfig, Location } from '../types';

interface GarageSetupViewProps {
  currentLocation: Location;
  onSaveSetup: (updatedConfig: GarageSetupConfig) => void;
}

export const GarageSetupView: React.FC<GarageSetupViewProps> = ({
  currentLocation,
  onSaveSetup
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [garageName, setGarageName] = useState('Apex Auto Dynamics & Bosch Certified Center');
  const [brandTagline, setBrandTagline] = useState('Precision European & Indian Performance Workshop');
  const [ownerName, setOwnerName] = useState('Himanshu Patil');
  const [phone, setPhone] = useState('+91 98450 88200');
  const [email, setEmail] = useState('contact@apexautodynamics.in');
  const [city, setCity] = useState(currentLocation.city);
  const [state, setState] = useState(currentLocation.state || 'Karnataka');
  const [address, setAddress] = useState('Plot 88, Outer Ring Road, Mahadevapura');
  const [gstin, setGstin] = useState(currentLocation.gstin || '29AABCP9988K1Z4');
  const [panNumber, setPanNumber] = useState('AABCP9988K');
  const [bankName, setBankName] = useState('HDFC Bank Ltd');
  const [accountNumber, setAccountNumber] = useState('50200088992211');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [upiVpa, setUpiVpa] = useState('apexauto@hdfcbank');
  const [laborRate, setLaborRate] = useState(850);
  const [sacCode, setSacCode] = useState('998714');
  const [whatsappNumber, setWhatsappNumber] = useState('+91 98450 88200');

  const [bays, setBays] = useState<GarageSetupConfig['bays']>([
    { bayId: 'BAY-01', name: 'Bay 01 - 2-Post Hydraulic Lift (4 Ton)', bayType: '2-Post Hydraulic Lift', status: 'operational' },
    { bayId: 'BAY-02', name: 'Bay 02 - Hunter 3D 4-Post Alignment Rack', bayType: '4-Post Alignment Rack', status: 'operational' },
    { bayId: 'BAY-03', name: 'Bay 03 - Low-Profile Scissor Lift', bayType: 'Scissor Lift', status: 'operational' },
    { bayId: 'BAY-04', name: 'Bay 04 - High-Voltage EV & Bosch CAN Diagnostic Bay', bayType: 'Diagnostic & EV Bay', status: 'operational' },
    { bayId: 'BAY-05', name: 'Bay 05 - Automated Water Recycling Wash & Foam Detailing', bayType: 'Washing & Detailing', status: 'operational' }
  ]);

  const handleAddBay = () => {
    const nextNum = bays.length + 1;
    setBays([
      ...bays,
      {
        bayId: `BAY-${String(nextNum).padStart(2, '0')}`,
        name: `Bay ${String(nextNum).padStart(2, '0')} - Standard Service Bay`,
        bayType: '2-Post Hydraulic Lift',
        status: 'operational'
      }
    ]);
  };

  const handleRemoveBay = (bayId: string) => {
    if (bays.length <= 1) return;
    setBays(bays.filter(b => b.bayId !== bayId));
  };

  const handleCompleteSetup = () => {
    const config: GarageSetupConfig = {
      garageName,
      brandTagline,
      ownerName,
      phone,
      email,
      state,
      city,
      address,
      gstin,
      panNumber,
      bankAccountDetails: {
        bankName,
        accountNumber,
        ifscCode,
        upiVpa
      },
      bays,
      laborRatePerHour: Number(laborRate),
      sacCode,
      whatsappBusinessNumber: whatsappNumber,
      isSetupComplete: true
    };
    onSaveSetup(config);
    alert('Congratulations! Your garage workshop and spare parts depot are fully configured and ready for live operation.');
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-orange-400 uppercase">First-Time Garage Onboarding</div>
              <h2 className="text-xl font-extrabold text-white">
                Workshop & Multi-Depot Setup Wizard
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-slate-300">GSTIN & Banking Configured</span>
          </div>
        </div>

        {/* Setup Progress Steps */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { step: 1, title: '1. Garage Profile' },
            { step: 2, title: '2. GST & Tax Setup' },
            { step: 3, title: '3. Bays & Lifts' },
            { step: 4, title: '4. WhatsApp & UPI' }
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`p-2.5 rounded-xl border transition-all ${
                currentStep === s.step
                  ? 'bg-orange-600 text-white font-bold border-orange-500 shadow-md'
                  : currentStep > s.step
                  ? 'bg-slate-950 text-emerald-400 border-emerald-800'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Garage Basic Profile */}
      {currentStep === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-orange-400" />
              Workshop Business Profile & Branding
            </h3>
            <span className="text-xs text-slate-400">Step 1 of 4</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Garage / Workshop Legal Name *</label>
                <input
                  type="text"
                  value={garageName}
                  onChange={(e) => setGarageName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:border-orange-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 block">This appears on invoice headers and job card prints</span>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Brand Tagline / Specialty</label>
                <input
                  type="text"
                  value={brandTagline}
                  onChange={(e) => setBrandTagline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-orange-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 block">e.g. Multi-Brand Specialist / High-Voltage EV Diagnostic Center</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Owner / Lead Partner *</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Primary Workshop Phone *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Billing Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Complete Physical Street Address</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md"
            >
              <span>Next: GST & Taxation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: GST & Taxation */}
      {currentStep === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-400" />
              Tax Compliance & GST Registration
            </h3>
            <span className="text-xs text-slate-400">Step 2 of 4</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-800/60 text-slate-300 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <p>
                Under Indian GST, automobile repair and maintenance falls under <strong>SAC Code 998714</strong> with an 18% tax rate (CGST 9% + SGST 9%). Spare parts carry HSN codes taxed at 18% or 28%.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">GSTIN (15-Digit GST Number) *</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono font-bold focus:border-orange-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 block">e.g. 29AABCP9988K1Z4 (Karnataka)</span>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Business PAN Number *</label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono font-bold focus:border-orange-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 block">10-Digit Income Tax PAN</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Standard Labor Hourly Rate (₹ / hr)</label>
                <input
                  type="number"
                  value={laborRate}
                  onChange={(e) => setLaborRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:border-orange-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 block">Default billing rate for mechanical labor</span>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Automobile Repair SAC Code</label>
                <input
                  type="text"
                  value={sacCode}
                  onChange={(e) => setSacCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:border-orange-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 block">Standard: 998714</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-3">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md"
            >
              <span>Next: Service Bays Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Service Bays & Lifts */}
      {currentStep === 3 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-orange-400" />
              Service Bay Allocation & Equipment Capacity
            </h3>
            <button
              onClick={handleAddBay}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-semibold rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Service Bay</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {bays.map((bay, idx) => (
              <div key={bay.bayId} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-orange-400 text-sm">{bay.bayId}</span>
                  <div>
                    <input
                      type="text"
                      value={bay.name}
                      onChange={(e) => {
                        const updated = [...bays];
                        updated[idx].name = e.target.value;
                        setBays(updated);
                      }}
                      className="bg-transparent font-bold text-white text-xs focus:outline-none border-b border-slate-800 focus:border-orange-500"
                    />
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{bay.bayType}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={bay.bayType}
                    onChange={(e: any) => {
                      const updated = [...bays];
                      updated[idx].bayType = e.target.value;
                      setBays(updated);
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-slate-300 text-xs focus:outline-none"
                  >
                    <option value="2-Post Hydraulic Lift">2-Post Hydraulic Lift</option>
                    <option value="4-Post Alignment Rack">4-Post Alignment Rack</option>
                    <option value="Scissor Lift">Scissor Lift</option>
                    <option value="Diagnostic & EV Bay">Diagnostic & EV Bay</option>
                    <option value="Washing & Detailing">Washing & Detailing</option>
                  </select>

                  <button
                    onClick={() => handleRemoveBay(bay.bayId)}
                    className="p-1.5 text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-3">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md"
            >
              <span>Next: WhatsApp & UPI Bank</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: WhatsApp Business & Bank UPI Gateway */}
      {currentStep === 4 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-400" />
              WhatsApp Business & Instant UPI Settlement
            </h3>
            <span className="text-xs text-slate-400">Step 4 of 4</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">WhatsApp Business API Phone Number *</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:border-orange-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 block">Sends automated check-in alerts, digital estimates, and repair photos to customers</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Current Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Current Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Bank IFSC Code</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono uppercase focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Merchant UPI VPA ID (For Instant QR Code) *</label>
                <input
                  type="text"
                  value={upiVpa}
                  onChange={(e) => setUpiVpa(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:border-orange-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 block">Used to dynamically generate GPay/PhonePe QR on invoices</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-3">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
            >
              Back
            </button>
            <button
              onClick={handleCompleteSetup}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Garage Setup & Launch</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
