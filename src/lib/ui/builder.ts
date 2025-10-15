import {ColumnMeta, SearchPresetResolved, UiProjection, TablePresetResolved, ViewMode,} from "./contracts";

/** El builder no transforma a otra capa: entrega las columnas resueltas tal cual. */
export function buildUiProjectionResolved(
    _meta: ReadonlyArray<ColumnMeta>,              // reservado por si quieres validaciones extra por tipo
    table: TablePresetResolved,
    search: SearchPresetResolved,
    mode: ViewMode
): UiProjection {
    const view = table.views[mode];
    return {
        columns: view.columns,         // <- ResolvedColumn[] directo
        filters: search.fields,        // <- SearchFieldResolved[] directo
        defaultSort: view.defaultSort, // <- si hay
    };
}
