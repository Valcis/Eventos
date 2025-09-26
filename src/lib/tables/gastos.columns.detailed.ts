import type { ColumnDef } from '@tanstack/react-table';
import type { Gasto } from '../../types';

export function gastosColumnsDetailed(): ColumnDef<Gasto, any>[] {
  return [
    { id: 'producto', accessorKey: 'producto', header: 'Producto' },
    { id: 'unidad', accessorKey: 'unidad', header: 'Unidad' },
    { id: 'cantidad', accessorKey: 'cantidad', header: 'Cantidad' },
    { id: 'tipoPrecio', accessorKey: 'tipoPrecio', header: 'Tipo de precio' },
    { id: 'tipoIVA', accessorKey: 'tipoIVA', header: 'Tipo IVA (%)' },
    { id: 'base', accessorKey: 'base', header: 'Base sin IVA', cell: ({ row }) => {
      const v = row.original.base as number | undefined;
      return v !== undefined ? v.toFixed(2) : '';
    } },
    { id: 'iva', accessorKey: 'iva', header: 'IVA (€)', cell: ({ row }) => {
      const v = row.original.iva as number | undefined;
      return v !== undefined ? v.toFixed(2) : '';
    } },
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
