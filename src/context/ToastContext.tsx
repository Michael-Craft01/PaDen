import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { clsx } from 'clsx';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { id, message, type };
        setToasts(prev => [...prev, newToast]);
        setTimeout(() => removeToast(id), 4000);
    }, [removeToast]);

    const success = (message: string) => showToast(message, 'success');
    const error = (message: string) => showToast(message, 'error');
    const info = (message: string) => showToast(message, 'info');

    return (
        <ToastContext.Provider value={{ showToast, success, error, info }}>
            {children}
            <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={clsx(
                            "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border backdrop-blur-md transition-all animate-[slide-in-right_0.3s_ease-out]",
                            toast.type === 'success' && "bg-green-900/80 border-green-500/30 text-green-100 shadow-green-900/20",
                            toast.type === 'error' && "bg-red-900/80 border-red-500/30 text-red-100 shadow-red-900/20",
                            toast.type === 'info' && "bg-zinc-800/80 border-zinc-600/30 text-zinc-100 shadow-zinc-900/20"
                        )}
                    >
                        <div className="flex-shrink-0">
                            {toast.type === 'success' && <CheckCircle size={20} className="text-green-400" />}
                            {toast.type === 'error' && <AlertCircle size={20} className="text-red-400" />}
                            {toast.type === 'info' && <Info size={20} className="text-purple-400" />}
                        </div>

                        <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                        >
                            <X size={16} className="opacity-70 group-hover:opacity-100" />
                        </button>
                    </div>
                ))}
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
