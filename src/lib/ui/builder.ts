// lib/ui/builders.ts
import {
    ColumnMeta, TablePresetResolved, SearchPresetResolved,
    TableColumn, FilterField, UiProjection, ViewMode,
} from "./contracts";

function indexMeta(meta: ReadonlyArray<ColumnMeta>): Record<string, ColumnMeta> {
    const out: Record<string, ColumnMeta> = {};
    for (const m of meta) out[m.id] = m;
    return out;
}

export function buildTableColumnsResolved(
    table: TablePresetResolved,
    mode: ViewMode
): ReadonlyArray<TableColumn> {
    const cols = table.views[mode];
    return cols.map(c => ({
        id: c.id,
        header: c.label,
        accessorKey: c.id,
        visible: c.visible,
        widthPx: c.widthPx,
    }));
}

export function buildFilterFieldsResolved(
    meta: ReadonlyArray<ColumnMeta>,
    search: SearchPresetResolved
): ReadonlyArray<FilterField> {
    const byId = indexMeta(meta);
    return search.fields.map(f => {
        const m = byId[f.id];
        return {
            id: f.id,
            label: f.label,
            type: m.kind, // opciones abajo
            ...(m.options && m.options.length > 0 ? { options: m.options } : {}),
        };
    });
}

export function buildUiProjectionResolved(
    meta: ReadonlyArray<ColumnMeta>,
    table: TablePresetResolved,
    search: SearchPresetResolved,
    mode: ViewMode
): UiProjection {
    return {
        columns: buildTableColumnsResolved(table, mode),
        filters: buildFilterFieldsResolved(meta, search),
    };
}
