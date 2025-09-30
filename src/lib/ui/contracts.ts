// lib/ui/contracts.ts
export type FieldKind = "text" | "number" | "select" | "date" | "boolean";

export interface ColumnMeta {
    id: string;
    kind: FieldKind;
    options?: ReadonlyArray<{ value: string; label: string }>;
}

/** Lo que ESCRIBES en presets (RAW) */
export interface ColumnOverride {
    id: string;
    label?: string;
    visible?: boolean;
    hidden?: boolean;
    order?: number;
    widthPx?: number;
    filterable?: boolean;
}

export type ViewMode = "compact" | "expanded";

/** RAW (entrada) */
export interface TablePreset {
    catalog: ReadonlyArray<ColumnOverride>;
    views: Readonly<Record<ViewMode, ReadonlyArray<ColumnOverride>>>;
}
export interface SearchPreset {
    fields: ReadonlyArray<ColumnOverride>;
}

/** RESUELTO (tras normalize) */
export interface ColumnResolved {
    id: string;
    kind: FieldKind;
    label: string;
    widthPx?: number;
    visible: boolean;
}
export interface TablePresetResolved {
    catalog: ReadonlyArray<ColumnResolved>;
    views: Readonly<Record<ViewMode, ReadonlyArray<ColumnResolved>>>;
}
export interface SearchPresetResolved {
    fields: ReadonlyArray<ColumnResolved>;
}

/** Salida final para componentes */
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
