import React from 'react';
import type { Table } from '@tanstack/react-table';

// Backward-compatible Toolbar: trimmed down to avoid global search input.
// In TanStack mode it renders only per-column filters. In controlled mode
// it renders only the provided rightContent.
interface PropsTanstack<TData> {
  table: Table<TData>;
}

interface PropsControlled {
  rightContent?: React.ReactNode; // custom filters area aligned to the right
}

type Props<TData> = PropsTanstack<TData> | PropsControlled;

export default function Toolbar<TData>(props: Props<TData>) {
  // TanStack mode (existing usage stays intact for column filters only)
  if ('table' in props) {
    const { table } = props as PropsTanstack<TData>;
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {/* Filtros por columna: si alguna columna tiene getCanFilter, renderizar input/select */}
        <div className="flex items-center gap-2 flex-wrap w-full">
          {table.getHeaderGroups().map((hg) =>
            hg.headers.map((h) => {
              const column = h.column;
              if (!column.getCanFilter()) return null;
              const id = column.id;
              const value = column.getFilterValue();
              // Render simple input de texto por defecto
              return (
                <label key={id} className="flex items-center gap-1 text-sm">
                  {typeof h.column.columnDef.header === 'string' ? h.column.columnDef.header : id}
                  <input
                    className="input h-8"
                    value={(value as string) ?? ''}
                    onChange={(e) => column.setFilterValue(e.target.value)}
                  />
                </label>
              );
            }),
          )}
        </div>
      </div>
    );
  }

  // Controlled mode (no TanStack table provided): render only rightContent
  const { rightContent } = props as PropsControlled;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap w-full">{rightContent ?? null}</div>
    </div>
  );
}
