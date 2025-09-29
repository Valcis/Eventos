import React from 'react';

export interface PaginationProps {
    page: number;           // 1-based
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    isCompact?: boolean;
    className?: string;     // permite ocultar con 'hidden'
}

const PAGE_SIZES = [5, 10, 20, 50];

export default function Pagination({
                                       page,
                                       pageSize,
                                       total,
                                       onPageChange,
                                       onPageSizeChange,
                                       isCompact = false,
                                       className
                                   }: PaginationProps) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const btnCls = 'px-3 py-2 rounded-xl border border-zinc-300 disabled:opacity-50';

    return (
        <div className={`flex items-center justify-between gap-3 p-3 ${className ?? ''}`}>
            <div className="text-sm text-zinc-600">
                Página {page} de {totalPages}
            </div>

            <div className={`flex items-center gap-2 ${isCompact ? 'text-sm' : ''}`}>
                <button className={btnCls} onClick={() => onPageChange(1)} disabled={page <= 1} aria-label="Primera">«
                </button>
                <button className={btnCls} onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}
                        aria-label="Anterior">Anterior
                </button>
                <button className={btnCls} onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                        disabled={page >= totalPages} aria-label="Siguiente">Siguiente
                </button>
                <button className={btnCls} onClick={() => onPageChange(totalPages)} disabled={page >= totalPages}
                        aria-label="Última">»
                </button>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm">Filas por página</span>
                <select
                    className="px-2 py-1 rounded-xl border border-zinc-300"
                    value={pageSize}
                    onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                    aria-label="Filas por página"
                >
                    {PAGE_SIZES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
