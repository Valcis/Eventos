import type { ColumnDef } from '@tanstack/react-table';
import type { Precio } from '../../types';

export function preciosColumns(): ColumnDef<Precio, any>[] {
  return [
    {
      accessorKey: 'concepto',
      header: 'Concepto',
      enableSorting: true,
      enableColumnFilter: true,
      cell: info => String(info.getValue<string>()),
    },
    {
      accessorKey: 'importe',
      header: 'Importe',
      enableSorting: true,
      enableColumnFilter: true,
      cell: info => {
        const v = info.getValue<number>();
        return typeof v === 'number' ? v.toFixed(2) : '';
      },
    },
  ];
}
