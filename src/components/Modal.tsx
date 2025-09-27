import * as React from "react";
import {useEffect, useRef} from "react";
import {X} from "lucide-react";

type ModalProps = {
    title: string;
    isOpen: boolean;             // ✅ convención isX
    onClose: () => void;
    children?: React.ReactNode;
    isCloseOnEsc?: boolean;      // por defecto true
    isCloseOnBackdrop?: boolean; // por defecto true
};

export default function Modal({
                                  title,
                                  isOpen,
                                  onClose,
                                  children,
                                  isCloseOnEsc = true,
                                  isCloseOnBackdrop = true,
                              }: ModalProps): JSX.Element | null {
    const dialogRef = useRef<HTMLDivElement | null>(null);

    // Cerrar con Escape
    useEffect(() => {
        if (!isOpen || !isCloseOnEsc) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                onClose();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen, isCloseOnEsc, onClose]);

    // Bloquear scroll del body
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    // Enfocar contenedor al abrir
    useEffect(() => {
        if (isOpen) {
            const id = requestAnimationFrame(() => dialogRef.current?.focus());
            return () => cancelAnimationFrame(id);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop: cierra al clicar fuera */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => {
                    if (isCloseOnBackdrop) onClose();
                }}
            />

            {/* Contenido del modal */}
            <div
                ref={dialogRef}
                tabIndex={-1}
                className="relative z-10 w-[min(92vw,720px)] max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 outline-none transition-transform duration-150 ease-out"
                onMouseDown={(e) => e.stopPropagation()} // evita cierre al clicar dentro
            >
                {/* Header separado + botón X */}
                <div
                    className="sticky top-0 z-10 flex items-center justify-between gap-3 rounded-t-2xl border-b bg-white/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                    <h2 id="modal-title" className="text-base md:text-lg font-semibold">{title}</h2>
                    <button
                        type="button"
                        aria-label="Cerrar"
                        title="Cerrar"
                        onClick={onClose}
                        className="rounded-xl border p-1.5 transition-transform hover:scale-105 focus:outline-none focus:ring"
                    >
                        <X size={16}/>
                    </button>
                </div>

                {/* Body */}
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
