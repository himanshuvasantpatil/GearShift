import { VehicleSpec } from '../types';

export interface RegistrationLookupRecord {
  licensePlate: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  fuelType: VehicleSpec['fuelType'];
  transmission: VehicleSpec['transmission'];
  engineDisplacement: string;
  vin: string;
  engineNumber: string;
  chassisNumber: string;
  color: string;
  insuranceCompany: string;
  insurancePolicyNumber: string;
  insuranceExpiryDate: string;
  pucExpiryDate: string;
  fastagId: string;
  ownerName: string;
  ownerPhone: string;
}

export const MOCK_REGISTRATION_DATABASE: RegistrationLookupRecord[] = [
  {
    licensePlate: 'KA 03 MM 8899',
    make: 'Mahindra',
    model: 'Scorpio-N',
    variant: 'Z8L 4x4 Diesel AT',
    year: 2023,
    fuelType: 'Diesel',
    transmission: 'Automatic (AT/TC)',
    engineDisplacement: '2.2L mHawk (2198 cc)',
    vin: 'MA1TA2SK5N8A99120',
    engineNumber: 'MHWK22D98421',
    chassisNumber: 'MA1TA2SK5N8A99120',
    color: 'Deep Forest Green',
    insuranceCompany: 'ICICI Lombard General Insurance',
    insurancePolicyNumber: '3001/29841029/00/000',
    insuranceExpiryDate: '2027-04-18',
    pucExpiryDate: '2027-05-15',
    fastagId: '607417-001-998811',
    ownerName: 'Vikramaditya Singhania',
    ownerPhone: '+91 98210 55443'
  },
  {
    licensePlate: 'KA 01 EV 1024',
    make: 'Tata Motors',
    model: 'Nexon EV',
    variant: 'Max Empowered+ (45kWh)',
    year: 2024,
    fuelType: 'EV',
    transmission: 'Single-Speed (EV)',
    engineDisplacement: 'Permanent Magnet Synchronous AC Motor',
    vin: 'MAT625445P3K88721',
    engineNumber: 'EVEM45K78129',
    chassisNumber: 'MAT625445P3K88721',
    color: 'Intense Teal',
    insuranceCompany: 'Bajaj Allianz General Insurance',
    insurancePolicyNumber: 'OG-24-1102-1801-0004921',
    insuranceExpiryDate: '2027-09-30',
    pucExpiryDate: 'Exempt (Zero Emission EV)',
    fastagId: '607417-002-441199',
    ownerName: 'QuickLogistics Express India Fleet',
    ownerPhone: '+91 99800 11223'
  },
  {
    licensePlate: 'MH 02 FF 7700',
    make: 'Hyundai',
    model: 'Creta',
    variant: 'SX(O) 1.5 Turbo Petrol 7DCT',
    year: 2023,
    fuelType: 'Petrol',
    transmission: 'Dual Clutch (DCT)',
    engineDisplacement: '1.5L Kappa Turbo GDi (1482 cc)',
    vin: 'MALC151BLN8761234',
    engineNumber: 'G4FVN908123',
    chassisNumber: 'MALC151BLN8761234',
    color: 'Titan Grey',
    insuranceCompany: 'HDFC ERGO General Insurance',
    insurancePolicyNumber: '2311-2009-4912-881',
    insuranceExpiryDate: '2026-12-14',
    pucExpiryDate: '2027-03-22',
    fastagId: '607417-003-770011',
    ownerName: 'Ananya Deshmukh',
    ownerPhone: '+91 98201 77654'
  },
  {
    licensePlate: 'DL 1C AA 2026',
    make: 'Tata Motors',
    model: 'Harrier',
    variant: 'Fearless+ Dark Edition',
    year: 2024,
    fuelType: 'Diesel',
    transmission: 'Automatic (AT/TC)',
    engineDisplacement: '2.0L Kryotec Turbo Diesel (1956 cc)',
    vin: 'MAT682554P4M11290',
    engineNumber: 'KRYO20D84912',
    chassisNumber: 'MAT682554P4M11290',
    color: 'Oberon Black',
    insuranceCompany: 'Tata AIG General Insurance',
    insurancePolicyNumber: '015948392019/00',
    insuranceExpiryDate: '2027-08-11',
    pucExpiryDate: '2027-09-01',
    fastagId: '607417-004-202699',
    ownerName: 'Rohit Khandelwal',
    ownerPhone: '+91 98110 44321'
  },
  {
    licensePlate: 'MH 12 QX 4040',
    make: 'Mahindra',
    model: 'Thar / Thar Roxx',
    variant: 'Roxx AX7L 4x4 Diesel AT',
    year: 2024,
    fuelType: 'Diesel',
    transmission: 'Automatic (AT/TC)',
    engineDisplacement: '2.2L mHawk (2184 cc, 175 PS)',
    vin: 'MA1TH4SK9P8B40400',
    engineNumber: 'THR22M81920',
    chassisNumber: 'MA1TH4SK9P8B40400',
    color: 'Stealth Black',
    insuranceCompany: 'National Insurance Company Ltd',
    insurancePolicyNumber: 'NIC-482019-33-01',
    insuranceExpiryDate: '2027-11-20',
    pucExpiryDate: '2027-11-15',
    fastagId: '607417-005-404088',
    ownerName: 'Sameer Joshi',
    ownerPhone: '+91 98900 12345'
  },
  {
    licensePlate: 'KA 05 NV 5500',
    make: 'Maruti Suzuki',
    model: 'Grand Vitara',
    variant: 'Alpha+ Intelligent Electric Hybrid',
    year: 2023,
    fuelType: 'Hybrid',
    transmission: 'CVT',
    engineDisplacement: '1.5L Strong Hybrid e-CVT (1490 cc)',
    vin: 'MA3ENA15SP7K55001',
    engineNumber: 'M15A992144',
    chassisNumber: 'MA3ENA15SP7K55001',
    color: 'Opulent Red with Midnight Black',
    insuranceCompany: 'Maruti Insurance Broking (SBI General)',
    insurancePolicyNumber: 'SBI-MI-2023-884102',
    insuranceExpiryDate: '2027-02-28',
    pucExpiryDate: '2027-04-10',
    fastagId: '607417-006-550022',
    ownerName: 'Karthik Ramanathan',
    ownerPhone: '+91 99000 67890'
  }
];

export function lookupVehicleByRegistration(inputPlate: string): RegistrationLookupRecord | null {
  const normalized = inputPlate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (!normalized || normalized.length < 4) return null;

  // 1. Direct match in curated high-fidelity database
  const directMatch = MOCK_REGISTRATION_DATABASE.find(r => 
    r.licensePlate.replace(/[^A-Za-z0-9]/g, '').toUpperCase() === normalized
  );
  if (directMatch) return directMatch;

  // 2. Intelligent dynamic synthesis for any arbitrary entered registration plate or VIN
  const stateCode = normalized.slice(0, 2);
  const stateRtoMap: Record<string, string> = {
    KA: 'Karnataka RTO (Bangalore/Hubli)',
    MH: 'Maharashtra RTO (Mumbai/Pune)',
    DL: 'Delhi NCR Transport Authority',
    HR: 'Haryana Transport (Gurugram/Faridabad)',
    TN: 'Tamil Nadu RTO (Chennai/Coimbatore)',
    GJ: 'Gujarat Transport (Ahmedabad)',
    TS: 'Telangana RTO (Hyderabad)',
    UP: 'Uttar Pradesh RTO (Noida/Lucknow)',
    WB: 'West Bengal RTO (Kolkata)'
  };
  const rtoRegion = stateRtoMap[stateCode] || 'Central Motor Vehicles Registry';

  // Deterministic vehicle archetype based on hash of plate
  const sampleModels = [
    { make: 'Tata Motors', model: 'Safari', variant: 'Accomplished+ Dark Edition AT', fuel: 'Diesel', trans: 'Automatic (AT/TC)', cc: '2.0L Kryotec (1956 cc)', vinPre: 'MAT69' },
    { make: 'Mahindra', model: 'XUV700', variant: 'AX7L AWD Diesel AT', fuel: 'Diesel', trans: 'Automatic (AT/TC)', cc: '2.2L mHawk (2198 cc)', vinPre: 'MA1TA' },
    { make: 'Hyundai', model: 'Creta', variant: 'SX(O) 1.5 MPI iMT', fuel: 'Petrol', trans: 'CVT', cc: '1.5L Smartstream (1497 cc)', vinPre: 'MALC1' },
    { make: 'Maruti Suzuki', model: 'Brezza', variant: 'ZXi+ Smart Hybrid AT', fuel: 'Petrol', trans: 'Automatic (AT/TC)', cc: '1.5L K15C DualJet (1462 cc)', vinPre: 'MA3EB' },
    { make: 'Toyota', model: 'Innova Hycross', variant: 'ZX(O) Strong Hybrid e-Drive', fuel: 'Hybrid', trans: 'CVT', cc: '2.0L TNGA Hybrid (1987 cc)', vinPre: 'MBJAA' }
  ];

  const hash = normalized.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const archetype = sampleModels[hash % sampleModels.length];
  const yearCalculated = 2021 + (hash % 4); // 2021-2024

  return {
    licensePlate: inputPlate.toUpperCase().trim(),
    make: archetype.make,
    model: archetype.model,
    variant: archetype.variant,
    year: yearCalculated,
    fuelType: archetype.fuel as VehicleSpec['fuelType'],
    transmission: archetype.trans as VehicleSpec['transmission'],
    engineDisplacement: archetype.cc,
    vin: `${archetype.vinPre}${yearCalculated % 100}X${Math.floor(1000000 + (hash * 9301) % 8999999)}`,
    engineNumber: `ENG${hash % 90000 + 10000}X`,
    chassisNumber: `${archetype.vinPre}${yearCalculated % 100}X${Math.floor(1000000 + (hash * 9301) % 8999999)}`,
    color: ['Pearl Arctic White', 'Napoli Black', 'Daytona Grey', 'Atlas Silver', 'Deep Forest'][hash % 5],
    insuranceCompany: ['Tata AIG General Insurance', 'ICICI Lombard', 'HDFC ERGO', 'Bajaj Allianz', 'New India Assurance'][hash % 5],
    insurancePolicyNumber: `POL-${normalized.slice(0, 4)}-${hash * 37}-2026`,
    insuranceExpiryDate: '2027-06-30',
    pucExpiryDate: '2027-05-15',
    fastagId: `607417-${normalized.slice(-4)}-99`,
    ownerName: `Registered Fleet / Owner (${rtoRegion})`,
    ownerPhone: `+91 98${Math.floor(10000000 + (hash * 12345) % 89999999)}`
  };
}
