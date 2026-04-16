import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

export default function Toast() {
  const { toast, dismissToast } = useApp();

  if (!toast) return null;

  const configs = {
    success: {
      icon: <CheckCircle size={18} className="text-green-600 flex-shrink-0" />,
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
    },
    error: {
      icon: <XCircle size={18} className="text-red-600 flex-shrink-0" />,
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
    },
    info: {
      icon: <Info size={18} className="text-blue-600 flex-shrink-0" />,
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
    },
  };

  const config = configs[toast.type];

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm ${config.bg}`}>
        {config.icon}
        <p className={`text-sm font-medium flex-1 ${config.text}`}>{toast.message}</p>
        <button
          onClick={dismissToast}
          className="text-gray-400 hover:text-gray-600 ml-1 flex-shrink-0"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
