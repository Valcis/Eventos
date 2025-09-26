import type { ColumnDef } from '@tanstack/react-table';
import type { Gasto } from '../../types';

export function gastosColumnsSimple(): ColumnDef<Gasto, any>[] {
  return [
    { id: 'producto', accessorKey: 'producto', header: 'Producto' },
    { id: 'unidad', accessorKey: 'unidad', header: 'Unidad' },
    { id: 'cantidad', accessorKey: 'cantidad', header: 'Cantidad' },
    { id: 'total', accessorKey: 'total', header: 'Total con IVA', cell: ({ row }) => {
      const v = row.original.total as number | undefined;
      return v !== undefined ? v.toFixed(2) : '';
    } },
    { id: 'isPack', accessorKey: 'isPack', header: '¿Pack?', cell: ({ row }) => (row.original.isPack ? 'Sí' : 'No') },
    { id: 'unidadesPack', accessorKey: 'unidadesPack', header: 'Unidades en pack', cell: info => info.getValue<number | undefined>() ?? '' },
    { id: 'precioUnidad', accessorKey: 'precioUnidad', header: 'Precio por unidad', cell: info => {
      const v = info.getValue<number | undefined>();
      return v !== undefined ? v.toFixed(4) : '';
    } },
    { id: 'pagador', accessorKey: 'pagador', header: 'Pagador' },
    { id: 'tienda', accessorKey: 'tienda', header: 'Tienda' },
    { id: 'notas', accessorKey: 'notas', header: 'Notas' },
    { id: 'comprobado', accessorKey: 'comprobado', header: 'Comprobado', cell: ({ row }) => (row.original.comprobado ? 'Sí' : 'No') },
  ];
}
