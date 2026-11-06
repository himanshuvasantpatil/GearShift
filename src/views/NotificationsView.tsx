import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  MessageSquare, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Settings,
  Smartphone
} from 'lucide-react';
import { NotificationTemplate, NotificationLog, Location } from '../types';

interface NotificationsViewProps {
  templates: NotificationTemplate[];
  logs: NotificationLog[];
  currentLocation: Location;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  templates,
  logs,
  currentLocation
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'logs'>('templates');
  const [testCustomerName, setTestCustomerName] = useState('Vikramaditya Singhania');
  const [aiDraftRes, setAiDraftRes] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAiNotification = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/notification-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: testCustomerName,
          vehicleInfo: '2023 Mahindra Scorpio-N (KA 03 MM 8899)',
          status: 'ready_pickup',
          tone: 'polite and warm',
          locationName: currentLocation.name
        })
      });
      const data = await response.json();
      setAiDraftRes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            Automated WhatsApp & Multi-Channel Customer Alerts
          </h2>
          <p className="text-xs text-slate-400">
            WhatsApp Business API automated dispatches for job cards, inspection photos, estimate approvals, and UPI payment links
          </p>
        </div>

        <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'templates' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
          >
            Message Templates
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'logs' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
          >
            Delivered Logs ({logs.length})
          </button>
        </div>
      </div>

      {activeTab === 'templates' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Templates List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
              Automated Event Triggers & WhatsApp Templates ({templates.length})
            </div>
            {templates.map((tmpl) => (
              <div key={tmpl.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{tmpl.templateName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {tmpl.channel}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">✓ Approved WhatsApp Template</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap">
                  {tmpl.content}
                </div>
              </div>
            ))}
          </div>

          {/* Right: AI Tone Personalizer */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                AI Customer Message Customizer
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={testCustomerName}
                    onChange={(e) => setTestCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleGenerateAiNotification}
                  disabled={isGenerating}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGenerating ? 'Drafting WhatsApp Message...' : 'Draft AI WhatsApp & SMS Message'}</span>
                </button>

                {aiDraftRes && (
                  <div className="p-3.5 bg-slate-950 border border-emerald-800/60 rounded-xl space-y-2 text-xs">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 block uppercase">WhatsApp Draft Preview</span>
                    <p className="text-slate-200 font-mono text-[11px] bg-slate-900 p-2.5 rounded whitespace-pre-wrap">{aiDraftRes.smsDraft}</p>

                    <span className="text-[10px] font-mono font-bold text-blue-400 block uppercase pt-2">Email Body Preview</span>
                    <p className="text-slate-300 font-mono text-[11px] bg-slate-900 p-2.5 rounded whitespace-pre-wrap">{aiDraftRes.emailDraftBody}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Sent Logs Table */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <th className="p-3">Job Card #</th>
                <th className="p-3">Customer & Phone</th>
                <th className="p-3">Channel</th>
                <th className="p-3">Message Snippet</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3 text-right">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-orange-400">{log.workOrderId}</td>
                  <td className="p-3">
                    <div className="font-semibold text-white">{log.customerName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{log.customerPhone}</div>
                  </td>
                  <td className="p-3 font-mono">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {log.channel}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300 max-w-sm truncate font-mono text-[11px]">{log.message}</td>
                  <td className="p-3 font-mono text-slate-400 text-[11px]">{log.sentAt}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-400 uppercase">{log.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
