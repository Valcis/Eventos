import React from 'react';
import type { Table } from '@tanstack/react-table';

interface Props<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
}

export default function Pagination<TData>({ table, pageSizeOptions = [5, 10, 20, 50] }: Props<TData>) {
  const pageIndex = table.getState().pagination?.pageIndex ?? 0;
  const pageCount = table.getPageCount();

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <button className="btn btn-sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
          « Primero
        </button>
        <button className="btn btn-sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          ‹ Anterior
        </button>
        <button className="btn btn-sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Siguiente ›
        </button>
        <button className="btn btn-sm" onClick={() => table.setPageIndex(pageCount - 1)} disabled={!table.getCanNextPage()}>
          Último »
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span>
          Página <strong>{pageIndex + 1}</strong> de <strong>{pageCount}</strong>
        </span>
        <label className="flex items-center gap-1">
          Tamaño
          <select
            className="input"
            value={table.getState().pagination?.pageSize ?? 10}
            onChange={e => table.setPageSize(Number(e.target.value))}
          >
            {pageSizeOptions.map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
