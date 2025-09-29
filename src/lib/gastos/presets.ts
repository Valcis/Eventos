import type {ColumnDef} from '../../components/ui/DataTable/types';
import type {Gasto} from './types';
import {FilterField} from "../../components/ui/FilterBar/types";


/**
 * Preset genérico parametrizado por el tipo de fila.
 *
 * Esta interfaz replica la forma usada en `src/lib/presets.ts` y
 * restringe `Row` a `Gasto` en este módulo.
 */
export interface Preset<Row> {
    /** Columnas */
    columnsDetailed: Array<ColumnDef<Row>>;
    /**
     * Si no se pasa, se infiere por `isSimpleKey` de cada columna
     * (convención ya usada en DataTable del proyecto).
     */
    columnsSimple?: Array<ColumnDef<Row>>;


    /** Filtros de la barra */
    filters: Array<FilterField<Row>>;


    /** Página */
    defaultPageSize?: number;
    defaultSort?: { columnId: string; direction: 'asc' | 'desc' };


    /** Esquema de formulario de creación/edición (stub para conectar) */
    formSchema?: Array<{
        id: keyof Row | string;
        label: string;
        type: 'text' | 'number' | 'select' | 'date' | 'boolean';
        required?: boolean;
        options?: Array<{ label: string; value: string }>;
    }>;
}


/**
 * Extracción literal del preset `gastos` desde `src/lib/presets.ts`,
 * adaptado a `Preset<Gasto>` y con rutas relativas corregidas.
 */
export const gastosPreset: Preset<Gasto> = {
    columnsDetailed: [
        {id: 'producto', header: 'Producto', accessorKey: 'producto', isSortable: true, isSimpleKey: true},
        {
            id: 'cantidad',
            header: 'Cantidad',
            accessorKey: 'cantidad',
            isSortable: true,
            align: 'right',
            isSimpleKey: true
        },
        {id: 'unidad', header: 'Unidad', accessorKey: 'unidad', isSortable: true},
        {id: 'tipoPrecio', header: 'Tipo Precio', accessorKey: 'tipoPrecio', isSortable: true},
        {id: 'tipoIVA', header: 'IVA %', accessorKey: 'tipoIVA', isSortable: true, align: 'right'},
        {id: 'base', header: 'Base', accessorKey: 'base', isSortable: true, align: 'right'},
        {id: 'iva', header: 'IVA', accessorKey: 'iva', isSortable: true, align: 'right'},
        {id: 'total', header: 'Total', accessorKey: 'total', isSortable: true, align: 'right', isSimpleKey: true},
        {id: 'tienda', header: 'Tienda', accessorKey: 'tienda', isSortable: true},
        {id: 'pagador', header: 'Pagador', accessorKey: 'pagador', isSortable: true},
        {id: 'comprobado', header: 'Comprobado', accessorKey: 'comprobado', isSortable: true},
        {id: 'locked', header: 'Bloqueado', accessorKey: 'locked', isSortable: true},
    ],
    columnsSimple: [
        {id: 'producto', header: 'Producto', accessorKey: 'producto', isSortable: true, isSimpleKey: true},
        {
            id: 'cantidad',
            header: 'Cantidad',
            accessorKey: 'cantidad',
            isSortable: true,
            align: 'right',
            isSimpleKey: true
        },
        {id: 'total', header: 'Total', accessorKey: 'total', isSortable: true, align: 'right', isSimpleKey: true},
    ],
    filters: [
        {id: 'q', label: 'Texto', type: 'text'},
        {id: 'tienda', label: 'Tienda', type: 'text'},
        {id: 'pagador', label: 'Pagador', type: 'text'},
        {id: 'comprobado', label: 'Comprobado', type: 'boolean'},
        {id: 'locked', label: 'Bloqueado', type: 'boolean'},
    ],
    defaultPageSize: 20,
    defaultSort: {columnId: 'total', direction: 'desc'},
    formSchema: [
        {id: 'producto', label: 'Producto', type: 'text', required: true},
        {id: 'cantidad', label: 'Cantidad', type: 'number', required: true},
        {id: 'unidad', label: 'Unidad', type: 'text'},
        {
            id: 'tipoPrecio',
            label: 'Tipo Precio',
            type: 'select',
            options: [{label: 'Bruto', value: 'bruto'}, {label: 'Neto', value: 'neto'}]
        },
        {id: 'tipoIVA', label: 'IVA %', type: 'number'},
        {id: 'base', label: 'Base', type: 'number'},
        {id: 'iva', label: 'IVA', type: 'number'},
        {id: 'total', label: 'Total', type: 'number', required: true},
        {id: 'tienda', label: 'Tienda', type: 'text'},
        {id: 'pagador', label: 'Pagador', type: 'text'},
        {id: 'comprobado', label: 'Comprobado', type: 'boolean'},
        {id: 'locked', label: 'Bloqueado', type: 'boolean'},
    ],
};


export type GastosPresetKey = 'gastos';