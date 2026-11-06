import {
  Location,
  InventoryItem,
  Technician,
  WorkOrder,
  NotificationTemplate,
  NotificationLog,
  Invoice,
  OfflineSyncItem,
  ComplianceConsentRecord,
  ComplianceAuditLog
} from '../types';

export const HERO_IMAGES = {
  workshop: '/src/assets/images/garage_workshop_hero_1793951521529.jpg',
  warehouse: '/src/assets/images/spare_parts_warehouse_1793951523015.jpg',
  tablet: '/src/assets/images/technician_inspection_tablet_1793951523135.jpg',
  inspection: '/src/assets/images/client_vehicle_inspection_1793951523547.jpg'
};

export const MOCK_LOCATIONS: Location[] = [
  {
    id: 'loc-in-1',
    name: 'Bengaluru Tech Corridor Mega-Hub & Parts Depot',
    code: 'BLR-HUB-01',
    region: 'INDIA',
    type: 'hub_garage',
    address: 'Plot 42, Electronic City Phase 1, Hosur Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    currency: '₹',
    currencyCode: 'INR',
    taxJurisdiction: 'INDIA_GST',
    gstin: '29AABCG1234F1Z5',
    hsnCodeScope: 'Auto Spare Parts (8708) & Garage Services (998714)',
    defaultTaxRate: 18.0,
    cgstRate: 9.0,
    sgstRate: 9.0,
    igstRate: 18.0,
    baysCount: 12,
    phone: '+91 80 4912 8800',
    email: 'blr-hub@gearshifterp.in'
  },
  {
    id: 'loc-in-2',
    name: 'Mumbai Andheri West Express Bay & Spares',
    code: 'BOM-EXP-02',
    region: 'INDIA',
    type: 'express_bay',
    address: 'Link Road, Industrial Area, Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    currency: '₹',
    currencyCode: 'INR',
    taxJurisdiction: 'INDIA_GST',
    gstin: '27AABCG1234F1Z3',
    hsnCodeScope: 'Auto Spare Parts (8708) & Quick Bay (998714)',
    defaultTaxRate: 18.0,
    cgstRate: 9.0,
    sgstRate: 9.0,
    igstRate: 18.0,
    baysCount: 8,
    phone: '+91 22 2673 4400',
    email: 'mumbai-bay@gearshifterp.in'
  },
  {
    id: 'loc-in-3',
    name: 'Delhi NCR Central Depot & Logistics Warehouse',
    code: 'DEL-DEP-03',
    region: 'INDIA',
    type: 'spare_depot',
    address: 'Sector 18, Udyog Vihar Phase 4',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    currency: '₹',
    currencyCode: 'INR',
    taxJurisdiction: 'INDIA_GST',
    gstin: '06AABCG1234F1Z9',
    hsnCodeScope: 'OEM Spare Parts Central Warehouse',
    defaultTaxRate: 18.0,
    cgstRate: 9.0,
    sgstRate: 9.0,
    igstRate: 18.0,
    baysCount: 6,
    phone: '+91 124 489 1100',
    email: 'ncr-depot@gearshifterp.in'
  },
  {
    id: 'loc-gl-1',
    name: 'London Central Flagship Facility',
    code: 'LDN-GAR-04',
    region: 'GLOBAL',
    type: 'hub_garage',
    address: '88 Thames Industrial Estate',
    city: 'London',
    country: 'United Kingdom',
    currency: '£',
    currencyCode: 'GBP',
    taxJurisdiction: 'UK_VAT',
    defaultTaxRate: 20.0,
    baysCount: 6,
    phone: '+44 20 7946 0912',
    email: 'london-service@gearshifterp.com'
  },
  {
    id: 'loc-gl-2',
    name: 'Dubai Al Quoz Performance Hub',
    code: 'DXB-HUB-05',
    region: 'GLOBAL',
    type: 'hub_garage',
    address: 'Warehouse 14, 4th Street, Al Quoz 3',
    city: 'Dubai',
    country: 'United Arab Emirates',
    currency: 'AED',
    currencyCode: 'AED',
    taxJurisdiction: 'UAE_VAT',
    defaultTaxRate: 5.0,
    baysCount: 8,
    phone: '+971 4 338 9011',
    email: 'dubai-hub@gearshifterp.com'
  },
  {
    id: 'loc-gl-3',
    name: 'New York Metro Service & Parts Terminal',
    code: 'NY-HUB-06',
    region: 'GLOBAL',
    type: 'hub_garage',
    address: '450 Industrial Parkway',
    city: 'New York, NY',
    country: 'United States',
    currency: '$',
    currencyCode: 'USD',
    taxJurisdiction: 'US_SALES_TAX',
    defaultTaxRate: 8.875,
    baysCount: 8,
    phone: '+1 (212) 555-0199',
    email: 'hub-ny@gearshifterp.com'
  }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-101',
    sku: 'BRK-CER-MNS8',
    partName: 'Brembo Ceramic Front Brake Pad Set',
    category: 'brakes',
    oemPartNumber: '34-11-6-868-939',
    aftermarketNumber: 'BRM-P85084N',
    hsnCode: '87083000',
    brand: 'Brembo',
    compatibleVehicles: ['Mahindra Scorpio-N (2022+)', 'Mahindra XUV700', 'Tata Harrier/Safari', 'BMW 3-Series'],
    locationStock: {
      'loc-in-1': { quantity: 38, rackLocation: 'BLR-A-12-04' },
      'loc-in-2': { quantity: 18, rackLocation: 'BOM-B-04-01' },
      'loc-in-3': { quantity: 75, rackLocation: 'DEL-WH-BRK-09' },
      'loc-gl-1': { quantity: 8, rackLocation: 'UK-B-02' },
      'loc-gl-2': { quantity: 14, rackLocation: 'DXB-A-03' },
      'loc-gl-3': { quantity: 12, rackLocation: 'NY-A-12' }
    },
    minThreshold: 15,
    costPrice: 2850,
    wholesalePrice: 3950,
    retailPrice: 5490,
    gstRate: 18,
    unit: 'Kit (4 Pads)',
    supplier: 'Brembo India Auto Parts Pvt Ltd',
    leadTimeDays: 2
  },
  {
    id: 'inv-102',
    sku: 'ROTR-VENT-ZIM',
    partName: 'Zimmermann High-Carbon Vented Disc Rotors (Pair)',
    category: 'brakes',
    oemPartNumber: '8W0-615-301-G',
    aftermarketNumber: 'ZIM-100-3331-52',
    hsnCode: '87083000',
    brand: 'Zimmermann',
    compatibleVehicles: ['Tata Harrier / Safari', 'Mahindra XUV700', 'Hyundai Tucson', 'Audi A4'],
    locationStock: {
      'loc-in-1': { quantity: 16, rackLocation: 'BLR-A-14-01' },
      'loc-in-2': { quantity: 8, rackLocation: 'BOM-B-05-02' },
      'loc-in-3': { quantity: 42, rackLocation: 'DEL-WH-BRK-14' },
      'loc-gl-1': { quantity: 6, rackLocation: 'UK-B-05' },
      'loc-gl-2': { quantity: 9, rackLocation: 'DXB-B-01' },
      'loc-gl-3': { quantity: 10, rackLocation: 'NY-A-14' }
    },
    minThreshold: 10,
    costPrice: 5200,
    wholesalePrice: 7200,
    retailPrice: 9800,
    gstRate: 18,
    unit: 'Pair',
    supplier: 'Otto Zimmermann Automotive India',
    leadTimeDays: 3
  },
  {
    id: 'inv-103',
    sku: 'OIL-SYN-5W30',
    partName: 'Castrol EDGE 5W-30 LL Titanium FST Full Synthetic (5L)',
    category: 'fluids',
    oemPartNumber: 'CAS-EDGE-530-5L',
    aftermarketNumber: 'CAS-5W30-5L',
    hsnCode: '27101980',
    brand: 'Castrol India',
    compatibleVehicles: ['Universal Euro 6 / BS6', 'Tata Safari Kryotec', 'Mahindra mStallion / mHawk', 'Hyundai Creta Turbo'],
    locationStock: {
      'loc-in-1': { quantity: 120, rackLocation: 'BLR-FL-01' },
      'loc-in-2': { quantity: 55, rackLocation: 'BOM-FL-02' },
      'loc-in-3': { quantity: 340, rackLocation: 'DEL-WH-OIL-01' },
      'loc-gl-1': { quantity: 30, rackLocation: 'UK-FL-01' },
      'loc-gl-2': { quantity: 45, rackLocation: 'DXB-FL-01' },
      'loc-gl-3': { quantity: 40, rackLocation: 'NY-FL-01' }
    },
    minThreshold: 40,
    costPrice: 2400,
    wholesalePrice: 3200,
    retailPrice: 4450,
    gstRate: 18,
    unit: '5L Canister',
    supplier: 'Castrol India Ltd',
    leadTimeDays: 1
  },
  {
    id: 'inv-104',
    sku: 'FLT-CAB-MANN',
    partName: 'Mann-Filter FreciousPlus Biofunctional Anti-Pollution Cabin Filter',
    category: 'filters',
    oemPartNumber: '64-11-9-321-875',
    aftermarketNumber: 'FP-25-001',
    hsnCode: '84213100',
    brand: 'Mann-Filter',
    compatibleVehicles: ['Hyundai Creta (2020+)', 'Kia Seltos', 'Maruti Grand Vitara', 'Toyota Hyryder'],
    locationStock: {
      'loc-in-1': { quantity: 6, rackLocation: 'BLR-F-02-B' }, // low stock
      'loc-in-2': { quantity: 24, rackLocation: 'BOM-F-01-A' },
      'loc-in-3': { quantity: 95, rackLocation: 'DEL-WH-FLT-04' },
      'loc-gl-1': { quantity: 12, rackLocation: 'UK-F-03' },
      'loc-gl-2': { quantity: 15, rackLocation: 'DXB-F-02' },
      'loc-gl-3': { quantity: 8, rackLocation: 'NY-F-02' }
    },
    minThreshold: 15,
    costPrice: 750,
    wholesalePrice: 1100,
    retailPrice: 1650,
    gstRate: 18,
    unit: 'Each',
    supplier: 'Mann+Hummel Filter India Pvt Ltd',
    leadTimeDays: 1
  },
  {
    id: 'inv-105',
    sku: 'IGN-COIL-BOSCH',
    partName: 'Bosch High-Energy Ignition Coil Pack (OE Spec)',
    category: 'electrical',
    oemPartNumber: '06H-905-115-9',
    aftermarketNumber: 'BOS-0221604115',
    hsnCode: '85113000',
    brand: 'Bosch',
    compatibleVehicles: ['Skoda Kushaq / Slavia 1.5 TSI', 'Volkswagen Taigun / Virtus', 'Maruti Suzuki 1.5 K15C'],
    locationStock: {
      'loc-in-1': { quantity: 28, rackLocation: 'BLR-E-08-03' },
      'loc-in-2': { quantity: 14, rackLocation: 'BOM-E-02-01' },
      'loc-in-3': { quantity: 88, rackLocation: 'DEL-WH-ELEC-07' },
      'loc-gl-1': { quantity: 14, rackLocation: 'UK-E-01' },
      'loc-gl-2': { quantity: 18, rackLocation: 'DXB-E-01' },
      'loc-gl-3': { quantity: 20, rackLocation: 'NY-E-08' }
    },
    minThreshold: 12,
    costPrice: 1450,
    wholesalePrice: 1950,
    retailPrice: 2850,
    gstRate: 18,
    unit: 'Each',
    supplier: 'Bosch Limited (Bengaluru)',
    leadTimeDays: 1
  },
  {
    id: 'inv-106',
    sku: 'SUSP-ARM-LEM',
    partName: 'Lemförder Heavy-Duty Front Lower Control Arm with Hydraulic Bushing',
    category: 'suspension',
    oemPartNumber: '31-12-6-852-991',
    aftermarketNumber: 'LEM-39572-01',
    hsnCode: '87088000',
    brand: 'Lemförder (ZF)',
    compatibleVehicles: ['Mahindra Scorpio-N 4x4', 'Tata Safari Dark Edition', 'BMW 5-Series G30'],
    locationStock: {
      'loc-in-1': { quantity: 4, rackLocation: 'BLR-S-04-A' }, // low stock
      'loc-in-2': { quantity: 9, rackLocation: 'BOM-S-01-B' },
      'loc-in-3': { quantity: 32, rackLocation: 'DEL-WH-SUS-03' },
      'loc-gl-1': { quantity: 4, rackLocation: 'UK-S-01' },
      'loc-gl-2': { quantity: 6, rackLocation: 'DXB-S-02' },
      'loc-gl-3': { quantity: 3, rackLocation: 'NY-S-04' }
    },
    minThreshold: 8,
    costPrice: 4200,
    wholesalePrice: 5800,
    retailPrice: 8400,
    gstRate: 28, // High luxury/chassis auto part rate
    unit: 'Each',
    supplier: 'ZF Commercial Vehicle Control Systems India',
    leadTimeDays: 3
  }
];

export const MOCK_TECHNICIANS: Technician[] = [
  {
    id: 'tech-in-1',
    name: 'Rajesh Sharma',
    skillTier: 'Master Tech (Level 4)',
    locationId: 'loc-in-1',
    status: 'busy',
    currentBayId: 'Bay 01 (Heavy Hydraulic Lift)',
    shiftHours: '09:00 - 18:30 IST',
    hourlyRate: 650, // ₹650/hr
    efficiencyRating: 98.6,
    completedJobsMonth: 48,
    phone: '+91 98450 12345',
    certifications: ['ASDC Master Automotive Tech', 'Bosch Diesel & Common Rail Expert']
  },
  {
    id: 'tech-in-2',
    name: 'Pooja Kulkarni',
    skillTier: 'EV & Hybrid Specialist',
    locationId: 'loc-in-1',
    status: 'busy',
    currentBayId: 'Bay 04 (EV Diagnostics & BMS)',
    shiftHours: '09:00 - 18:30 IST',
    hourlyRate: 750,
    efficiencyRating: 99.4,
    completedJobsMonth: 41,
    phone: '+91 98451 98765',
    certifications: ['High-Voltage EV Certified (TUV)', 'Tata Motors EV Systems Master']
  },
  {
    id: 'tech-in-3',
    name: 'Amitabh Verma',
    skillTier: 'Senior Diagnostics',
    locationId: 'loc-in-1',
    status: 'available',
    currentBayId: undefined,
    shiftHours: '10:00 - 19:30 IST',
    hourlyRate: 550,
    efficiencyRating: 95.2,
    completedJobsMonth: 36,
    phone: '+91 98452 45678',
    certifications: ['OBD-II CAN Bus Specialist', 'Mahindra mStallion Diagnostic Leader']
  },
  {
    id: 'tech-in-4',
    name: 'Farhan Shaikh',
    skillTier: 'Chassis & Alignment',
    locationId: 'loc-in-2',
    status: 'busy',
    currentBayId: 'Bay 02 (Hunter 3D Alignment)',
    shiftHours: '08:30 - 18:00 IST',
    hourlyRate: 500,
    efficiencyRating: 96.8,
    completedJobsMonth: 44,
    phone: '+91 98200 34567',
    certifications: ['Hunter 3D Alignment Master', 'Suspension Overhaul Certified']
  },
  {
    id: 'tech-gl-1',
    name: 'Liam O\'Connor',
    skillTier: 'Master Tech (Level 4)',
    locationId: 'loc-gl-1',
    status: 'busy',
    currentBayId: 'Bay UK-1',
    shiftHours: '08:30 - 17:30 GMT',
    hourlyRate: 55, // £55/hr
    efficiencyRating: 96.5,
    completedJobsMonth: 38,
    phone: '+44 7700 900123',
    certifications: ['IMI Master Technician', 'BMW UK High Voltage']
  }
];

export const MOCK_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo-in-8001',
    orderNumber: 'WO-IN-2026-8001',
    locationId: 'loc-in-1',
    customerName: 'Vikramaditya Singhania',
    customerPhone: '+91 98210 55443',
    customerEmail: 'vikram.singhania@corpindia.com',
    isFleetCustomer: false,
    vehicle: {
      vin: 'MA1TA2SK5N8A99120',
      make: 'Mahindra',
      model: 'Scorpio-N',
      variant: 'Z8L 4x4 Diesel',
      year: 2023,
      licensePlate: 'KA 03 MM 8899',
      mileage: 38450,
      mileageUnit: 'km',
      fuelType: 'Diesel',
      transmission: 'Automatic (AT/TC)',
      color: 'Deep Forest Green'
    },
    bayId: 'Bay 01 (Heavy Hydraulic Lift)',
    assignedTechIds: ['tech-in-1'],
    status: 'in_repair',
    priority: 'high',
    scheduledTime: '2026-11-06T09:30',
    estimatedCompletion: '2026-11-06T16:00',
    reportedIssues: [
      'High-speed brake judder & metallic squeal under sudden deceleration on expressway',
      'DPF (Diesel Particulate Filter) regen warning on cluster with limp mode code'
    ],
    dtcCodes: ['P2002', 'P0300'],
    inspectionChecklist: [
      { item: 'Front Brake Disc Lateral Runout', status: 'fail', notes: 'Measured 0.08mm runout (spec max 0.03mm). Rotors scored.' },
      { item: 'Front Ceramic Brake Pads', status: 'fail', notes: 'Below 3mm pad thickness remaining' },
      { item: 'DPF Soot Mass Differential Pressure', status: 'attention', notes: 'Regeneration cycle initiated' },
      { item: 'Suspension Control Arm Bushings', status: 'pass' },
      { item: 'Bridgestone Dueler All-Terrain Tires', status: 'pass', notes: '6.5mm uniform tread' }
    ],
    inspectionPhotos: [
      HERO_IMAGES.inspection,
      HERO_IMAGES.tablet
    ],
    partsUsed: [
      {
        inventoryItemId: 'inv-101',
        partName: 'Brembo Ceramic Front Brake Pad Set',
        sku: 'BRK-CER-MNS8',
        hsnCode: '87083000',
        quantity: 1,
        unitPrice: 5490,
        gstRate: 18,
        discountPercent: 5
      },
      {
        inventoryItemId: 'inv-102',
        partName: 'Zimmermann High-Carbon Vented Disc Rotors (Pair)',
        sku: 'ROTR-VENT-ZIM',
        hsnCode: '87083000',
        quantity: 1,
        unitPrice: 9800,
        gstRate: 18,
        discountPercent: 5
      }
    ],
    laborItems: [
      { description: 'Front Disc & Ceramic Pad Replacement + Hub Cleaning (SAC: 998714)', hours: 2.0, hourlyRate: 950, sacCode: '998714' },
      { description: 'Automated DPF Forced Regeneration & CAN Bus Reset (SAC: 998714)', hours: 1.0, hourlyRate: 950, sacCode: '998714' }
    ],
    subtotal: 17375.50,
    taxBreakdown: {
      cgst: 1563.80, // 9%
      sgst: 1563.80, // 9%
      totalTax: 3127.60
    },
    taxAmount: 3127.60,
    totalAmount: 20503.10,
    estimateApprovedByCustomer: true,
    approvalTimestamp: '2026-11-06T10:15:00Z',
    paymentStatus: 'unpaid',
    paymentMode: 'UPI / QR'
  },
  {
    id: 'wo-in-8002',
    orderNumber: 'WO-IN-2026-8002',
    locationId: 'loc-in-1',
    customerName: 'QuickLogistics Express India Fleet',
    customerPhone: '+91 99800 11223',
    customerEmail: 'fleet.ops@quicklogistics.in',
    isFleetCustomer: true,
    vehicle: {
      vin: 'MAT625445P3K88721',
      make: 'Tata Motors',
      model: 'Nexon EV',
      variant: 'Max Long Range (45kWh)',
      year: 2024,
      licensePlate: 'KA 01 EV 1024',
      mileage: 52100,
      mileageUnit: 'km',
      fuelType: 'EV',
      transmission: 'Single-Speed (EV)',
      color: 'Intense Teal'
    },
    bayId: 'Bay 04 (EV Diagnostics & BMS)',
    assignedTechIds: ['tech-in-2'],
    status: 'ready_pickup',
    priority: 'urgent',
    scheduledTime: '2026-11-06T08:00',
    estimatedCompletion: '2026-11-06T13:00',
    reportedIssues: [
      '50,000 km Scheduled High-Voltage Battery Health & Coolant Check',
      'Air filtration replacement for driver comfort during high pollution days'
    ],
    dtcCodes: [],
    inspectionChecklist: [
      { item: 'Battery State of Health (SoH)', status: 'pass', notes: 'Measured 97.4% SoH healthy cell pack' },
      { item: 'HV Battery Glycol Coolant Specific Gravity', status: 'pass' },
      { item: 'Cabin PM2.5 Biofunctional Filter', status: 'fail', notes: 'Heavily clogged' },
      { item: 'Regenerative Braking Calibration', status: 'pass' }
    ],
    inspectionPhotos: [HERO_IMAGES.workshop],
    partsUsed: [
      {
        inventoryItemId: 'inv-104',
        partName: 'Mann-Filter Anti-Pollution Cabin Filter',
        sku: 'FLT-CAB-MANN',
        hsnCode: '84213100',
        quantity: 1,
        unitPrice: 1650,
        gstRate: 18,
        discountPercent: 10
      }
    ],
    laborItems: [
      { description: 'Comprehensive 50k EV Battery Pack Diagnostics & Thermal Scan', hours: 1.5, hourlyRate: 1100, sacCode: '998714' },
      { description: 'Cabin Filter Extraction & AC Duct Sanitation', hours: 0.5, hourlyRate: 1100, sacCode: '998714' }
    ],
    subtotal: 3685.00,
    taxBreakdown: {
      cgst: 331.65,
      sgst: 331.65,
      totalTax: 663.30
    },
    taxAmount: 663.30,
    totalAmount: 4348.30,
    estimateApprovedByCustomer: true,
    approvalTimestamp: '2026-11-06T08:30:00Z',
    paymentStatus: 'paid',
    paymentMode: 'UPI / QR',
    upiReference: 'UPI-AXIS-20261106-998811'
  },
  {
    id: 'wo-in-8003',
    orderNumber: 'WO-IN-2026-8003',
    locationId: 'loc-in-2',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 98201 77654',
    customerEmail: 'ananya.d@gmail.com',
    isFleetCustomer: false,
    vehicle: {
      vin: 'MALC151BLN8761234',
      make: 'Hyundai',
      model: 'Creta',
      variant: 'SX(O) 1.5 Turbo Petrol 7DCT',
      year: 2023,
      licensePlate: 'MH 02 FF 7700',
      mileage: 26000,
      mileageUnit: 'km',
      fuelType: 'Petrol',
      transmission: 'Dual Clutch (DCT)',
      color: 'Titan Grey'
    },
    bayId: 'Bay 02 (Hunter 3D Alignment)',
    assignedTechIds: ['tech-in-4'],
    status: 'in_inspection',
    priority: 'medium',
    scheduledTime: '2026-11-06T11:00',
    estimatedCompletion: '2026-11-06T17:00',
    reportedIssues: [
      'Engine oil & filter annual scheduled service (BS6 compliant oil)',
      'Vehicle pulling to left after striking pothole on Western Express Highway'
    ],
    dtcCodes: [],
    inspectionChecklist: [
      { item: 'Front Left Tie Rod End & Ball Joint', status: 'attention', notes: 'Slight play detected' },
      { item: 'Hunter 3D Camber & Toe Reading', status: 'fail', notes: 'Toe-out -0.45 deg' },
      { item: 'Engine Oil Quality', status: 'attention', notes: 'Darkened, replacement due' }
    ],
    inspectionPhotos: [],
    partsUsed: [
      {
        inventoryItemId: 'inv-103',
        partName: 'Castrol EDGE 5W-30 Titanium Full Synthetic (5L)',
        sku: 'OIL-SYN-5W30',
        hsnCode: '27101980',
        quantity: 1,
        unitPrice: 4450,
        gstRate: 18,
        discountPercent: 5
      }
    ],
    laborItems: [
      { description: 'Synthetic Oil & Filter Service (SAC: 998714)', hours: 1.0, hourlyRate: 850, sacCode: '998714' },
      { description: 'Computerized 3D 4-Wheel Laser Alignment (SAC: 998714)', hours: 0.8, hourlyRate: 850, sacCode: '998714' }
    ],
    subtotal: 5757.50,
    taxBreakdown: {
      cgst: 518.18,
      sgst: 518.18,
      totalTax: 1036.35
    },
    taxAmount: 1036.35,
    totalAmount: 6793.85,
    estimateApprovedByCustomer: false,
    paymentStatus: 'unpaid'
  }
];

export const MOCK_NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tmpl-1',
    triggerEvent: 'job_created',
    channel: 'WHATSAPP',
    templateName: 'WhatsApp Work Order Check-In with Live Portal Link',
    content: 'Namaste {{CUSTOMER_NAME}}! 🙏\nYour {{VEHICLE_MAKE}} {{VEHICLE_MODEL}} ({{LICENSE_PLATE}}) is checked into {{LOCATION_NAME}}.\n\n📋 Work Order: #{{ORDER_NUMBER}}\n📍 Location: {{LOCATION_NAME}}\n\nTrack inspection photos & approval status live:\n👉 {{PORTAL_URL}}\n\n- GearShift Garage Operations',
    enabled: true
  },
  {
    id: 'tmpl-2',
    triggerEvent: 'estimate_ready',
    channel: 'WHATSAPP',
    templateName: 'Digital Inspection & GST Estimate Authorization on WhatsApp',
    content: 'Dear {{CUSTOMER_NAME}},\nTechnicians have completed the digital multi-point scan for your {{VEHICLE_MAKE}} {{VEHICLE_MODEL}}.\n\n💰 Total Estimate (Incl. GST): {{CURRENCY}}{{TOTAL_AMOUNT}}\n📸 Undercarriage & Brake photos ready for inspection.\n\nPlease review and 1-tap approve here:\n👉 {{PORTAL_URL}}\n\nAuthorized repairs will begin immediately upon confirmation.',
    enabled: true
  },
  {
    id: 'tmpl-3',
    triggerEvent: 'ready_for_pickup',
    channel: 'WHATSAPP',
    templateName: 'Vehicle Ready for Pickup & Instant UPI Payment',
    content: 'Great news {{CUSTOMER_NAME}}! 🚗💨\nYour {{VEHICLE_MAKE}} {{VEHICLE_MODEL}} is serviced, test-driven, and ready for pickup at {{LOCATION_NAME}}.\n\n🧾 Final Tax Invoice: {{CURRENCY}}{{TOTAL_AMOUNT}}\n💳 Pay securely via instant UPI / QR or Card:\n👉 {{PORTAL_URL}}\n\nThank you for choosing GearShift!',
    enabled: true
  }
];

export const MOCK_NOTIFICATION_LOGS: NotificationLog[] = [
  {
    id: 'log-in-1',
    workOrderId: 'WO-IN-2026-8002',
    customerName: 'QuickLogistics Express India Fleet',
    customerPhone: '+91 99800 11223',
    channel: 'WHATSAPP',
    message: 'Great news QuickLogistics! Your Tata Nexon EV is serviced, test-driven, and ready for pickup at Bengaluru Tech Corridor Mega-Hub. Final Tax Invoice: ₹4,348.30.',
    sentAt: '2026-11-06T12:05:00 IST',
    status: 'read'
  },
  {
    id: 'log-in-2',
    workOrderId: 'WO-IN-2026-8001',
    customerName: 'Vikramaditya Singhania',
    customerPhone: '+91 98210 55443',
    channel: 'WHATSAPP',
    message: 'Dear Vikramaditya, Digital inspection completed for Scorpio-N. Total Estimate: ₹20,503.10. Photos attached in client portal.',
    sentAt: '2026-11-06T10:14:00 IST',
    status: 'delivered'
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-in-9001',
    invoiceNumber: 'INV-BLR-2026-9001',
    workOrderId: 'wo-in-8002',
    customerName: 'QuickLogistics Express India Pvt Ltd',
    customerPhone: '+91 99800 11223',
    customerGstin: '29AAACQ4567M1ZV',
    customerEmail: 'fleet.ops@quicklogistics.in',
    locationId: 'loc-in-1',
    date: '2026-11-06',
    dueDate: '2026-11-20',
    subtotal: 3685.00,
    taxBreakdown: {
      jurisdictionName: 'GST (Karnataka CGST 9% + SGST 9%)',
      taxRate: 18.0,
      cgstAmount: 331.65,
      sgstAmount: 331.65,
      taxAmount: 663.30
    },
    discountAmount: 0,
    totalAmount: 4348.30,
    paymentStatus: 'paid',
    paymentMethod: 'UPI_QR',
    irnNumber: 'eInv-98b7a421-kar-gst-2026'
  },
  {
    id: 'inv-in-9002',
    invoiceNumber: 'INV-BLR-2026-9002',
    workOrderId: 'wo-in-8001',
    customerName: 'Vikramaditya Singhania',
    customerPhone: '+91 98210 55443',
    customerEmail: 'vikram.singhania@corpindia.com',
    locationId: 'loc-in-1',
    date: '2026-11-06',
    dueDate: '2026-11-06',
    subtotal: 17375.50,
    taxBreakdown: {
      jurisdictionName: 'GST (Karnataka CGST 9% + SGST 9%)',
      taxRate: 18.0,
      cgstAmount: 1563.80,
      sgstAmount: 1563.80,
      taxAmount: 3127.60
    },
    discountAmount: 0,
    totalAmount: 20503.10,
    paymentStatus: 'unpaid'
  }
];

export const MOCK_OFFLINE_QUEUE: OfflineSyncItem[] = [
  {
    id: 'sync-in-101',
    type: 'add_inspection_photo',
    payload: { workOrderId: 'wo-in-8001', photoUrl: 'blob:offline-img-001' },
    timestamp: '2026-11-06T11:45:00 IST',
    status: 'synced',
    attempts: 1
  },
  {
    id: 'sync-in-102',
    type: 'update_job_status',
    payload: { workOrderId: 'wo-in-8001', status: 'in_repair' },
    timestamp: '2026-11-06T11:50:00 IST',
    status: 'synced',
    attempts: 1
  }
];

export const MOCK_COMPLIANCE_CONSENTS: ComplianceConsentRecord[] = [
  {
    customerId: 'cust-in-1',
    customerName: 'Vikramaditya Singhania',
    phone: '+91 98210 55443',
    email: 'vikram.singhania@corpindia.com',
    regulation: 'INDIA_DPDPA_2023',
    marketingConsent: false,
    dataProcessingConsent: true,
    whatsappUpdatesConsent: true,
    updatedAt: '2026-11-06T09:00:00 IST',
    ipAddress: '49.206.12.88 (Bengaluru Airtel Fiber)'
  },
  {
    customerId: 'cust-in-2',
    customerName: 'QuickLogistics Express India Pvt Ltd',
    phone: '+91 99800 11223',
    email: 'fleet.ops@quicklogistics.in',
    regulation: 'INDIA_DPDPA_2023',
    marketingConsent: true,
    dataProcessingConsent: true,
    whatsappUpdatesConsent: true,
    updatedAt: '2026-10-15T14:30:00 IST',
    ipAddress: '103.21.144.10 (Mumbai Tata Tele)'
  },
  {
    customerId: 'cust-gl-1',
    customerName: 'Sir Arthur Pendelton',
    phone: '+44 7700 900077',
    email: 'arthur.p@londonlux.co.uk',
    regulation: 'EU_GDPR',
    marketingConsent: false,
    dataProcessingConsent: true,
    whatsappUpdatesConsent: true,
    updatedAt: '2026-10-28T10:15:00 GMT',
    ipAddress: '185.86.151.11 (London)'
  }
];

export const MOCK_COMPLIANCE_AUDIT_LOGS: ComplianceAuditLog[] = [
  {
    id: 'audit-in-001',
    regulation: 'INDIA_DPDPA_2023',
    action: 'consent_updated',
    performedBy: 'Vikramaditya Singhania (Customer Self-Service)',
    targetCustomer: 'Vikramaditya Singhania',
    timestamp: '2026-11-06T09:00:00 IST',
    details: 'Digital consent granted under DPDPA 2023 Section 6 for vehicle service telemetry and WhatsApp invoicing'
  },
  {
    id: 'audit-in-002',
    regulation: 'INDIA_DPDPA_2023',
    action: 'data_exported',
    performedBy: 'Data Protection Officer (DPO)',
    targetCustomer: 'Ananya Deshmukh',
    timestamp: '2026-11-04T16:20:00 IST',
    details: 'Customer Data Principal Right to Access: Full vehicle service record & invoice history exported as encrypted JSON'
  },
  {
    id: 'audit-gl-001',
    regulation: 'EU_GDPR',
    action: 'data_exported',
    performedBy: 'EU Compliance Officer',
    targetCustomer: 'Sir Arthur Pendelton',
    timestamp: '2026-11-01T14:10:00 GMT',
    details: 'GDPR Article 15 Subject Access Request (SAR) exported for European operations'
  }
];
