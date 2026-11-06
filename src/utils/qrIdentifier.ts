import { VehicleSpec, WorkOrder, InventoryItem } from '../types';
import { lookupVehicleByRegistration } from '../data/registrationLookup';

export type QrDetectionResult =
  | {
      type: 'vehicle';
      vehicle: VehicleSpec;
      workOrder?: WorkOrder;
      rawCode: string;
      matchReason: string;
    }
  | {
      type: 'inventory';
      item: InventoryItem;
      rawCode: string;
      matchReason: string;
    }
  | {
      type: 'work_order';
      workOrder: WorkOrder;
      vehicle: VehicleSpec;
      rawCode: string;
      matchReason: string;
    }
  | {
      type: 'unknown';
      rawCode: string;
      message: string;
    };

/**
 * Parses raw barcode/QR code data from camera, image, or scanner
 * and matches it against vehicles, work orders, or inventory items.
 */
export function identifyQrCode(
  rawText: string,
  workOrders: WorkOrder[],
  inventory: InventoryItem[]
): QrDetectionResult {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return { type: 'unknown', rawCode: rawText, message: 'Empty QR code scanned.' };
  }

  // 1. Check for JSON structured payload
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.type === 'vehicle' || parsed.plate || parsed.vin) {
        const plateOrVin = parsed.plate || parsed.vin;
        const matchedWo = workOrders.find(
          w => 
            w.vehicle.licensePlate.replace(/[^A-Za-z0-9]/g, '').toUpperCase() === 
              String(plateOrVin).replace(/[^A-Za-z0-9]/g, '').toUpperCase() ||
            w.vehicle.vin.toUpperCase() === String(plateOrVin).toUpperCase()
        );

        if (matchedWo) {
          return {
            type: 'vehicle',
            vehicle: matchedWo.vehicle,
            workOrder: matchedWo,
            rawCode: trimmed,
            matchReason: 'Matched active vehicle job card via JSON tag'
          };
        }

        // Check registration registry
        const regMatch = lookupVehicleByRegistration(plateOrVin);
        if (regMatch) {
          const veh: VehicleSpec = {
            vin: regMatch.vin,
            make: regMatch.make,
            model: regMatch.model,
            variant: regMatch.variant,
            year: regMatch.year,
            licensePlate: regMatch.licensePlate,
            mileage: 25000,
            mileageUnit: 'km',
            fuelType: regMatch.fuelType,
            transmission: regMatch.transmission,
            engineDisplacement: regMatch.engineDisplacement,
            color: regMatch.color,
            insuranceCompany: regMatch.insuranceCompany,
            insurancePolicyNumber: regMatch.insurancePolicyNumber,
            fastagId: regMatch.fastagId
          };
          return {
            type: 'vehicle',
            vehicle: veh,
            rawCode: trimmed,
            matchReason: 'Matched VAHAN vehicle registry via JSON tag'
          };
        }
      }

      if (parsed.type === 'part' || parsed.sku) {
        const skuToFind = String(parsed.sku || parsed.partNumber).toUpperCase();
        const matchedItem = inventory.find(
          i => i.sku.toUpperCase() === skuToFind || i.oemPartNumber.toUpperCase() === skuToFind
        );
        if (matchedItem) {
          return {
            type: 'inventory',
            item: matchedItem,
            rawCode: trimmed,
            matchReason: 'Matched warehouse spare part SKU via JSON tag'
          };
        }
      }
    } catch {
      // Continue to pattern checks
    }
  }

  // 2. Check for GearShift ERP custom prefix format:
  // e.g. GEARSHIFT:VEHICLE:KA03MM8899, GEARSHIFT:PART:BRK-CER-MNS8, GEARSHIFT:JOB:WO-IN-2026-1049
  if (trimmed.startsWith('GEARSHIFT:')) {
    const parts = trimmed.split(':');
    const entityType = parts[1]?.toUpperCase();
    const identifier = parts.slice(2).join(':').trim();

    if (entityType === 'VEHICLE') {
      return matchVehicleByIdentifier(identifier, workOrders);
    }
    if (entityType === 'PART') {
      return matchInventoryByIdentifier(identifier, inventory);
    }
    if (entityType === 'JOB') {
      const wo = workOrders.find(w => w.orderNumber.toUpperCase() === identifier.toUpperCase());
      if (wo) {
        return {
          type: 'work_order',
          workOrder: wo,
          vehicle: wo.vehicle,
          rawCode: trimmed,
          matchReason: `Matched job card ${wo.orderNumber}`
        };
      }
    }
  }

  // 3. Match against Work Order Numbers (e.g. WO-IN-2026-1049, WO-GL-2026-1053)
  const matchedWoByOrderNo = workOrders.find(
    w => w.orderNumber.replace(/[^A-Za-z0-9]/g, '').toUpperCase() === trimmed.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  );
  if (matchedWoByOrderNo) {
    return {
      type: 'work_order',
      workOrder: matchedWoByOrderNo,
      vehicle: matchedWoByOrderNo.vehicle,
      rawCode: trimmed,
      matchReason: `Matched job card #${matchedWoByOrderNo.orderNumber}`
    };
  }

  // 4. Match against Inventory SKUs, OEM numbers, or Aftermarket numbers
  const matchedPart = inventory.find(
    i => 
      i.sku.toUpperCase() === trimmed.toUpperCase() ||
      i.oemPartNumber.toUpperCase() === trimmed.toUpperCase() ||
      (i.aftermarketNumber && i.aftermarketNumber.toUpperCase() === trimmed.toUpperCase()) ||
      i.hsnCode === trimmed
  );
  if (matchedPart) {
    return {
      type: 'inventory',
      item: matchedPart,
      rawCode: trimmed,
      matchReason: `Matched spare part SKU [${matchedPart.sku}] (${matchedPart.brand})`
    };
  }

  // 5. Match against Vehicle License Plates, VINs, or FASTag IDs
  const vehicleMatch = matchVehicleByIdentifier(trimmed, workOrders);
  if (vehicleMatch.type !== 'unknown') {
    return vehicleMatch;
  }

  // Fallback: Check if trimmed looks like a valid vehicle registration plate
  const regLookup = lookupVehicleByRegistration(trimmed);
  if (regLookup) {
    const veh: VehicleSpec = {
      vin: regLookup.vin,
      make: regLookup.make,
      model: regLookup.model,
      variant: regLookup.variant,
      year: regLookup.year,
      licensePlate: regLookup.licensePlate,
      mileage: 32000,
      mileageUnit: 'km',
      fuelType: regLookup.fuelType,
      transmission: regLookup.transmission,
      engineDisplacement: regLookup.engineDisplacement,
      color: regLookup.color,
      insuranceCompany: regLookup.insuranceCompany,
      insurancePolicyNumber: regLookup.insurancePolicyNumber,
      fastagId: regLookup.fastagId
    };
    return {
      type: 'vehicle',
      vehicle: veh,
      rawCode: trimmed,
      matchReason: `Verified vehicle registry match: ${regLookup.year} ${regLookup.make} ${regLookup.model}`
    };
  }

  return {
    type: 'unknown',
    rawCode: trimmed,
    message: `Scanned code "${trimmed}" did not match any active vehicle job card, spare part SKU, or FASTag in the database.`
  };
}

function matchVehicleByIdentifier(
  identifier: string,
  workOrders: WorkOrder[]
): QrDetectionResult {
  const normId = identifier.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  // Match in active work orders
  const matchedWo = workOrders.find(w => {
    const normPlate = w.vehicle.licensePlate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const normVin = w.vehicle.vin.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const normFastag = (w.vehicle.fastagId || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    return normPlate === normId || normVin === normId || (normFastag && normFastag === normId);
  });

  if (matchedWo) {
    return {
      type: 'vehicle',
      vehicle: matchedWo.vehicle,
      workOrder: matchedWo,
      rawCode: identifier,
      matchReason: `Matched active garage vehicle: ${matchedWo.vehicle.licensePlate}`
    };
  }

  // Match in registry
  const regMatch = lookupVehicleByRegistration(identifier);
  if (regMatch) {
    const veh: VehicleSpec = {
      vin: regMatch.vin,
      make: regMatch.make,
      model: regMatch.model,
      variant: regMatch.variant,
      year: regMatch.year,
      licensePlate: regMatch.licensePlate,
      mileage: 28000,
      mileageUnit: 'km',
      fuelType: regMatch.fuelType,
      transmission: regMatch.transmission,
      engineDisplacement: regMatch.engineDisplacement,
      color: regMatch.color,
      insuranceCompany: regMatch.insuranceCompany,
      insurancePolicyNumber: regMatch.insurancePolicyNumber,
      fastagId: regMatch.fastagId
    };
    return {
      type: 'vehicle',
      vehicle: veh,
      rawCode: identifier,
      matchReason: `Matched registered vehicle: ${regMatch.year} ${regMatch.make} ${regMatch.model}`
    };
  }

  return {
    type: 'unknown',
    rawCode: identifier,
    message: `No vehicle found matching license plate / VIN / FASTag "${identifier}".`
  };
}

function matchInventoryByIdentifier(
  identifier: string,
  inventory: InventoryItem[]
): QrDetectionResult {
  const cleanId = identifier.trim().toUpperCase();
  const matched = inventory.find(
    i => 
      i.sku.toUpperCase() === cleanId || 
      i.oemPartNumber.toUpperCase() === cleanId ||
      (i.aftermarketNumber && i.aftermarketNumber.toUpperCase() === cleanId) ||
      i.hsnCode === cleanId
  );

  if (matched) {
    return {
      type: 'inventory',
      item: matched,
      rawCode: identifier,
      matchReason: `Matched spare part: ${matched.partName} (${matched.sku})`
    };
  }

  return {
    type: 'unknown',
    rawCode: identifier,
    message: `No inventory item found matching SKU or Part Number "${identifier}".`
  };
}
