import type {Precio} from "./types";
import type {ColumnDef} from "../../components/ui/DataTable/types";
import type {FilterField} from "../../components/ui/FilterBar/types";

/**
 * Interfaz Preset (misma forma que la usada en DataTable/FilterBar del proyecto),
 * parametrizada por el tipo de fila (aquí, Precio).
 */
export interface Preset<Row> {
    columnsDetailed: Array<ColumnDef<Row>>;
    /**
     * Si se omite, puede inferirse por `isSimpleKey` en cada columna (si vuestro DataTable lo soporta).
     */
    columnsSimple?: Array<ColumnDef<Row>>;
    filters: Array<FilterField<Row>>;
    defaultPageSize?: number;
    defaultSort?: { columnId: string; direction: "asc" | "desc" };
    formSchema?: Array<{
        id: keyof Row | string;
        label: string;
        type: "text" | "number" | "select" | "date" | "boolean";
        required?: boolean;
        options?: Array<{ label: string; value: string }>;
    }>;
}

/** Preset para la vista de Precios. */
export const preciosPreset: Preset<Precio> = {
    columnsDetailed: [
        {id: "nombre", header: "Nombre", accessorKey: "nombre", isSortable: true, isSimpleKey: true},
        {id: "unidad", header: "Unidad", accessorKey: "unidad", isSortable: true},
        {id: "precioBase", header: "Base (sin IVA)", accessorKey: "precioBase", align: "right", isSortable: true},
        {id: "tipoIVA", header: "IVA %", accessorKey: "tipoIVA", align: "right", isSortable: true},
        {
            id: "precioTotal",
            header: "Total (con IVA)",
            accessorKey: "precioTotal",
            align: "right",
            isSortable: true,
            isSimpleKey: true
        },
        {id: "proveedor", header: "Proveedor", accessorKey: "proveedor", isSortable: true},
        {id: "isPack", header: "Pack", accessorKey: "isPack", isSortable: true},
        {id: "unidadesPack", header: "Unidades/Pack", accessorKey: "unidadesPack", align: "right", isSortable: true},
        {id: "isActive", header: "Activo", accessorKey: "isActive", isSortable: true},
    ],
    columnsSimple: [
        {id: "nombre", header: "Nombre", accessorKey: "nombre", isSortable: true, isSimpleKey: true},
        {
            id: "precioTotal",
            header: "Total (IVA)",
            accessorKey: "precioTotal",
            align: "right",
            isSortable: true,
            isSimpleKey: true
        },
        {id: "isActive", header: "Activo", accessorKey: "isActive", isSortable: true},
    ],
    filters: [
        {id: "q", label: "Texto", type: "text"},
        {id: "proveedor", label: "Proveedor", type: "text"},
        {id: "isPack", label: "Pack", type: "boolean"},
        {id: "tipoIVA", label: "IVA %", type: "number"},
        {id: "isActive", label: "Activo", type: "boolean"},
    ],
    defaultPageSize: 20,
    defaultSort: {columnId: "precioTotal", direction: "desc"},
    formSchema: [
        {id: "nombre", label: "Nombre", type: "text", required: true},
        {id: "unidad", label: "Unidad", type: "text", required: true},
        {id: "precioBase", label: "Base (sin IVA)", type: "number", required: true},
        {id: "tipoIVA", label: "IVA %", type: "number", required: true},
        {id: "precioTotal", label: "Total (con IVA)", type: "number", required: true},
        {id: "proveedor", label: "Proveedor", type: "text"},
        {id: "isPack", label: "Pack", type: "boolean"},
        {id: "unidadesPack", label: "Unidades por pack", type: "number"},
        {id: "isActive", label: "Activo", type: "boolean"},
        {id: "notas", label: "Notas", type: "text"},
    ],
};

export type PreciosPresetKey = "precios";
