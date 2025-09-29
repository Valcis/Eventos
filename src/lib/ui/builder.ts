// Transforma: (Schema Columns) + (Presets por IDs) -> Configs de UI listas.
import {
    ColumnMeta, TableColumn, FilterField, UiProjection, ViewMode, TablePreset, SearchPreset,
} from "./contracts";

function indexById(columns: ReadonlyArray<ColumnMeta>): Record<string, ColumnMeta> {
    const map: Record<string, ColumnMeta> = {};
    for (const c of columns) map[c.id] = c;
    return map;
}

function uniqKeepOrder(xs: ReadonlyArray<string>): ReadonlyArray<string> {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const x of xs) {
        if (!seen.has(x)) {
            seen.add(x);
            out.push(x);
        }
    }
    return out;
}

export function buildTableColumns(
    allColumnsFromSchema: ReadonlyArray<ColumnMeta>,
    tablePreset: TablePreset,
    mode: ViewMode
): ReadonlyArray<TableColumn> {
    const byId = indexById(allColumnsFromSchema);

    // Limpiamos universo a lo que dice el preset (IDs existentes y no ocultas)
    const universe = tablePreset.allColumns.filter((id) => !!byId[id]);
    const viewIds = uniqKeepOrder(tablePreset.views[mode]).filter((id) => universe.includes(id));

    const columns: TableColumn[] = viewIds.map((id) => {
        const meta = byId[id];
        const ov = tablePreset.columnOverrides?.[id];
        const finalHidden = ov?.hidden ?? meta.hidden ?? false;
        const visible = !finalHidden;

        return {
            id: meta.id,
            header: meta.label,
            accessorKey: meta.id,
            visible,
            widthPx: ov?.widthPx ?? meta.widthPx,
        };
    });

    return columns;
}

export function buildFilterFields(
    allColumnsFromSchema: ReadonlyArray<ColumnMeta>,
    searchPreset: SearchPreset
): ReadonlyArray<FilterField> {
    const byId = indexById(allColumnsFromSchema);
    const ids = uniqKeepOrder(searchPreset.fields).filter((id) => !!byId[id]);

    const filters: FilterField[] = ids.map((id) => {
        const meta = byId[id];
        const ov = searchPreset.filterOverrides?.[id];

        return {
            id: meta.id,
            label: ov?.label ?? meta.label,
            type: meta.kind,
            ...(meta.options && meta.options.length > 0 ? {options: meta.options} : {}),
        };
    });

    return filters;
}

export function buildUiProjection(
    allColumnsFromSchema: ReadonlyArray<ColumnMeta>,
    tablePreset: TablePreset,
    searchPreset: SearchPreset,
    mode: ViewMode
): UiProjection {
    return {
        columns: buildTableColumns(allColumnsFromSchema, tablePreset, mode),
        filters: buildFilterFields(allColumnsFromSchema, searchPreset),
    };
}
