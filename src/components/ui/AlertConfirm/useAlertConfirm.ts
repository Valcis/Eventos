import { useContext } from 'react';
import { AlertConfirmContext } from './AlertConfirmProvider';

/** Hook para abrir un diálogo de confirmación y esperar la respuesta del usuario. */
export function useAlertConfirm() {
  const ctx = useContext(AlertConfirmContext);
  if (!ctx) throw new Error('useAlertConfirm must be used within <AlertConfirmProvider>');
  return ctx as {
    confirm: (
      opts: Omit<Parameters<NonNullable<typeof ctx>['confirm']>[0], never>,
    ) => Promise<boolean>;
  };
}
