import React from 'react';
import { ToastProvider } from './components/ui/Toast';
import { AlertConfirmProvider } from './components/ui/AlertConfirm';

type Props = { children: React.ReactNode };

export default function UiProviders({ children }: Props) {
    return (
        <AlertConfirmProvider>
            <ToastProvider>{children}</ToastProvider>
        </AlertConfirmProvider>
    );
}
