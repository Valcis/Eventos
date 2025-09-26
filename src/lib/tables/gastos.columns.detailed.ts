import type { ColumnDef } from '@tanstack/react-table';
import type { Gasto } from '../../types';
import { formatCurrency, formatNumber2, formatNumber4 } from '../format';

export function gastosColumnsDetailed(): ColumnDef<Gasto, unknown>[] {
  return [
    { id: 'producto', accessorKey: 'producto', header: 'Producto' },
    { id: 'unidad', accessorKey: 'unidad', header: 'Unidad' },
    { id: 'cantidad', accessorKey: 'cantidad', header: 'Cantidad' },
    { id: 'tipoPrecio', accessorKey: 'tipoPrecio', header: 'Tipo de precio' },
    { id: 'tipoIVA', accessorKey: 'tipoIVA', header: 'Tipo IVA (%)' },
    { id: 'base', accessorKey: 'base', header: 'Base sin IVA', cell: ({ row }) => {
      const v = row.original.base as number | undefined;
      return v !== undefined ? formatNumber2(v) : '';
    } },
    { id: 'iva', accessorKey: 'iva', header: 'IVA (€)', cell: ({ row }) => {
      const v = row.original.iva as number | undefined;
      return v !== undefined ? formatNumber2(v) : '';
    } },
    { id: 'total', accessorKey: 'total', header: 'Total con IVA', cell: ({ row }) => {
      const v = row.original.total as number | undefined;
      return v !== undefined ? formatCurrency(v) : '';
    } },
    { id: 'isPack', accessorKey: 'isPack', header: '¿Pack?', cell: ({ row }) => (row.original.isPack ? 'Sí' : 'No') },
    { id: 'unidadesPack', accessorKey: 'unidadesPack', header: 'Unidades en pack', cell: info => info.getValue<number | undefined>() ?? '' },
    { id: 'precioUnidad', accessorKey: 'precioUnidad', header: 'Precio por unidad', cell: info => {
      const v = info.getValue<number | undefined>();
      return v !== undefined ? formatNumber4(v) : '';
    } },
    { id: 'pagador', accessorKey: 'pagador', header: 'Pagador' },
    { id: 'tienda', accessorKey: 'tienda', header: 'Tienda' },
    { id: 'notas', accessorKey: 'notas', header: 'Notas' },
    { id: 'comprobado', accessorKey: 'comprobado', header: 'Comprobado', cell: ({ row }) => (row.original.comprobado ? 'Sí' : 'No') },
  ];
}
