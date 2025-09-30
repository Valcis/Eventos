// src/lib/ui/contracts.ts

// ——— Intrínseco del esquema (derivado de .sot → schema.columns) ———
export type FieldKind = "text" | "number" | "select" | "date" | "boolean";

export interface SelectOption {
    value: string;
    label: string;
}

export type ValueFormat = "currency" | "percent" | "datetime" | "date" | "time";
export type ValidatorTag = "required" | "positive" | "nonEmpty" | "email" | "url";

/** Base generada desde el esquema (.sot → schema.columns). */
export interface ColumnMeta {
    column: string;                     // <- nombre de columna (antes id)
    kind: FieldKind;
    options?: ReadonlyArray<SelectOption> | undefined; // para 'select'
    format?: ValueFormat | undefined;
    validators?: ReadonlyArray<ValidatorTag> | undefined;
}

// ——— Presets (entrada RAW) ———
export type Align = "left" | "center" | "right";
export type ViewMode = "compact" | "expanded";
export type SortDirection = "asc" | "desc";
export type DataValue = string | number | boolean | Date | null;

export interface SortSpec {
    column: string;
    direction: SortDirection;
}

/** Detalle por columna en catálogo (ORDER obligatorio). */
export interface ColumnOverride {
    column: string;                     // <- consistente con 'column'
    label?: string | undefined;
    visible?: boolean | undefined;
    hidden?: boolean | undefined;
    order: number;                      // <- OBLIGATORIO
    widthPx?: number | undefined;
    filterable?: boolean | undefined;
    sortable?: boolean | undefined;
    align?: Align | undefined;
    tooltipText?: string | undefined;
    defaultValue?: DataValue | undefined;
    defaultSort?: SortDirection | undefined; // opcional: quién inicia el sort por defecto
}

/** Catálogo detallado + vistas como lista de nombres de columna. */
export interface TablePreset {
    catalog: ReadonlyArray<ColumnOverride>;
    views: Readonly<Record<ViewMode, ReadonlyArray<string>>>; // lista de 'column'
}

/** SearchPreset como lista de nombres de columna. */
export interface SearchPreset {
    fields: ReadonlyArray<string>; // nombres de 'column'
}

// ——— Normalizado/Resuelto ———

/** Columna final (fusión Meta + Catalog). Se usa DIRECTAMENTE en los componentes. */
export interface ResolvedColumn {
    column: string;
    kind: FieldKind;
    label: string;
    order: number;                      // <- mantenemos el order en resuelto
    visible: boolean;
    widthPx?: number | undefined;
    filterable: boolean;
    sortable: boolean;
    align?: Align | undefined;
    tooltipText?: string | undefined;
    defaultValue?: DataValue | undefined;

    // Passthrough de meta (no se pierde nada):
    options?: ReadonlyArray<SelectOption> | undefined;
    format?: ValueFormat | undefined;
    validators?: ReadonlyArray<ValidatorTag> | undefined;
}

/** Vista resuelta: subset de catálogo, ordenada por 'order' de catálogo. */
export interface ViewResolved {
    columns: ReadonlyArray<ResolvedColumn>;
    defaultSort?: SortSpec | undefined; // elegido por prioridad de 'defaultSort' de catálogo para las columnas de la vista
}

/** Preset de tabla resuelto completo. */
export interface TablePresetResolved {
    catalog: ReadonlyArray<ResolvedColumn>;
    views: Readonly<Record<ViewMode, ViewResolved>>;
}

/** Campo de búsqueda resuelto (tipo proviene de Meta). */
export interface SearchFieldResolved {
    column: string;
    label: string;
    type: FieldKind;
    options?: ReadonlyArray<SelectOption> | undefined;
}

/** Search resuelto. */
export interface SearchPresetResolved {
    fields: ReadonlyArray<SearchFieldResolved>;
}

/** Proyección final para UI (componentes usan ResolvedColumn directamente). */
export interface UiProjection {
    columns: ReadonlyArray<ResolvedColumn>;
    filters: ReadonlyArray<SearchFieldResolved>;
    defaultSort?: SortSpec | undefined; // de la vista activa
}
