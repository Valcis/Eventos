import type { ColumnDef } from '../../components/ui/DataTable/types';

export interface PrecioItem {
  id: string;
  nombre: string;
  categoria: string;
  importe: number;
  moneda: string;
  isActivo: boolean;
  actualizadoEl: string; // ISO date
}

export const preciosColumns: ColumnDef<PrecioItem>[] = [
  {
    id: 'nombre',
    header: 'Nombre',
    accessor: (r) => r.nombre,
    isSortable: true,
  },
  {
    id: 'categoria',
    header: 'Categoría',
    accessor: (r) => r.categoria,
    isSortable: true,
  },
  {
    id: 'importe',
    header: 'Importe',
    accessor: (r) => r.importe,
    isSortable: true,
    align: 'right',
    cell: (v: unknown) => (typeof v === 'number' ? v.toFixed(2) : ''),
  },
  {
    id: 'moneda',
    header: 'Moneda',
    accessor: (r) => r.moneda,
    isSortable: true,
    align: 'center',
  },
  {
    id: 'isActivo',
    header: 'Activo',
    accessor: (r) => r.isActivo,
    isSortable: true,
    align: 'center',
    cell: (v: unknown) => (v ? 'Sí' : 'No'),
  },
  {
    id: 'actualizadoEl',
    header: 'Actualizado',
    accessor: (r) => new Date(r.actualizadoEl),
    isSortable: true,
    cell: (v: unknown) => (v instanceof Date ? v.toLocaleDateString() : ''),
  },
];
