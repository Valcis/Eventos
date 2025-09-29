import type {Precio} from './types';
import type {ColumnDef} from '../../components/ui/DataTable/types';
import type {FilterField} from '../../components/ui/FilterBar/types';

export interface Preset<Row> {
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

export const preciosPreset: Preset<Precio> = {
    columnsDetailed: [
        {id: 'concepto', header: 'Concepto', accessorKey: 'concepto', isSortable: true, isSimpleKey: true},
        {id: 'importe', header: 'Importe', accessorKey: 'importe', align: 'right', isSortable: true, isSimpleKey: true},
        {id: 'locked', header: 'Bloqueado', accessorKey: 'locked', isSortable: true},
    ],
    columnsSimple: [
        {id: 'concepto', header: 'Concepto', accessorKey: 'concepto', isSortable: true, isSimpleKey: true},
        {id: 'importe', header: 'Importe', accessorKey: 'importe', align: 'right', isSortable: true, isSimpleKey: true},
    ],
    filters: [
        {id: 'q', label: 'Texto', type: 'text'},
        {id: 'concepto', label: 'Concepto', type: 'text'},
        {id: 'locked', label: 'Bloqueado', type: 'boolean'},
    ],
    defaultPageSize: 10,
    defaultSort: {columnId: 'importe', direction: 'desc'},
};
