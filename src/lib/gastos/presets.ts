import type { Gasto } from './types';
import type { ColumnDef } from '../../components/ui/DataTable/types';
import type { FilterField } from '../../components/ui/FilterBar/types';

export interface Preset<Row extends Record<string, unknown>> {
    columnsDetailed: Array<ColumnDef<Row>>;
    columnsSimple?: Array<ColumnDef<Row>>;
    filters: Array<FilterField<Row>>;
    defaultPageSize?: number;
    defaultSort?: { columnId: string; direction: 'asc' | 'desc' };
    formSchema?: Array<{
        id: keyof Row | string;
        label: string;
        type: 'text' | 'number' | 'select' | 'date' | 'boolean';
        required?: boolean;
        options?: Array<{ label: string; value: string }>;
    }>;
}

export const gastosPreset: Preset<Gasto> = {
    columnsDetailed: [
        { id: 'producto', header: 'Producto', accessorKey: 'producto', isSortable: true, isSimpleKey: true },
        { id: 'cantidad', header: 'Cantidad', accessorKey: 'cantidad', isSortable: true, align: 'right', isSimpleKey: true },
        { id: 'unidad', header: 'Unidad', accessorKey: 'unidad', isSortable: true },
        { id: 'tipoPrecio', header: 'Tipo Precio', accessorKey: 'tipoPrecio', isSortable: true },
        { id: 'tipoIVA', header: 'IVA %', accessorKey: 'tipoIVA', isSortable: true, align: 'right' },
        { id: 'base', header: 'Base', accessorKey: 'base', isSortable: true, align: 'right' },
        { id: 'iva', header: 'IVA', accessorKey: 'iva', isSortable: true, align: 'right' },
        { id: 'total', header: 'Total', accessorKey: 'total', isSortable: true, align: 'right', isSimpleKey: true },
        { id: 'tienda', header: 'Tienda', accessorKey: 'tienda', isSortable: true },
        { id: 'pagador', header: 'Pagador', accessorKey: 'pagador', isSortable: true },
        { id: 'comprobado', header: 'Comprobado', accessorKey: 'comprobado', isSortable: true },
        { id: 'locked', header: 'Bloqueado', accessorKey: 'locked', isSortable: true },
    ],
    columnsSimple: [
        { id: 'producto', header: 'Producto', accessorKey: 'producto', isSortable: true, isSimpleKey: true },
        { id: 'cantidad', header: 'Cantidad', accessorKey: 'cantidad', isSortable: true, align: 'right', isSimpleKey: true },
        { id: 'total', header: 'Total', accessorKey: 'total', isSortable: true, align: 'right', isSimpleKey: true },
    ],
    filters: [
        { id: 'q', label: 'Texto', type: 'text' },
        { id: 'tienda', label: 'Tienda', type: 'text' },
        { id: 'pagador', label: 'Pagador', type: 'text' },
        { id: 'comprobado', label: 'Comprobado', type: 'boolean' },
        { id: 'locked', label: 'Bloqueado', type: 'boolean' },
    ],
    defaultPageSize: 20,
    defaultSort: { columnId: 'total', direction: 'desc' },
};
