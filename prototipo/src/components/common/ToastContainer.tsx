import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let border = 'border-slate-700';
        let bg = 'bg-[#111726]';
        let text = 'text-blue-400';
        let Icon = Info;

        if (toast.type === 'success') {
          border = 'border-blue-900/80';
          text = 'text-blue-400';
          Icon = CheckCircle2;
        } else if (toast.type === 'warning') {
          border = 'border-amber-900/80';
          text = 'text-amber-400';
          Icon = AlertTriangle;
        } else if (toast.type === 'error') {
          border = 'border-red-900/80';
          text = 'text-red-400';
          Icon = AlertCircle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3 rounded-md border shadow-lg ${bg} ${border} transition-all duration-200`}
          >
            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${text}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-semibold text-white truncate">{toast.title}</h4>
                <span className="text-[10px] text-slate-400 font-mono">{toast.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
