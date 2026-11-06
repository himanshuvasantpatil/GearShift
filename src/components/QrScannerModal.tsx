import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  X, 
  Flashlight, 
  RotateCw, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Car, 
  Boxes, 
  Wrench, 
  FileText, 
  ChevronRight, 
  ExternalLink,
  Plus,
  RefreshCw,
  QrCode,
  Sparkles,
  Zap
} from 'lucide-react';
import jsQR from 'jsqr';
import { WorkOrder, InventoryItem, Location, VehicleSpec } from '../types';
import { identifyQrCode, QrDetectionResult } from '../utils/qrIdentifier';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrders: WorkOrder[];
  inventory: InventoryItem[];
  currentLocation: Location;
  activeWorkOrder?: WorkOrder | null;
  onSelectWorkOrder?: (wo: WorkOrder) => void;
  onSelectVehicle?: (vehicle: VehicleSpec, workOrder?: WorkOrder) => void;
  onSelectInventoryItem?: (item: InventoryItem) => void;
  onAddPartToWorkOrder?: (wo: WorkOrder, item: InventoryItem) => void;
  onNavigateToHistory?: (licensePlate: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  workOrders,
  inventory,
  currentLocation,
  activeWorkOrder,
  onSelectWorkOrder,
  onSelectVehicle,
  onSelectInventoryItem,
  onAddPartToWorkOrder,
  onNavigateToHistory
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [detectionResult, setDetectionResult] = useState<QrDetectionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'camera' | 'samples' | 'upload'>('camera');

  // Play audio confirmation tone
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch beep
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio autoplay policy fallback
    }

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 50, 40]);
      } catch {
        // Ignored if vibration not permitted
      }
    }
  };

  // Start Camera Stream
  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      stopCamera();
      return;
    }

    let isMounted = true;

    async function initCamera() {
      try {
        setCameraError(null);
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera access not supported on this device/browser.');
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });

        if (!isMounted) {
          mediaStream.getTracks().forEach(t => t.stop());
          return;
        }

        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();
          setIsScanning(true);
        }
      } catch (err: unknown) {
        const error = err as Error;
        console.warn('Camera stream could not be started:', error);
        setCameraError(
          error.name === 'NotAllowedError'
            ? 'Camera permission denied. You can use photo upload or sample labels below.'
            : 'Unable to start camera stream. Use photo upload or test labels below.'
        );
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [isOpen, facingMode, activeTab]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  // Toggle Torch / Flashlight
  const handleToggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (track) {
      try {
        const capabilities = track.getCapabilities ? (track.getCapabilities() as { torch?: boolean }) : {};
        if (capabilities && capabilities.torch) {
          const nextTorch = !isTorchOn;
          await track.applyConstraints({
            advanced: [{ torch: nextTorch } as MediaTrackConstraintSet]
          });
          setIsTorchOn(nextTorch);
        } else {
          alert('Flashlight / torch hardware is not supported on this camera.');
        }
      } catch {
        alert('Could not toggle camera torch.');
      }
    }
  };

  // Flip Camera Front / Back
  const handleFlipCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Continuous Video Scan Loop
  useEffect(() => {
    if (!isScanning || !stream || activeTab !== 'camera' || detectionResult) {
      return;
    }

    const scanFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (code && code.data) {
            handleCodeScanned(code.data);
            return; // Pause scanning on first match
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(scanFrame);
    };

    animationFrameId.current = requestAnimationFrame(scanFrame);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [isScanning, stream, activeTab, detectionResult]);

  // Handle successful scan
  const handleCodeScanned = (rawCode: string) => {
    playBeep();
    setIsScanning(false);
    const result = identifyQrCode(rawCode, workOrders, inventory);
    setDetectionResult(result);
  };

  // Handle Photo File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (code && code.data) {
            handleCodeScanned(code.data);
          } else {
            alert('No valid QR code or barcode found in this image. Please ensure the label is clearly visible and well-lit.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Reset Scanner
  const handleScanAgain = () => {
    setDetectionResult(null);
    setIsScanning(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold shadow-md">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Mobile QR & Label Scanner</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-950 text-orange-400 font-mono border border-orange-900/50">
                  {currentLocation.code}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Scan vehicle windshield FASTag, job card, or spare part bin label
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-slate-950 border-b border-slate-800/80 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('camera');
              handleScanAgain();
            }}
            className={`py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'camera' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('samples');
              handleScanAgain();
            }}
            className={`py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'samples' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Demo Labels</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('upload');
              handleScanAgain();
            }}
            className={`py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'upload' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
        </div>

        {/* Viewport Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {/* TAB 1: Live Camera Scanner */}
          {activeTab === 'camera' && !detectionResult && (
            <div className="space-y-3">
              {cameraError ? (
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="text-xs text-slate-300 max-w-sm mx-auto">
                    {cameraError}
                  </div>
                  <div className="pt-2 flex justify-center gap-2">
                    <button
                      onClick={() => setActiveTab('samples')}
                      className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg shadow-sm"
                    >
                      Use Demo Labels
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700"
                    >
                      Upload Label Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-square max-h-[380px] mx-auto border-2 border-slate-700 flex items-center justify-center shadow-inner">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* High-Tech Reticle Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                    <div className="relative w-56 h-56 sm:w-64 sm:h-64 border-2 border-dashed border-orange-500/60 rounded-2xl flex items-center justify-center">
                      {/* 4 Illuminated Corner Markers */}
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-orange-500 rounded-tl-lg" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-orange-500 rounded-tr-lg" />
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-orange-500 rounded-bl-lg" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-orange-500 rounded-br-lg" />

                      {/* Animated Laser Scanning Line */}
                      <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_12px_rgba(249,115,22,0.9)] animate-pulse" />

                      <div className="text-[11px] font-mono text-white/90 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800 shadow">
                        Align QR / Barcode
                      </div>
                    </div>
                  </div>

                  {/* Camera Controls Floating Bar */}
                  <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-3 pointer-events-auto">
                    <button
                      onClick={handleFlipCamera}
                      className="p-2.5 rounded-full bg-slate-900/90 text-white border border-slate-700 hover:bg-slate-800 shadow-md transition-colors"
                      title="Switch Camera (Front/Back)"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleToggleTorch}
                      className={`p-2.5 rounded-full border shadow-md transition-colors ${
                        isTorchOn ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-900/90 text-white border-slate-700 hover:bg-slate-800'
                      }`}
                      title="Toggle Torch / Flashlight"
                    >
                      <Flashlight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Quick Demo Scannable Labels (1-Tap Fast Testing) */}
          {activeTab === 'samples' && !detectionResult && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400">
                Tap any pre-encoded label below to simulate scanning adhesive windshield tags, bin labels, or parts cartons:
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider font-mono">
                  🚗 Vehicle Windshield & Gate Pass QR Tags
                </div>
                {[
                  {
                    code: 'GEARSHIFT:VEHICLE:KA03MM8899',
                    title: 'Mahindra Scorpio-N Z8L 4x4',
                    plate: 'KA 03 MM 8899',
                    vin: 'MA1TA2SK5N8A99120',
                    tag: 'Windshield RFID Tag'
                  },
                  {
                    code: 'GEARSHIFT:VEHICLE:KA01EV1024',
                    title: 'Tata Nexon EV Max (45kWh)',
                    plate: 'KA 01 EV 1024',
                    vin: 'MAT625445P3K88721',
                    tag: 'EV Gate Pass Tag'
                  },
                  {
                    code: 'GEARSHIFT:VEHICLE:MH02FF7700',
                    title: 'Hyundai Creta 1.5 Turbo DCT',
                    plate: 'MH 02 FF 7700',
                    vin: 'MALC151BLN8761234',
                    tag: 'Inspection Bay Tag'
                  }
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleCodeScanned(item.code)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/80 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center font-bold">
                        <Car className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                          {item.title}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {item.plate} · <span className="text-slate-500">{item.vin.slice(-6)}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-orange-300 font-mono border border-slate-800">
                      Scan Tag →
                    </span>
                  </button>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                  📦 Warehouse Spare Parts & Bin QR Labels
                </div>
                {[
                  {
                    code: 'GEARSHIFT:PART:BRK-CER-MNS8',
                    name: 'Brembo Ceramic Front Brake Pad Set',
                    sku: 'BRK-CER-MNS8',
                    bin: 'BLR-A-12-04',
                    hsn: '87083000'
                  },
                  {
                    code: 'GEARSHIFT:PART:OIL-MOT-300V',
                    name: 'Motul 300V 5W-40 Synthetic Racing Oil 4L',
                    sku: 'OIL-MOT-300V',
                    bin: 'BLR-C-02-01',
                    hsn: '27101980'
                  },
                  {
                    code: 'GEARSHIFT:PART:ROTR-VENT-ZIM',
                    name: 'Zimmermann Vented High-Carbon Disc Rotors',
                    sku: 'ROTR-VENT-ZIM',
                    bin: 'BLR-A-14-01',
                    hsn: '87083000'
                  }
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleCodeScanned(item.code)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/80 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                        <Boxes className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          SKU: {item.sku} · Bin: {item.bin}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-emerald-300 font-mono border border-slate-800">
                      Scan Bin →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Photo Upload Fallback */}
          {activeTab === 'upload' && !detectionResult && (
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-orange-600/20 text-orange-400 flex items-center justify-center mx-auto border border-orange-500/30">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Select Label Photo or Camera Snapshot</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Take a photo of the vehicle VIN plate, windshield FASTag barcode, or warehouse part box QR label.
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Choose Photo from Device
              </button>
            </div>
          )}

          {/* DETECTION RESULT SHEET */}
          {detectionResult && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {/* Type: VEHICLE DETECTED */}
              {detectionResult.type === 'vehicle' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-orange-500/70 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                        <Car className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white">
                        Vehicle Identified
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                      ✓ Label Verified
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-base font-extrabold text-white">
                      {detectionResult.vehicle.year} {detectionResult.vehicle.make} {detectionResult.vehicle.model}
                    </div>
                    <div className="text-xs font-mono text-orange-400 font-bold">
                      {detectionResult.vehicle.variant}
                    </div>
                  </div>

                  {/* Vehicle Spec Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">License Plate</span>
                      <span className="text-white font-bold">{detectionResult.vehicle.licensePlate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Chassis / VIN</span>
                      <span className="text-slate-300 font-bold truncate block">{detectionResult.vehicle.vin}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Powertrain</span>
                      <span className="text-slate-300">{detectionResult.vehicle.fuelType} · {detectionResult.vehicle.transmission}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Insurance Policy</span>
                      <span className="text-slate-300 truncate block">{detectionResult.vehicle.insuranceCompany || 'Standard Policy'}</span>
                    </div>
                  </div>

                  {/* Active Job Card status if matched */}
                  {detectionResult.workOrder && (
                    <div className="p-2.5 rounded-lg bg-orange-950/40 border border-orange-900/50 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Active Workshop Job</span>
                        <span className="text-orange-300 font-bold">{detectionResult.workOrder.orderNumber}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-950 text-blue-300 border border-blue-800">
                        {detectionResult.workOrder.status.replace('_', ' ')}
                      </span>
                    </div>
                  )}

                  {/* Contextual Action Buttons */}
                  <div className="pt-2 space-y-2">
                    {detectionResult.workOrder && onSelectWorkOrder && (
                      <button
                        onClick={() => {
                          onSelectWorkOrder(detectionResult.workOrder!);
                          onClose();
                        }}
                        className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
                      >
                        <Wrench className="w-4 h-4" />
                        <span>Open Bay Job Card ({detectionResult.workOrder.orderNumber})</span>
                      </button>
                    )}

                    {onSelectVehicle && (
                      <button
                        onClick={() => {
                          onSelectVehicle(detectionResult.vehicle, detectionResult.workOrder);
                          onClose();
                        }}
                        className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                      >
                        <Car className="w-4 h-4 text-orange-400" />
                        <span>Use Vehicle in Check-In / Inspection</span>
                      </button>
                    )}

                    {onNavigateToHistory && (
                      <button
                        onClick={() => {
                          onNavigateToHistory(detectionResult.vehicle.licensePlate);
                          onClose();
                        }}
                        className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 text-blue-400 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-800 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span>View Vehicle Service Passport History</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Type: INVENTORY ITEM DETECTED */}
              {detectionResult.type === 'inventory' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/70 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                        <Boxes className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white">
                        Spare Part Identified
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                      ✓ SKU Matched
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-base font-extrabold text-white">
                      {detectionResult.item.partName}
                    </div>
                    <div className="text-xs font-mono text-emerald-400 font-bold">
                      {detectionResult.item.brand} · SKU: {detectionResult.item.sku}
                    </div>
                  </div>

                  {/* Part Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Depot Stock ({currentLocation.code})</span>
                      <span className="text-emerald-400 font-bold text-sm">
                        {detectionResult.item.locationStock[currentLocation.id]?.quantity || 0} {detectionResult.item.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Warehouse Rack Bin</span>
                      <span className="text-white font-bold">
                        {detectionResult.item.locationStock[currentLocation.id]?.rackLocation || 'A-01'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Retail Price (MRP)</span>
                      <span className="text-slate-200 font-bold">
                        {currentLocation.currency} {detectionResult.item.retailPrice.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">HSN Code & GST</span>
                      <span className="text-slate-400">{detectionResult.item.hsnCode} ({detectionResult.item.gstRate}%)</span>
                    </div>
                  </div>

                  {/* Contextual Action Buttons */}
                  <div className="pt-2 space-y-2">
                    {/* Add to Active Work Order if in context */}
                    {activeWorkOrder && onAddPartToWorkOrder && (
                      <button
                        onClick={() => {
                          onAddPartToWorkOrder(activeWorkOrder, detectionResult.item);
                          onClose();
                        }}
                        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Issue to Active Job ({activeWorkOrder.orderNumber})</span>
                      </button>
                    )}

                    {onSelectInventoryItem && (
                      <button
                        onClick={() => {
                          onSelectInventoryItem(detectionResult.item);
                          onClose();
                        }}
                        className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                      >
                        <Boxes className="w-4 h-4 text-emerald-400" />
                        <span>View Full Depot Inventory & Restock</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Type: WORK ORDER DETECTED */}
              {detectionResult.type === 'work_order' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-orange-500/70 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white">
                        Job Card Identified
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-orange-400 font-bold bg-orange-950 px-2 py-0.5 rounded border border-orange-900">
                      #{detectionResult.workOrder.orderNumber}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white">
                    {detectionResult.vehicle.year} {detectionResult.vehicle.make} {detectionResult.vehicle.model}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Plate: {detectionResult.vehicle.licensePlate} · Customer: {detectionResult.workOrder.customerName}
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectWorkOrder) onSelectWorkOrder(detectionResult.workOrder);
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Open Work Order Details</span>
                  </button>
                </div>
              )}

              {/* Type: UNKNOWN CODE */}
              {detectionResult.type === 'unknown' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-800/80 space-y-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-amber-950 text-amber-400 flex items-center justify-center mx-auto border border-amber-800">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-white">Unrecognized Code Payload</div>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    {detectionResult.message}
                  </p>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 break-all">
                    Raw Data: {detectionResult.rawCode}
                  </div>
                </div>
              )}

              {/* Scan Another Button */}
              <button
                onClick={handleScanAgain}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Scan Another Label / Tag</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Scanner Engine: jsQR + HTML5 Camera</span>
          <span className="text-emerald-400">Low-Latency Mobile Mode</span>
        </div>
      </div>
    </div>
  );
};
