import React, { useEffect, useRef } from 'react';

export interface AlertConfirmProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Diálogo accesible de confirmación con foco gestionado y cierre por teclado. */
export const AlertConfirmModal: React.FC<AlertConfirmProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      const prev = document.activeElement as HTMLElement | null;
      cancelRef.current?.focus();
      return () => prev?.focus?.();
    }
    return;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-title"
      aria-describedby={description ? 'alert-desc' : undefined}
      className="fixed inset-0 z-[9998] flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} aria-hidden="true" />
      <div className="relative z-[9999] w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/10">
        <h2 id="alert-title" className="text-lg font-semibold text-gray-900">
          {title}
        </h2>
        {description ? (
          <p id="alert-desc" className="mt-2 text-sm text-gray-600">
            {description}
          </p>
        ) : null}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-300'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
