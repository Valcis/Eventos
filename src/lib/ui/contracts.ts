export type FieldKind = "text" | "number" | "select" | "date" | "boolean";

export interface ColumnMeta {
    id: string;            // del esquema
    kind: FieldKind;       // del esquema
    options?: ReadonlyArray<{ value: string; label: string }>;
}

/** Overrides dirigidos por preset (no redefinen el esquema) */
export interface ColumnOverride extends ColumnMeta{
    id: string;            // referencia a columna del esquema
    label: string;         // nombre amigable de la columna
    visible?: boolean;     // visible por defecto
    order?: number;        // orden en la vista (si lo usas)
    widthPx?: number;
    hidden?: boolean;      // o visible?: boolean, elige uno
    filterable?: boolean;  // útil para SearchPreset
    align?: "left" | "center" | "right";
    sortable?: boolean;
    defaultSort?: "asc" | "desc";
}

/** Modificado: ahora arrays de OBJETOS, no solo IDs */
export type ViewMode = "compact" | "expanded";

export interface TablePreset {
    allColumns: ReadonlyArray<ColumnOverride>;
    /** Catálogo completo de columnas de la entidad (id + overrides base) */
    catalog: ReadonlyArray<ColumnOverride>;
    /** Vistas: orden y overrides específicos por vista */
    views: Readonly<Record<ViewMode, ReadonlyArray<ColumnOverride>>>;
}

export interface SearchPreset {
    /** Campos filtrables (id + overrides opcionales específicos de filtro) */
    fields: ReadonlyArray<ColumnOverride>;
}

export interface TableColumn {
    id: string;
    header: string;
    accessorKey: string;
    visible: boolean;
    widthPx?: number;
}

export interface FilterField {
    id: string;
    label: string;
    type: FieldKind;
    options?: ReadonlyArray<{ value: string; label: string }>;
}

export interface UiProjection {
    columns: ReadonlyArray<TableColumn>;
    filters: ReadonlyArray<FilterField>;
}
