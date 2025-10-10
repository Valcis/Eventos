import {FieldKind, SelectOption, ValidatorTag, ValueFormat} from "../globalTypes";

export interface ColumnMeta {
    column: string;                 // nombre de columna
    kind: FieldKind;
    options?: ReadonlyArray<SelectOption>;
    format?: ValueFormat;
    validators?: ReadonlyArray<ValidatorTag>;
}

// —— Presets (entrada RAW) ——
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
    column: string;                 // consistente con 'column'
    label?: string;
    visible?: boolean;
    hidden?: boolean;
    order: number;                  // OBLIGATORIO
    widthPx?: number;
    filterable?: boolean;
    sortable?: boolean;
    align?: Align;
    tooltipText?: string;
    defaultValue?: DataValue;
    defaultSort?: SortDirection;    // quién inicia el sort por defecto
}

/** Catálogo detallado + vistas como lista de nombres de columna. */
export interface TablePreset {
    catalog: ReadonlyArray<ColumnOverride>;
    // mapa por modo → lista de nombres de columna (en normalize reordenamos por 'order')
    views: Record<ViewMode, ReadonlyArray<string>>;
}

/** SearchPreset como lista de nombres de columna. */
export interface SearchPreset {
    fields: ReadonlyArray<string>; // nombres de 'column'
}

// —— Normalizado/Resuelto ——
/** Columna final (fusión Meta + Catalog). Se usa DIRECTAMENTE en los componentes. */
export interface ResolvedColumn {
    column: string;
    kind: FieldKind;
    label: string;
    order: number;                  // mantenemos el order en resuelto
    visible: boolean;
    filterable: boolean;
    sortable: boolean;

    // 👇 Deben ser OPCIONALES si pueden faltar
    align?: Align;
    widthPx?: number;
    tooltipText?: string;
    defaultValue?: DataValue;

    // Passthrough de meta (no se pierde nada):
    options?: ReadonlyArray<SelectOption>;
    format?: ValueFormat;
    validators?: ReadonlyArray<ValidatorTag>;
}

/** Vista resuelta: subset de catálogo, ordenada por 'order' de catálogo. */
export interface ViewResolved {
    columns: ReadonlyArray<ResolvedColumn>;
    defaultSort?: SortSpec;
}

/** Preset de tabla resuelto completo. */
export interface TablePresetResolved {
    catalog: ReadonlyArray<ResolvedColumn>;
    views: Record<ViewMode, ViewResolved>;
}

/** Campo de búsqueda resuelto (tipo proviene de Meta). */
export interface SearchFieldResolved {
    column: string;
    label: string;
    type: FieldKind;
    options?: ReadonlyArray<SelectOption>;
}

/** Search resuelto. */
export interface SearchPresetResolved {
    fields: ReadonlyArray<SearchFieldResolved>;
}

/** Proyección final para UI (componentes usan ResolvedColumn directamente). */
export interface UiProjection {
    columns: ReadonlyArray<ResolvedColumn>;
    filters: ReadonlyArray<SearchFieldResolved>;
    defaultSort?: SortSpec | undefined;
}
