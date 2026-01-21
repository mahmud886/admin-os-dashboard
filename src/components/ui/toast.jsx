'use client';

import * as React from 'react';
import { X, CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ToastContext = React.createContext(undefined);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = React.useCallback(
    (toast) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = {
        id,
        ...toast,
        duration: toast.duration || 3000,
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto remove after duration
      if (newToast.duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, newToast.duration);
      }

      return id;
    },
    [removeToast]
  );

  const value = React.useMemo(
    () => ({
      addToast,
      removeToast,
    }),
    [addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-md w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function Toast({ toast, onClose }) {
  const [isExiting, setIsExiting] = React.useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const variants = {
    success: {
      bg: 'bg-green-950/90 border-green-500/50',
      text: 'text-green-400',
      icon: CheckCircle2,
    },
    error: {
      bg: 'bg-red-950/90 border-red-500/50',
      text: 'text-red-400',
      icon: XCircle,
    },
    warning: {
      bg: 'bg-orange-950/90 border-orange-500/50',
      text: 'text-orange-400',
      icon: AlertCircle,
    },
    info: {
      bg: 'bg-blue-950/90 border-blue-500/50',
      text: 'text-blue-400',
      icon: Info,
    },
  };

  const variant = variants[toast.variant || 'info'];
  const Icon = variant.icon;

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm transition-all duration-200',
        variant.bg,
        isExiting ? 'animate-out fade-out slide-out-to-right' : 'animate-in slide-in-from-right'
      )}
    >
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', variant.text)} />
      <div className="flex-1 space-y-1">
        {toast.title && <div className={cn('text-sm font-semibold', variant.text)}>{toast.title}</div>}
        {toast.description && <div className="text-sm text-gray-300">{toast.description}</div>}
      </div>
      <button
        onClick={handleClose}
        className={cn(
          'rounded-md p-1 text-gray-400 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-teal-400',
          variant.text
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
