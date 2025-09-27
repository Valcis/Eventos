import React from 'react';

export interface PaginationProps {
    page: number; // 1-based
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    isCompact?: boolean;
}

const PAGE_SIZES = [5, 10, 20, 50];

export function Pagination({
                               page,
                               pageSize,
                               total,
                               onPageChange,
                               onPageSizeChange,
                               isCompact = false
                           }: PaginationProps) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const btnCls = 'px-3 py-2 rounded-xl border border-zinc-300 disabled:opacity-50';


    return (
        <div className={`flex items-center justify-between gap-3 ${isCompact ? '' : 'mt-3'}`}>
            <div className="text-sm text-zinc-600 ">
                Página <strong>{page}</strong> de <strong>{totalPages}</strong>
            </div>
            <div className="flex items-center gap-2">
                <button className={btnCls}
                        onClick={() => onPageChange(1)}
                        disabled={page <= 1}>
                    «
                </button>
                <button className={btnCls}
                        onClick={() => onPageChange(Math.max(1, page - 1))}
                        disabled={page <= 1}>
                    Anterior
                </button>
                <button className={btnCls}
                        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                        disabled={page >= totalPages}>
                    Siguiente
                </button>
                <button className={btnCls}
                        onClick={() => onPageChange(totalPages)}
                        disabled={page >= totalPages}>
                    »
                </button>
            </div>
            <div className="flex items-center gap-2">
                <label className="text-sm">Filas por página</label>
                <select
                    className="px-2 py-2 rounded-xl border border-zinc-300"
                    value={pageSize}
                    onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                >
                    {PAGE_SIZES.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default Pagination;