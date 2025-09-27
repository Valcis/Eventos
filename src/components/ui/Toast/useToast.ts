import {useContext} from 'react';
import {ToastContext} from './ToastProvider';
import type {ToastOptions} from './Toast';

/** Hook para disparar toasts globales / limpiar cola. */
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
    return ctx as {
        toast: (opts: ToastOptions) => string;
        dismiss: (id: string) => void;
        clearAll: () => void;
    };
}
