import React, { useState } from 'react';
import { 
  MOCK_LOCATIONS, 
  MOCK_INVENTORY, 
  MOCK_TECHNICIANS, 
  MOCK_WORK_ORDERS, 
  MOCK_NOTIFICATION_TEMPLATES, 
  MOCK_NOTIFICATION_LOGS, 
  MOCK_INVOICES, 
  MOCK_OFFLINE_QUEUE, 
  MOCK_COMPLIANCE_CONSENTS, 
  MOCK_COMPLIANCE_AUDIT_LOGS 
} from './data/mockData';
import { 
  Location, 
  WorkOrder, 
  InventoryItem, 
  Technician, 
  NotificationTemplate, 
  NotificationLog, 
  Invoice, 
  OfflineSyncItem, 
  ComplianceConsentRecord, 
  ComplianceAuditLog, 
  GarageSetupConfig,
  ViewMode,
  VehicleSpec
} from './types';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { WorkOrdersView } from './views/WorkOrdersView';
import { SchedulingView } from './views/SchedulingView';
import { InventoryView } from './views/InventoryView';
import { FinancialsView } from './views/FinancialsView';
import { MobileTechView } from './views/MobileTechView';
import { CustomerPortalView } from './views/CustomerPortalView';
import { NotificationsView } from './views/NotificationsView';
import { OfflineSyncView } from './views/OfflineSyncView';
import { ComplianceView } from './views/ComplianceView';
import { VehicleHistoryView } from './views/VehicleHistoryView';
import { GarageSetupView } from './views/GarageSetupView';
import { AiAssistantModal } from './components/AiAssistantModal';
import { NewWorkOrderModal } from './components/NewWorkOrderModal';
import { QrScannerModal } from './components/QrScannerModal';
import { QrLabelModal } from './components/QrLabelModal';
import { CommandPalette } from './components/CommandPalette';
import { ToastProvider, useToast } from './components/ui/Toast';

function AppContent() {
  const { showToast, triggerConfetti } = useToast();
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);
  const [currentLocation, setCurrentLocation] = useState<Location>(MOCK_LOCATIONS[0]);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // State collections
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(MOCK_WORK_ORDERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [technicians, setTechnicians] = useState<Technician[]>(MOCK_TECHNICIANS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [notificationTemplates] = useState<NotificationTemplate[]>(MOCK_NOTIFICATION_TEMPLATES);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>(MOCK_NOTIFICATION_LOGS);
  const [syncQueue, setSyncQueue] = useState<OfflineSyncItem[]>(MOCK_OFFLINE_QUEUE);
  const [complianceConsents, setComplianceConsents] = useState<ComplianceConsentRecord[]>(MOCK_COMPLIANCE_CONSENTS);
  const [complianceAuditLogs, setComplianceAuditLogs] = useState<ComplianceAuditLog[]>(MOCK_COMPLIANCE_AUDIT_LOGS);

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiTargetWorkOrder, setAiTargetWorkOrder] = useState<WorkOrder | null>(null);
  const [isNewWoModalOpen, setIsNewWoModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // QR Scanner & Label Generator State
  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);
  const [qrLabelEntity, setQrLabelEntity] = useState<{
    type: 'vehicle' | 'inventory';
    vehicle?: VehicleSpec;
    workOrder?: WorkOrder;
    item?: InventoryItem;
  } | null>(null);
  const [scannedInitialVehicle, setScannedInitialVehicle] = useState<VehicleSpec | null>(null);

  // Issue Part to Work Order via QR scan
  const handleAddPartToWorkOrder = (targetWo: WorkOrder, item: InventoryItem) => {
    const qty = 1;
    const unitPrice = item.retailPrice;
    const gstRate = item.gstRate || currentLocation.defaultTaxRate;
    const partCost = unitPrice * qty;
    const partTax = Number((partCost * (gstRate / 100)).toFixed(2));

    const updatedParts = [
      ...targetWo.partsUsed,
      {
        inventoryItemId: item.id,
        partName: item.partName,
        sku: item.sku,
        hsnCode: item.hsnCode,
        quantity: qty,
        unitPrice,
        gstRate,
        discountPercent: 0
      }
    ];

    const newSubtotal = targetWo.subtotal + partCost;
    const newTax = Number((targetWo.taxAmount + partTax).toFixed(2));
    const newTotal = Number((newSubtotal + newTax).toFixed(2));

    const updatedWo: WorkOrder = {
      ...targetWo,
      partsUsed: updatedParts,
      subtotal: newSubtotal,
      taxAmount: newTax,
      totalAmount: newTotal,
      taxBreakdown: {
        ...targetWo.taxBreakdown,
        cgst: currentLocation.region === 'INDIA' ? newTax / 2 : undefined,
        sgst: currentLocation.region === 'INDIA' ? newTax / 2 : undefined,
        totalTax: newTax
      }
    };

    handleUpdateWorkOrder(updatedWo);

    // Deduct stock from current location
    setInventory(prev => prev.map(invItem => {
      if (invItem.id === item.id) {
        const currentQty = invItem.locationStock[currentLocation.id]?.quantity || 0;
        return {
          ...invItem,
          locationStock: {
            ...invItem.locationStock,
            [currentLocation.id]: {
              ...invItem.locationStock[currentLocation.id],
              quantity: Math.max(0, currentQty - qty)
            }
          }
        };
      }
      return invItem;
    }));

    showToast({
      type: 'success',
      title: `Part Allocated to Job #${targetWo.orderNumber}`,
      message: `${item.partName} (${item.sku}) attached. Warehouse stock updated!`
    });
  };

  // Handler to update or append work order
  const handleUpdateWorkOrder = (updated: WorkOrder) => {
    if (isOffline) {
      const newSyncItem: OfflineSyncItem = {
        id: `sync-${Date.now()}`,
        type: 'update_job_status',
        payload: { workOrderId: updated.id, status: updated.status },
        timestamp: new Date().toISOString(),
        status: 'pending',
        attempts: 0
      };
      setSyncQueue(prev => [newSyncItem, ...prev]);
    }

    setWorkOrders(prev => prev.map(w => w.id === updated.id ? updated : w));
  };

  const handleCreateWorkOrder = (newWo: WorkOrder) => {
    if (isOffline) {
      const newSyncItem: OfflineSyncItem = {
        id: `sync-${Date.now()}`,
        type: 'create_work_order',
        payload: newWo,
        timestamp: new Date().toISOString(),
        status: 'pending',
        attempts: 0
      };
      setSyncQueue(prev => [newSyncItem, ...prev]);
    }
    setWorkOrders(prev => [newWo, ...prev]);

    // Add automated invoice draft
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${currentLocation.code.slice(0, 3)}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      workOrderId: newWo.id,
      customerName: newWo.customerName,
      customerPhone: newWo.customerPhone,
      customerEmail: newWo.customerEmail,
      locationId: currentLocation.id,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      subtotal: newWo.subtotal,
      taxBreakdown: {
        jurisdictionName: `${currentLocation.taxJurisdiction.replace('_', ' ')} (${currentLocation.defaultTaxRate}%)`,
        taxRate: currentLocation.defaultTaxRate,
        cgstAmount: currentLocation.region === 'INDIA' ? newWo.taxAmount / 2 : undefined,
        sgstAmount: currentLocation.region === 'INDIA' ? newWo.taxAmount / 2 : undefined,
        taxAmount: newWo.taxAmount
      },
      discountAmount: 0,
      totalAmount: newWo.totalAmount,
      paymentStatus: 'unpaid'
    };
    setInvoices(prev => [newInvoice, ...prev]);

    triggerConfetti();
    showToast({
      type: 'success',
      title: `Job Card #${newWo.orderNumber} Generated!`,
      message: `${newWo.vehicle.make} ${newWo.vehicle.model} (${newWo.vehicle.licensePlate}) checked into Bay ${newWo.bayId}.`
    });
  };

  const handleForceSync = () => {
    setSyncQueue(prev => prev.map(item => ({ ...item, status: 'synced' as const, attempts: item.attempts + 1 })));
    setTimeout(() => {
      setSyncQueue([]);
      showToast({
        type: 'success',
        title: 'Offline Sync Complete',
        message: 'Local IndexedDB offline records successfully synced to Central Enterprise Database.'
      });
    }, 600);
  };

  const handleSendNotification = (wo: WorkOrder) => {
    const newLog: NotificationLog = {
      id: `log-${Date.now()}`,
      workOrderId: wo.orderNumber,
      customerName: wo.customerName,
      customerPhone: wo.customerPhone,
      channel: 'WHATSAPP',
      message: `Namaste ${wo.customerName}! Update from ${currentLocation.name}: Your ${wo.vehicle.make} (${wo.vehicle.licensePlate}) status is now "${wo.status.replace('_', ' ')}". Total: ${currentLocation.currency} ${wo.totalAmount.toFixed(2)}.`,
      sentAt: new Date().toLocaleTimeString(),
      status: 'delivered'
    };
    setNotificationLogs(prev => [newLog, ...prev]);
    showToast({
      type: 'info',
      title: 'WhatsApp Update Dispatched',
      message: `Automated status update delivered to ${wo.customerPhone}.`
    });
  };

  const handleExportCustomerData = (customerId: string) => {
    const target = complianceConsents.find(c => c.customerId === customerId);
    if (!target) return;
    const jsonStr = JSON.stringify({ 
      dataPrincipal: target, 
      statutoryLaw: target.regulation,
      workOrders: workOrders.filter(w => w.customerName === target.customerName) 
    }, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Data_Principal_Report_${target.customerName.replace(/\s+/g, '_')}_${target.regulation}.json`;
    a.click();
    URL.revokeObjectURL(url);

    const audit: ComplianceAuditLog = {
      id: `audit-${Date.now()}`,
      regulation: target.regulation,
      action: 'data_exported',
      performedBy: 'Compliance DPO Officer',
      targetCustomer: target.customerName,
      timestamp: new Date().toISOString(),
      details: `Full Data Principal records exported under ${target.regulation === 'INDIA_DPDPA_2023' ? 'India DPDPA Section 11' : 'GDPR Article 15'}`
    };
    setComplianceAuditLogs(prev => [audit, ...prev]);
    showToast({
      type: 'info',
      title: 'Data Principal Report Exported',
      message: `Downloaded JSON compliance archive for ${target.customerName}.`
    });
  };

  const handleAnonymizeCustomer = (customerId: string) => {
    const target = complianceConsents.find(c => c.customerId === customerId);
    if (!target) return;
    if (!confirm(`Confirm Right to Erasure / PII scrub for ${target.customerName} under ${target.regulation}? Tax and GST books will retain anonymized transaction records.`)) return;

    setComplianceConsents(prev => prev.filter(c => c.customerId !== customerId));
    setWorkOrders(prev => prev.map(w => w.customerName === target.customerName ? { 
      ...w, 
      customerName: 'ANONYMIZED_PRINCIPAL', 
      customerPhone: '+91 00000 00000', 
      customerEmail: 'anonymized@privacy.internal' 
    } : w));

    const audit: ComplianceAuditLog = {
      id: `audit-${Date.now()}`,
      regulation: target.regulation,
      action: 'data_anonymized',
      performedBy: 'Compliance DPO',
      targetCustomer: target.customerName,
      timestamp: new Date().toISOString(),
      details: 'Right-to-be-forgotten / Erasure completed. Telemetry and PII scrubbed from active databases.'
    };
    setComplianceAuditLogs(prev => [audit, ...prev]);
    showToast({
      type: 'error',
      title: 'PII Scrubbed & Anonymized',
      message: `Customer records permanently anonymized per legal compliance regulations.`
    });
  };

  const handleSaveSetup = (cfg: GarageSetupConfig) => {
    const updatedLocation: Location = {
      ...currentLocation,
      name: cfg.garageName,
      phone: cfg.phone,
      email: cfg.email,
      address: cfg.address,
      city: cfg.city,
      state: cfg.state,
      gstin: cfg.gstin,
      panNumber: cfg.panNumber,
      baysCount: cfg.bays.length
    };
    setCurrentLocation(updatedLocation);
    setLocations(prev => prev.map(l => l.id === updatedLocation.id ? updatedLocation : l));
    setCurrentView('dashboard');
    showToast({
      type: 'success',
      title: 'Garage Profile Saved',
      message: `${cfg.garageName} location settings updated successfully!`
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-600 selection:text-white">
      {/* Top Header Bar */}
      <Header
        currentLocation={currentLocation}
        locations={locations}
        onSelectLocation={setCurrentLocation}
        currentView={currentView}
        onSelectView={setCurrentView}
        isOffline={isOffline}
        onToggleOffline={() => {
          const next = !isOffline;
          setIsOffline(next);
          showToast({
            type: next ? 'error' : 'success',
            title: next ? 'Offline Remote Mode Activated' : 'Enterprise Connection Online',
            message: next ? 'Transactions queued locally in IndexedDB' : 'Synchronized with cloud servers'
          });
        }}
        pendingSyncCount={syncQueue.filter(s => s.status === 'pending').length}
        onOpenAiAssistant={() => {
          setAiTargetWorkOrder(null);
          setIsAiModalOpen(true);
        }}
        onOpenNewWorkOrder={() => {
          setScannedInitialVehicle(null);
          setIsNewWoModalOpen(true);
        }}
        onOpenQrScanner={() => setIsQrScannerOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (hidden when in dedicated Mobile View or Client Portal mode) */}
        {currentView !== 'mobile_tech' && currentView !== 'client_portal' && (
          <Sidebar
            currentView={currentView}
            onSelectView={setCurrentView}
            pendingSyncCount={syncQueue.filter(s => s.status === 'pending').length}
          />
        )}

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              currentLocation={currentLocation}
              locations={locations}
              workOrders={workOrders}
              inventory={inventory}
              technicians={technicians}
              onSelectView={setCurrentView}
              onOpenWorkOrder={(wo) => setCurrentView('work_orders')}
              onOpenNewWorkOrder={() => {
                setScannedInitialVehicle(null);
                setIsNewWoModalOpen(true);
              }}
            />
          )}

          {currentView === 'work_orders' && (
            <WorkOrdersView
              workOrders={workOrders}
              currentLocation={currentLocation}
              inventory={inventory}
              technicians={technicians}
              onUpdateWorkOrder={handleUpdateWorkOrder}
              onOpenNewWorkOrder={() => {
                setScannedInitialVehicle(null);
                setIsNewWoModalOpen(true);
              }}
              onOpenAiAssistant={(wo) => {
                setAiTargetWorkOrder(wo || null);
                setIsAiModalOpen(true);
              }}
              onSendNotification={handleSendNotification}
              onOpenQrScanner={() => setIsQrScannerOpen(true)}
              onPrintQrLabel={(ent) => setQrLabelEntity(ent)}
            />
          )}

          {currentView === 'vehicle_history' && (
            <VehicleHistoryView
              workOrders={workOrders}
              currentLocation={currentLocation}
              onOpenWorkOrder={(wo) => setCurrentView('work_orders')}
            />
          )}

          {currentView === 'garage_setup' && (
            <GarageSetupView
              currentLocation={currentLocation}
              onSaveSetup={handleSaveSetup}
            />
          )}

          {currentView === 'scheduling' && (
            <SchedulingView
              currentLocation={currentLocation}
              technicians={technicians}
              workOrders={workOrders}
              onReassignTech={(techId, bayId) => {
                showToast({
                  type: 'info',
                  title: 'Technician Reassigned',
                  message: `Tech reassigned to Bay ${bayId}`
                });
              }}
            />
          )}

          {currentView === 'inventory' && (
            <InventoryView
              inventory={inventory}
              locations={locations}
              currentLocation={currentLocation}
              onUpdateInventory={setInventory}
              onOpenAiPartsFinder={() => setIsAiModalOpen(true)}
              onOpenQrScanner={() => setIsQrScannerOpen(true)}
              onPrintQrLabel={(ent) => setQrLabelEntity(ent)}
            />
          )}

          {currentView === 'financials' && (
            <FinancialsView
              invoices={invoices}
              locations={locations}
              currentLocation={currentLocation}
            />
          )}

          {currentView === 'mobile_tech' && (
            <MobileTechView
              workOrders={workOrders}
              technicians={technicians}
              currentLocation={currentLocation}
              inventory={inventory}
              isOffline={isOffline}
              onUpdateWorkOrder={handleUpdateWorkOrder}
              onOpenAiAssistant={(wo) => {
                setAiTargetWorkOrder(wo || null);
                setIsAiModalOpen(true);
              }}
              onOpenQrScanner={() => setIsQrScannerOpen(true)}
              onPrintQrLabel={(ent) => setQrLabelEntity(ent)}
            />
          )}

          {currentView === 'client_portal' && (
            <CustomerPortalView
              workOrders={workOrders}
              currentLocation={currentLocation}
              onUpdateWorkOrder={handleUpdateWorkOrder}
            />
          )}

          {currentView === 'notifications' && (
            <NotificationsView
              templates={notificationTemplates}
              logs={notificationLogs}
              currentLocation={currentLocation}
            />
          )}

          {currentView === 'offline_sync' && (
            <OfflineSyncView
              isOffline={isOffline}
              onToggleOffline={() => setIsOffline(!isOffline)}
              syncQueue={syncQueue}
              onForceSync={handleForceSync}
            />
          )}

          {currentView === 'compliance' && (
            <ComplianceView
              consents={complianceConsents}
              auditLogs={complianceAuditLogs}
              onExportCustomerData={handleExportCustomerData}
              onAnonymizeCustomer={handleAnonymizeCustomer}
            />
          )}
        </main>
      </div>

      {/* Universal Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        workOrders={workOrders}
        inventory={inventory}
        currentLocation={currentLocation}
        onSelectView={setCurrentView}
        onSelectWorkOrder={(wo) => setCurrentView('work_orders')}
        onSelectInventoryItem={(item) => setCurrentView('inventory')}
        onOpenNewWorkOrder={() => {
          setScannedInitialVehicle(null);
          setIsNewWoModalOpen(true);
        }}
        onOpenQrScanner={() => setIsQrScannerOpen(true)}
      />

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialWorkOrder={aiTargetWorkOrder}
      />

      {/* New Work Order Modal */}
      <NewWorkOrderModal
        isOpen={isNewWoModalOpen}
        onClose={() => {
          setIsNewWoModalOpen(false);
          setScannedInitialVehicle(null);
        }}
        currentLocation={currentLocation}
        technicians={technicians}
        onCreateWorkOrder={handleCreateWorkOrder}
        onOpenQrScanner={() => setIsQrScannerOpen(true)}
        initialVehicle={scannedInitialVehicle}
      />

      {/* Mobile QR Scanner Modal */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        workOrders={workOrders}
        inventory={inventory}
        currentLocation={currentLocation}
        activeWorkOrder={workOrders.find(w => w.status === 'in_repair' || w.status === 'in_inspection')}
        onSelectWorkOrder={(wo) => {
          setCurrentView('work_orders');
        }}
        onSelectVehicle={(veh, matchedWo) => {
          if (matchedWo) {
            setCurrentView('work_orders');
          } else {
            setScannedInitialVehicle(veh);
            setIsNewWoModalOpen(true);
          }
        }}
        onSelectInventoryItem={(item) => {
          setCurrentView('inventory');
        }}
        onAddPartToWorkOrder={(wo, item) => {
          handleAddPartToWorkOrder(wo, item);
        }}
        onNavigateToHistory={(plate) => {
          setCurrentView('vehicle_history');
        }}
      />

      {/* Printable / Displayable QR Label Modal */}
      <QrLabelModal
        isOpen={Boolean(qrLabelEntity)}
        onClose={() => setQrLabelEntity(null)}
        entity={qrLabelEntity}
        currentLocation={currentLocation}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
