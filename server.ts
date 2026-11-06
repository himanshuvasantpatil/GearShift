import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK with server-side API key and User-Agent telemetry
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[Gemini AI] Warning: GEMINI_API_KEY is not defined in environment variables.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || 'DUMMY_KEY_FOR_FALLBACK',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. AI OBD-II Diagnostic & Repair Troubleshooter
app.post('/api/ai/diagnose', async (req, res) => {
  try {
    const { dtcCode, make, model, year, reportedSymptoms } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      // Fallback structured response if key missing
      return res.json({
        dtcCode: dtcCode || 'P0300',
        title: `Diagnostic Analysis for ${year || 2021} ${make || 'Vehicle'} ${model || 'Series'}`,
        severity: 'high',
        probableCauses: [
          'Faulty or worn ignition coil pack',
          'Fouled spark plug gap or carbon deposits',
          'Unmetered vacuum air leak or dirty MAF sensor'
        ],
        recommendedFixes: [
          'Perform cylinder balance test to isolate misfiring cylinder',
          'Replace ignition coil pack and inspect plug condition',
          'Clear DTC memory and re-test under road load'
        ],
        estimatedLaborHours: 1.5,
        recommendedParts: [
          { partName: 'Ignition Coil Pack', sku: 'IGN-COIL-BOSCH', oemPartNumber: '06H-905-115-9', estimatedCost: 69.90 },
          { partName: 'Iridium Spark Plug Set', sku: 'SPK-NGK-IRID', oemPartNumber: '12-12-0-037-607', estimatedCost: 45.00 }
        ]
      });
    }

    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Perform an expert automotive master technician diagnosis for DTC Code: ${dtcCode || 'N/A'}, Vehicle: ${year} ${make} ${model}, Symptoms: ${reportedSymptoms || 'General check engine light'}.`,
      config: {
        systemInstruction: `You are an expert master automotive diagnostic specialist. Provide precise, actionable repair recommendations, labor hour estimates, and part cross-references in strict JSON format.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dtcCode: { type: Type.STRING },
            title: { type: Type.STRING },
            severity: { type: Type.STRING, description: 'low, moderate, or high' },
            probableCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedFixes: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimatedLaborHours: { type: Type.NUMBER },
            recommendedParts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  partName: { type: Type.STRING },
                  sku: { type: Type.STRING },
                  oemPartNumber: { type: Type.STRING },
                  estimatedCost: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Diagnostic AI Error:', error);
    return res.status(500).json({
      error: 'Failed to generate AI diagnosis',
      details: error.message
    });
  }
});

// 2. AI Spare Part Cross-Reference Finder
app.post('/api/ai/parts-cross-ref', async (req, res) => {
  try {
    const { searchQuery, vehicleContext } = req.body;
    const ai = getGenAI();

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        query: searchQuery,
        oemMatch: 'OEM Part # 34-11-6-868-939',
        aftermarketAlternatives: [
          { brand: 'Brembo', partNumber: 'BRM-P85084N', priceEst: 189.99, tier: 'Premium Performance' },
          { brand: 'Bosch', partNumber: 'BOS-BP1829', priceEst: 115.00, tier: 'OEM Equivalent' },
          { brand: 'TRW', partNumber: 'TRW-GDB2145', priceEst: 88.50, tier: 'Value Wholesale' }
        ],
        fitmentNotes: 'Fits all G20 BMW 3-Series chassis (2019-2024) with 348mm front rotor option.'
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Search OEM and aftermarket cross-reference spare parts for query: "${searchQuery}" for vehicle: "${vehicleContext || 'General Automotive'}".`,
      config: {
        systemInstruction: `You are an automotive spare parts warehouse specialist. Provide accurate OEM vs aftermarket cross-reference part numbers, estimated pricing, and fitment notes in JSON format.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            query: { type: Type.STRING },
            oemMatch: { type: Type.STRING },
            aftermarketAlternatives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  brand: { type: Type.STRING },
                  partNumber: { type: Type.STRING },
                  priceEst: { type: Type.NUMBER },
                  tier: { type: Type.STRING }
                }
              }
            },
            fitmentNotes: { type: Type.STRING }
          }
        }
      }
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Parts AI Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 3. AI Automated Customer Notification Drafter
app.post('/api/ai/notification-draft', async (req, res) => {
  try {
    const { customerName, vehicleInfo, status, tone, locationName } = req.body;
    const ai = getGenAI();

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        smsDraft: `Hi ${customerName}, update from ${locationName}: your ${vehicleInfo} status is now "${status}". Track live: https://gearshift.app/portal/status`,
        emailDraftSubject: `Service Update: Your ${vehicleInfo} status is ${status}`,
        emailDraftBody: `Dear ${customerName},\n\nThis is an automated notification from ${locationName}.\n\nYour vehicle (${vehicleInfo}) current job status has been updated to: ${status}.\n\nIf you have any questions or would like to approve pending estimates, please visit your client portal.\n\nBest regards,\n${locationName} Customer Service`
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Draft a ${tone || 'polite and professional'} customer update message for ${customerName} regarding their ${vehicleInfo} at garage location "${locationName}". Status: "${status}".`,
      config: {
        systemInstruction: `You are an executive service manager at a high-end garage. Write concise, polite customer communications suitable for SMS and Email in JSON format.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            smsDraft: { type: Type.STRING },
            emailDraftSubject: { type: Type.STRING },
            emailDraftBody: { type: Type.STRING }
          }
        }
      }
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Notification AI Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Start Express + Vite Server
const PORT = Number(process.env.PORT) || 3000;

async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[GearShift Server] Running on http://0.0.0.0:${PORT}`);
  });
}

start();
