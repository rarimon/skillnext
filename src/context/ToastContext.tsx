import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = useCallback((msg: string) => toast(msg, 'success'), [toast]);
  const error = useCallback((msg: string) => toast(msg, 'error'), [toast]);
  const info = useCallback((msg: string) => toast(msg, 'info'), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <div className="fixed bottom-20 sm:bottom-5 right-4 sm:right-5 z-50 flex flex-col gap-2 max-w-md w-[calc(100vw-2rem)] sm:w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border text-sm font-medium ${
                t.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800'
                  : t.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-900 dark:text-rose-100 border-rose-200 dark:border-rose-800'
                  : 'bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />}
                {t.type === 'info' && <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                <span>{t.message}</span>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors ml-2"
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
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
