import React from 'react';
import { useApp } from '@/context/AppContext';

const toastStyles = {
  success: { border: 'border-green-500', bg: 'bg-green-500', icon: '✓' },
  error: { border: 'border-red-500', bg: 'bg-red-500', icon: '✕' },
  warning: { border: 'border-amber-500', bg: 'bg-amber-500', icon: '⚠' },
  info: { border: 'border-blue-500', bg: 'bg-blue-500', icon: 'ℹ' },
};

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div 
      className="fixed top-16 lg:top-5 right-2 sm:right-5 left-2 sm:left-auto z-50 flex flex-col gap-2 sm:gap-3 sm:max-w-md"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const style = toastStyles[toast.type];
        const isError = toast.type === 'error' || toast.type === 'warning';
        return (
          <div
            key={toast.id}
            role="alert"
            aria-live={isError ? 'assertive' : 'polite'}
            aria-atomic="true"
            className={`bg-white dark:bg-gray-800 border-2 ${style.border} rounded-lg p-3 sm:p-4 shadow-lg flex items-center gap-3 sm:min-w-[300px] animate-slide-in-right`}
          >
            <div
              className={`w-6 h-6 rounded-full ${style.bg} text-white flex items-center justify-center font-bold text-sm shrink-0`}
              aria-hidden="true"
            >
              {style.icon}
            </div>
            <div className="flex-1 text-sm text-gray-900 dark:text-gray-100">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg p-0 bg-transparent border-none cursor-pointer"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};
