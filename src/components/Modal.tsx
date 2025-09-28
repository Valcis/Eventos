import React, {ReactNode, useEffect} from 'react';
import {createPortal} from 'react-dom';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    isCloseOnEsc?: boolean;
    isCloseOnBackdrop?: boolean;
}

export default function Modal({
                                  isOpen,
                                  onClose,
                                  title,
                                  children,
                                  isCloseOnEsc = true,
                                  isCloseOnBackdrop = true,
                              }: ModalProps): JSX.Element | null {
    useEffect(() => {
        if (!isOpen || !isCloseOnEsc) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, isCloseOnEsc, onClose]);

    if (!isOpen) return null;

    const content = (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={isCloseOnBackdrop ? onClose : undefined}
                aria-label="Cerrar"
            />
            <div role="document" className="relative z-10 w-[92vw] max-w-lg rounded-2xl bg-white p-4 shadow-xl">
                {title && <h2 className="mb-2 text-lg font-semibold">{title}</h2>}
                <button
                    type="button"
                    aria-label="Cerrar"
                    className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-800"
                    onClick={onClose}
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );

    return createPortal(content, document.body);
}
