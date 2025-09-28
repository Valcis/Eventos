import React, { createContext, useCallback, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ToastItem, ToastOptions } from './Toast';

interface ToastContextValue {
  toast: (opts: ToastOptions) => string;
  dismiss: (id: string) => void;
  clearAll: () => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

type ToastRecord = ToastItem & { id: string };

interface Props {
  children: React.ReactNode;
}

/** Proveedor global de Toasts (portal + cola). */
export const ToastProvider: React.FC<Props> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const idSeqRef = useRef<number>(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => setToasts([]), []);

  const toast = useCallback((opts: ToastOptions) => {
    idSeqRef.current += 1;
    const id = String(idSeqRef.current);
    const base = {
      id,
      title: opts.title,
      variant: opts.variant ?? 'info',
      isClosable: opts.isClosable ?? true,
      // si quieres mantenerla opcional, NO pongas 4000 aquí, o hazlo siempre número:
      durationMs: typeof opts.durationMs === 'number' ? opts.durationMs : 4000,
    } as const;
    const item: ToastRecord =
      opts.description !== undefined ? { ...base, description: opts.description } : base;
    setToasts((prev) => [...prev, item]);
    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss, clearAll }), [toast, dismiss, clearAll]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          aria-atomic="true"
          className="fixed bottom-4 right-4 z-[9999] flex w-full max-w-sm flex-col gap-2 p-2"
        >
          {toasts.map((t) => (
            <ToastItemView key={t.id} item={t} onClose={() => dismiss(t.id)} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
};

interface ToastItemViewProps {
  item: ToastRecord;
  onClose: () => void;
}

const srLabels: Record<ToastItem['variant'], string> = {
  info: 'Información',
  success: 'Éxito',
  warning: 'Advertencia',
  error: 'Error',
};

const variantStyles: Record<ToastItem['variant'], string> = {
  info: 'bg-blue-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-amber-600 text-white',
  error: 'bg-red-600 text-white',
};

const ToastItemView: React.FC<ToastItemViewProps> = ({ item, onClose }) => {
  const { title, description, variant, durationMs, isClosable } = item;
  const timerRef = React.useRef<number | null>(null);
  const [isHover, setIsHover] = useState<boolean>(false);

  React.useEffect(() => {
    if (durationMs && durationMs > 0) {
      const tid = window.setTimeout(onClose, durationMs);
      timerRef.current = tid;
      return () => window.clearTimeout(tid);
    }
    return;
  }, [durationMs, onClose]);

  React.useEffect(() => {
    if (!durationMs || durationMs <= 0) return;
    if (isHover && timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    } else if (!isHover && !timerRef.current) {
      timerRef.current = window.setTimeout(onClose, durationMs);
    }
  }, [isHover, durationMs, onClose]);

  return (
    <div
      role="status"
      aria-label={srLabels[variant]}
      className={`rounded-2xl shadow-lg ring-1 ring-black/10 ${variantStyles[variant]} pointer-events-auto`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold">{title}</p>
            {description ? <p className="mt-1 text-sm opacity-90">{description}</p> : null}
          </div>
          {isClosable ? (
            <button
              aria-label="Cerrar notificación"
              className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              onClick={onClose}
            >
              ×
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
