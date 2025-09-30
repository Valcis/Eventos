import { TablePreset, SearchPreset, ColumnOverride } from "../ui/contracts";
import { gastosColumns } from "./schema.columns";

function toTitleCase(input: string): string {
    const spaced = input
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_\-\.]+/g, " ")
        .trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

// 1) Catalogo base desde el esquema (id -> label auto)
const baseCatalog: ReadonlyArray<ColumnOverride> = gastosColumns.map((c) => ({
    id: c.id,
    label: toTitleCase(c.id),
}));

// 2) Overrides puntuales (solo cambios; el resto hereda del baseCatalog)
type OverridePatch = {
    label?: string;
    visible?: boolean;
    hidden?: boolean;
    order?: number;
    widthPx?: number;
    filterable?: boolean;
};

const overrides: Readonly<Record<string, OverridePatch>> = {
    // Ejemplos de negocio:
    producto:     { label: "Producto", widthPx: 220 },
    cantidad:     { label: "Cantidad", widthPx: 110 },
    precioBase:   { label: "Precio base", widthPx: 130 },
    precioNeto:   { label: "Precio neto", widthPx: 130 },
    unidadesPack: { label: "Unidades/pack", widthPx: 130 },
    tipoPrecio:   { label: "Tipo de precio", widthPx: 140 },
    tipoIVA:      { label: "IVA (%)", widthPx: 100 },
    notas:        { label: "Notas", widthPx: 260 },
    // Ocultos por defecto (técnicos/metadata)
    id:        { hidden: true },
    eventoId:  { hidden: true },
    locked:    { hidden: true },
    createdAt: { hidden: true, widthPx: 140 },
    updatedAt: { hidden: true, widthPx: 140 },
};

// 3) Fusión determinista (override > base)
const catalog: ReadonlyArray<ColumnOverride> = baseCatalog.map((c) => {
    const patch = overrides[c.id];
    return {
        ...c,
        ...(patch ?? {}),
    };
});

// 4) Vistas (orden explícito). Puedes ajustar ids según tu caso.
const views = {
    compact: [
        { id: "producto" },
        { id: "cantidad" },
        { id: "precioNeto" },
        { id: "tipoPrecio" },
        { id: "isPack" },
        { id: "comprobado" },
        { id: "tiendaId" },
    ],
    expanded: [
        { id: "producto" },
        { id: "unidadId" },
        { id: "cantidad" },
        { id: "precioUnidad" },
        { id: "unidadesPack" },
        { id: "tipoPrecio" },
        { id: "tipoIVA" },
        { id: "precioBase" },
        { id: "precioNeto" },
        { id: "pagadorId" },
        { id: "tiendaId" },
        { id: "notas" },
        { id: "comprobado" },
        { id: "isActive" },
        // Técnicos/metadata (mantenidos ocultos salvo que quieras mostrarlos):
        // { id: "createdAt" }, { id: "updatedAt" }, { id: "locked" }, { id: "id" }, { id: "eventoId" },
    ],
} as const;

export const gastosTablePreset: TablePreset = {
    catalog,
    views,
};

// 5) Filtros (elige los que quieras en SearchBar)
export const gastosSearchPreset: SearchPreset = {
    fields: [
        {
            id: "producto", label: "Producto",
            kind: "number"
        },
        {
            id: "pagadorId", label: "Pagador",
            kind: "number"
        },

    ],
};
