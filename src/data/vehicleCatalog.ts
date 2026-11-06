export interface VehicleCatalogEntry {
  make: string;
  models: {
    name: string;
    variants: string[];
    fuelTypes: ('Petrol' | 'Diesel' | 'EV' | 'CNG' | 'Hybrid')[];
    transmissions: ('Manual 6-Speed' | 'Automatic (AT/TC)' | 'Dual Clutch (DCT)' | 'CVT' | 'Single-Speed (EV)')[];
    typicalEngineCC: string;
    engineNumberPrefix: string;
    vinPrefix: string;
  }[];
}

export const POPULAR_VEHICLE_CATALOG: VehicleCatalogEntry[] = [
  {
    make: 'Mahindra',
    models: [
      {
        name: 'Scorpio-N',
        variants: ['Z8L 4x4', 'Z8 Select', 'Z4 Diesel', 'Z2 Petrol'],
        fuelTypes: ['Diesel', 'Petrol'],
        transmissions: ['Automatic (AT/TC)', 'Manual 6-Speed'],
        typicalEngineCC: '2.2L mHawk (2198 cc) / 2.0L mStallion TGDi',
        engineNumberPrefix: 'MHWK22',
        vinPrefix: 'MA1TA2'
      },
      {
        name: 'XUV700',
        variants: ['AX7 Luxury Pack', 'AX5 Diesel', 'AX3 Petrol', 'MX'],
        fuelTypes: ['Diesel', 'Petrol'],
        transmissions: ['Automatic (AT/TC)', 'Manual 6-Speed'],
        typicalEngineCC: '2.2L mHawk (185 PS) / 2.0L mStallion (200 PS)',
        engineNumberPrefix: 'XUV22D',
        vinPrefix: 'MA1XA7'
      },
      {
        name: 'Thar / Thar Roxx',
        variants: ['AX Opt 4x4', 'LX Hardtop 4x4', 'Roxx AX7L'],
        fuelTypes: ['Diesel', 'Petrol'],
        transmissions: ['Manual 6-Speed', 'Automatic (AT/TC)'],
        typicalEngineCC: '2.2L mHawk CRDe (130-175 PS)',
        engineNumberPrefix: 'THR22M',
        vinPrefix: 'MA1TH4'
      }
    ]
  },
  {
    make: 'Tata Motors',
    models: [
      {
        name: 'Nexon / Nexon EV',
        variants: ['Fearless+ S', 'Creative DT', 'EV Max Empowered+ (45kWh)', 'EV Long Range'],
        fuelTypes: ['EV', 'Petrol', 'Diesel', 'CNG'],
        transmissions: ['Single-Speed (EV)', 'Dual Clutch (DCT)', 'Manual 6-Speed'],
        typicalEngineCC: 'Permanent Magnet Synchronous AC / 1.2L Turbo Revotron',
        engineNumberPrefix: 'REV12T',
        vinPrefix: 'MAT625'
      },
      {
        name: 'Harrier / Safari',
        variants: ['Fearless+ Dark Edition', 'Adventure+ A', 'Pure+ S', 'Accomplished+ 6S'],
        fuelTypes: ['Diesel'],
        transmissions: ['Automatic (AT/TC)', 'Manual 6-Speed'],
        typicalEngineCC: '2.0L Kryotec Turbocharged Diesel (170 PS)',
        engineNumberPrefix: 'KRYO20',
        vinPrefix: 'MAT682'
      },
      {
        name: 'Punch / Punch EV',
        variants: ['Empowered+ S (Long Range)', 'Adventure Rhythm', 'Accomplished Dazzle'],
        fuelTypes: ['EV', 'Petrol', 'CNG'],
        transmissions: ['Single-Speed (EV)', 'Automatic (AT/TC)', 'Manual 6-Speed'],
        typicalEngineCC: 'activa.ev 35kWh / 1.2L Revotron 3-Cyl',
        engineNumberPrefix: 'REV12N',
        vinPrefix: 'MAT612'
      }
    ]
  },
  {
    make: 'Hyundai',
    models: [
      {
        name: 'Creta',
        variants: ['SX(O) Turbo 7DCT', 'SX Tech Diesel AT', 'S(O) Knight Edition', 'E 1.5 MPI'],
        fuelTypes: ['Petrol', 'Diesel'],
        transmissions: ['Dual Clutch (DCT)', 'Automatic (AT/TC)', 'CVT', 'Manual 6-Speed'],
        typicalEngineCC: '1.5L Kappa Turbo GDi (160 PS) / 1.5L U2 CRDi (116 PS)',
        engineNumberPrefix: 'G4FV',
        vinPrefix: 'MALC15'
      },
      {
        name: 'Venue',
        variants: ['N Line N8 DCT', 'SX(O) Turbo', 'S+ Diesel'],
        fuelTypes: ['Petrol', 'Diesel'],
        transmissions: ['Dual Clutch (DCT)', 'Manual 6-Speed'],
        typicalEngineCC: '1.0L Turbo GDi (120 PS)',
        engineNumberPrefix: 'G3LC',
        vinPrefix: 'MALB10'
      }
    ]
  },
  {
    make: 'Maruti Suzuki',
    models: [
      {
        name: 'Brezza',
        variants: ['ZXi+ AT Dual Tone', 'VXi CNG', 'ZXi Smart Hybrid'],
        fuelTypes: ['Petrol', 'CNG', 'Hybrid'],
        transmissions: ['Automatic (AT/TC)', 'Manual 6-Speed'],
        typicalEngineCC: '1.5L K15C DualJet Dual VVT (103 PS)',
        engineNumberPrefix: 'K15C',
        vinPrefix: 'MA3FJB'
      },
      {
        name: 'Grand Vitara',
        variants: ['Alpha+ Intelligent Electric Hybrid', 'Zeta AllGrip 4WD', 'Delta CNG'],
        fuelTypes: ['Hybrid', 'Petrol', 'CNG'],
        transmissions: ['CVT', 'Automatic (AT/TC)', 'Manual 6-Speed'],
        typicalEngineCC: '1.5L Strong Hybrid e-CVT / 1.5L K15C',
        engineNumberPrefix: 'M15A',
        vinPrefix: 'MA3ENA'
      }
    ]
  },
  {
    make: 'BMW',
    models: [
      {
        name: '3-Series',
        variants: ['330Li M Sport', 'M340i xDrive', '320d Luxury Line'],
        fuelTypes: ['Petrol', 'Diesel'],
        transmissions: ['Automatic (AT/TC)'],
        typicalEngineCC: '2.0L B48 TwinPower Turbo (258 PS) / 3.0L B58 Inline-6 (387 PS)',
        engineNumberPrefix: 'B48B20',
        vinPrefix: 'WBA5A5'
      }
    ]
  }
];
