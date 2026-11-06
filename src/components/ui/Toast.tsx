import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info' | 'ai';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  triggerConfetti: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(({ type = 'info', title, message, duration = 4000 }: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#f97316', '#10b981', '#6366f1', '#f59e0b']
      });
    } catch {
      // Fallback if canvas is unavailable
    }
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, triggerConfetti }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`pointer-events-auto p-3.5 rounded-xl shadow-2xl border flex items-start gap-3 backdrop-blur-xl ${
                toast.type === 'success'
                  ? 'bg-slate-900/95 border-emerald-500/50 text-emerald-100 shadow-emerald-950/40'
                  : toast.type === 'error'
                  ? 'bg-slate-900/95 border-red-500/50 text-red-100 shadow-red-950/40'
                  : toast.type === 'ai'
                  ? 'bg-gradient-to-r from-purple-950/90 to-indigo-950/90 border-purple-500/60 text-purple-100 shadow-purple-950/40'
                  : 'bg-slate-900/95 border-slate-700 text-slate-100 shadow-slate-950/50'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                {toast.type === 'ai' && <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-orange-400" />}
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="text-xs font-bold leading-tight">{toast.title}</div>
                {toast.message && (
                  <div className="text-[11px] text-slate-300 leading-snug">{toast.message}</div>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white shrink-0 p-0.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
