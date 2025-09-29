// src/lib/reservas/presets.ts
// Preset SOLO de Reservas, usando tipos locales.

import type {Reserva} from './types';
import type {ColumnDef} from '../../components/ui/DataTable/types';
import type {FilterField} from '../../components/ui/FilterBar/types';

export interface Preset<Row> {
    columnsDetailed: Array<ColumnDef<Row>>;
    columnsSimple?: Array<ColumnDef<Row>>;
    filters: Array<FilterField<Row>>;
    defaultPageSize?: number;
    defaultSort?: { columnId: string; direction: 'asc' | 'desc' };
}

export const reservasPreset: Preset<Reserva> = {
    columnsDetailed: [
        {id: 'cliente', header: 'Cliente', accessorKey: 'cliente', isSortable: true, isSimpleKey: true},
        {id: 'parrilladas', header: 'Parrilladas', accessorKey: 'parrilladas', isSortable: true, align: 'right'},
        {id: 'picarones', header: 'Picarones', accessorKey: 'picarones', isSortable: true, align: 'right'},
        {id: 'tipoConsumo', header: 'Tipo Consumo', accessorKey: 'tipoConsumo', isSortable: true},
        {id: 'metodoPago', header: 'Método Pago', accessorKey: 'metodoPago', isSortable: true},
        {id: 'receptor', header: 'Receptor', accessorKey: 'receptor', isSortable: true},
        {
            id: 'totalPedido',
            header: 'Total',
            accessorKey: 'totalPedido',
            isSortable: true,
            align: 'right',
            isSimpleKey: true
        },
        {id: 'pagado', header: 'Pagado', accessorKey: 'pagado', isSortable: true},
        {id: 'comprobado', header: 'Comprobado', accessorKey: 'comprobado', isSortable: true},
        {id: 'locked', header: 'Bloqueado', accessorKey: 'locked', isSortable: true},
    ],
    columnsSimple: [
        {id: 'cliente', header: 'Cliente', accessorKey: 'cliente', isSortable: true, isSimpleKey: true},
        {
            id: 'totalPedido',
            header: 'Total',
            accessorKey: 'totalPedido',
            isSortable: true,
            align: 'right',
            isSimpleKey: true
        },
        {id: 'pagado', header: 'Pagado', accessorKey: 'pagado', isSortable: true},
    ],
    filters: [
        {id: 'q', label: 'Texto', type: 'text'},
        {
            id: 'metodoPago',
            label: 'Método Pago',
            type: 'select',
            options: [
                {label: 'Efectivo', value: 'efectivo'},
                {label: 'Tarjeta', value: 'tarjeta'},
                {label: 'Bizum', value: 'bizum'},
                {label: 'Transferencia', value: 'transferencia'},
            ],
        },
        {id: 'pagado', label: 'Pagado', type: 'boolean'},
        {id: 'comprobado', label: 'Comprobado', type: 'boolean'},
        {id: 'locked', label: 'Bloqueado', type: 'boolean'},
    ],
    defaultPageSize: 20,
    defaultSort: {columnId: 'totalPedido', direction: 'desc'},
};
