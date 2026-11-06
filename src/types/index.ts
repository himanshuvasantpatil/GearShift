export type ViewMode = 
  | 'dashboard' 
  | 'work_orders' 
  | 'vehicle_history'
  | 'garage_setup'
  | 'scheduling' 
  | 'inventory' 
  | 'financials' 
  | 'mobile_tech' 
  | 'client_portal' 
  | 'notifications' 
  | 'offline_sync' 
  | 'compliance';

export type TaxJurisdiction = 'INDIA_GST' | 'US_SALES_TAX' | 'EU_VAT' | 'UK_VAT' | 'UAE_VAT';

export interface Location {
  id: string;
  name: string;
  code: string;
  region: 'INDIA' | 'GLOBAL';
  type: 'hub_garage' | 'express_bay' | 'spare_depot' | 'mobile_fleet';
  address: string;
  city: string;
  state?: string;
  country: string;
  currency: string;
  currencyCode: 'INR' | 'USD' | 'GBP' | 'EUR' | 'AED';
  taxJurisdiction: TaxJurisdiction;
  gstin?: string;
  panNumber?: string;
  hsnCodeScope?: string;
  defaultTaxRate: number;
  cgstRate?: number;
  sgstRate?: number;
  igstRate?: number;
  baysCount: number;
  phone: string;
  email: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  partName: string;
  category: 'brakes' | 'engine' | 'suspension' | 'fluids' | 'electrical' | 'filters' | 'tires' | 'transmission';
  oemPartNumber: string;
  aftermarketNumber: string;
  hsnCode?: string;
  compatibleVehicles: string[];
  brand: string;
  locationStock: Record<string, { quantity: number; rackLocation: string }>;
  minThreshold: number;
  costPrice: number;
  wholesalePrice: number;
  retailPrice: number;
  gstRate: number;
  unit: string;
  supplier: string;
  leadTimeDays: number;
}

export interface Technician {
  id: string;
  name: string;
  avatarUrl?: string;
  skillTier: 'Master Tech (Level 4)' | 'EV & Hybrid Specialist' | 'Senior Diagnostics' | 'Chassis & Alignment' | 'Apprentice';
  locationId: string;
  status: 'available' | 'busy' | 'on_break' | 'off_duty';
  currentBayId?: string;
  shiftHours: string;
  hourlyRate: number;
  efficiencyRating: number;
  completedJobsMonth: number;
  phone: string;
  certifications: string[];
}

export interface VehicleSpec {
  vin: string; // 17-character VIN
  engineNumber?: string;
  chassisNumber?: string;
  make: string;
  model: string;
  variant: string; // e.g. "Z8L 4x4", "Fearless Dark Edition", "SX(O) Turbo"
  year: number;
  licensePlate: string; // e.g. "MH 02 EE 4099"
  mileage: number;
  mileageUnit: 'km' | 'mi';
  fuelType: 'Petrol' | 'Diesel' | 'EV' | 'CNG' | 'Hybrid';
  transmission: 'Manual 6-Speed' | 'Automatic (AT/TC)' | 'Dual Clutch (DCT)' | 'CVT' | 'Single-Speed (EV)';
  engineDisplacement?: string; // e.g. "2.2L mHawk CRDe", "1.5L Turbo GDi", "Permanent Magnet AC"
  color: string;
  insuranceCompany?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: string;
  pucExpiryDate?: string; // Pollution Under Control certificate for India
  fastagId?: string; // FASTag RFID ID
}

export interface WorkOrder {
  id: string;
  orderNumber: string;
  locationId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerGstin?: string; // B2B GST tax credit
  isFleetCustomer: boolean;
  vehicle: VehicleSpec;
  bayId: string;
  assignedTechIds: string[];
  status: 'scheduled' | 'in_inspection' | 'parts_pending' | 'in_repair' | 'qc_testing' | 'ready_pickup' | 'completed' | 'invoiced';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledTime: string;
  estimatedCompletion: string;
  reportedIssues: string[];
  dtcCodes: string[];
  fuelLevelPercentage?: number; // e.g. 75%
  visualInspectionScratches?: Array<{ bodyPart: string; severity: 'minor' | 'dent' | 'scratch' }>;
  valuableItemsDeclared?: string[];
  inspectionChecklist: Array<{
    item: string;
    status: 'pass' | 'fail' | 'attention';
    notes?: string;
  }>;
  inspectionPhotos: string[];
  partsUsed: Array<{
    inventoryItemId: string;
    partName: string;
    sku: string;
    hsnCode?: string;
    quantity: number;
    unitPrice: number;
    gstRate?: number;
    discountPercent: number;
  }>;
  laborItems: Array<{
    description: string;
    hours: number;
    hourlyRate: number;
    sacCode?: string;
  }>;
  subtotal: number;
  taxBreakdown: {
    cgst?: number;
    sgst?: number;
    igst?: number;
    stateSalesTax?: number;
    vat?: number;
    totalTax: number;
  };
  taxAmount: number;
  totalAmount: number;
  estimateApprovedByCustomer: boolean;
  approvalTimestamp?: string;
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid';
  paymentMode?: 'UPI / QR' | 'Credit Card' | 'NetBanking' | 'Cash' | 'NEFT/RTGS';
  upiReference?: string;
  createdOffline?: boolean;
}

export interface NotificationTemplate {
  id: string;
  triggerEvent: 'job_created' | 'estimate_ready' | 'repair_started' | 'parts_arrived' | 'ready_for_pickup' | 'payment_reminder';
  channel: 'WHATSAPP' | 'SMS' | 'EMAIL';
  templateName: string;
  subject?: string;
  content: string;
  enabled: boolean;
}

export interface NotificationLog {
  id: string;
  workOrderId: string;
  customerName: string;
  customerPhone: string;
  channel: 'WHATSAPP' | 'SMS' | 'EMAIL';
  message: string;
  sentAt: string;
  status: 'delivered' | 'read' | 'queued' | 'failed';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  workOrderId?: string;
  customerName: string;
  customerPhone: string;
  customerGstin?: string;
  customerEmail: string;
  locationId: string;
  date: string;
  dueDate: string;
  subtotal: number;
  taxBreakdown: {
    jurisdictionName: string;
    taxRate: number;
    cgstAmount?: number;
    sgstAmount?: number;
    igstAmount?: number;
    taxAmount: number;
  };
  discountAmount: number;
  totalAmount: number;
  paymentStatus: 'paid' | 'unpaid' | 'overdue';
  paymentMethod?: 'UPI_QR' | 'CREDIT_CARD' | 'BANK_NEFT' | 'CASH' | 'ONLINE_PORTAL';
  eWayBillNumber?: string;
  irnNumber?: string;
}

export interface OfflineSyncItem {
  id: string;
  type: 'create_work_order' | 'update_job_status' | 'add_inspection_photo' | 'adjust_inventory' | 'record_payment';
  payload: any;
  timestamp: string;
  status: 'pending' | 'synced' | 'conflict';
  attempts: number;
  error?: string;
}

export interface ComplianceConsentRecord {
  customerId: string;
  customerName: string;
  phone: string;
  email: string;
  regulation: 'INDIA_DPDPA_2023' | 'EU_GDPR';
  marketingConsent: boolean;
  dataProcessingConsent: boolean;
  whatsappUpdatesConsent: boolean;
  updatedAt: string;
  ipAddress: string;
}

export interface ComplianceAuditLog {
  id: string;
  regulation: 'INDIA_DPDPA_2023' | 'EU_GDPR';
  action: 'data_exported' | 'data_anonymized' | 'consent_updated' | 'record_deleted';
  performedBy: string;
  targetCustomer: string;
  timestamp: string;
  details: string;
}

export interface GarageSetupConfig {
  garageName: string;
  brandTagline: string;
  ownerName: string;
  phone: string;
  email: string;
  state: string;
  city: string;
  address: string;
  gstin: string;
  panNumber: string;
  bankAccountDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    upiVpa: string;
  };
  bays: Array<{
    bayId: string;
    name: string;
    bayType: '2-Post Hydraulic Lift' | '4-Post Alignment Rack' | 'Scissor Lift' | 'Diagnostic & EV Bay' | 'Washing & Detailing';
    status: 'operational' | 'maintenance';
  }>;
  laborRatePerHour: number;
  sacCode: string;
  whatsappBusinessNumber: string;
  isSetupComplete: boolean;
}

export interface AiDiagnosticResult {
  dtcCode: string;
  title: string;
  severity: 'low' | 'moderate' | 'critical';
  probableCauses: string[];
  recommendedFixes: string[];
  estimatedLaborHours: number;
  recommendedParts: Array<{
    partName: string;
    sku: string;
    oemPartNumber: string;
    estimatedCost: number;
    hsnCode?: string;
  }>;
}
