import React, { createContext, useCallback, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertConfirmModal, type AlertConfirmProps } from './AlertConfirm';

type ConfirmInput = Omit<AlertConfirmProps, 'isOpen' | 'onConfirm' | 'onCancel'>;

interface AlertConfirmContextValue {
  confirm: (opts: ConfirmInput) => Promise<boolean>;
}

export const AlertConfirmContext = createContext<AlertConfirmContextValue | null>(null);

interface Props {
  children: React.ReactNode;
}

/** Provider para abrir confirmaciones de forma programática con `await`. */
export const AlertConfirmProvider: React.FC<Props> = ({ children }) => {
  const [modal, setModal] = useState<ConfirmInput | null>(null);
  const resolverRef = useRef<(value: boolean) => void>();

  const confirm = useCallback((opts: ConfirmInput) => {
    setModal(opts);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleClose = useCallback((ok: boolean) => {
    resolverRef.current?.(ok);
    resolverRef.current = undefined;
    setModal(null);
  }, []);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <AlertConfirmContext.Provider value={value}>
      {children}
      {createPortal(
        <AlertConfirmModal
          isOpen={!!modal}
          title={modal?.title ?? ''}
          {...(modal?.description !== undefined ? { description: modal.description } : {})}
          confirmText={modal?.confirmText ?? 'Confirmar'}
          cancelText={modal?.cancelText ?? 'Cancelar'}
          isDestructive={modal?.isDestructive ?? false}
          onConfirm={() => handleClose(true)}
          onCancel={() => handleClose(false)}
        />,
        document.body,
      )}
    </AlertConfirmContext.Provider>
  );
};
