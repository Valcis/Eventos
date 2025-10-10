// src/lib/ui/normalize.ts
import {
    Align,
    ColumnMeta,
    ColumnOverride,
    ResolvedColumn,
    SearchPreset,
    SearchPresetResolved,
    SortDirection,
    SortSpec,
    TablePreset,
    TablePresetResolved,
    ViewMode,
    ViewResolved,
    SearchFieldResolved,
} from "./contracts";

const STRICT_LABELS = true as const;

function titleCase(identifier: string): string {
    const spaced = identifier
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_\-\.]+/g, " ")
        .trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function indexMeta(meta: ReadonlyArray<ColumnMeta>): Record<string, ColumnMeta> {
    const map: Record<string, ColumnMeta> = {};
    for (const m of meta) map[m.column] = m;
    return map;
}

function validateNoDuplicates(list: ReadonlyArray<string>, where: string): void {
    const seen = new Set<string>();
    for (const name of list) {
        if (!name || name.trim().length === 0) {
            throw new Error(`Preset error: hay un nombre de columna vacío en ${where}.`);
        }
        if (seen.has(name)) {
            throw new Error(`Preset error: columna duplicada '${name}' en ${where}.`);
        }
        seen.add(name);
    }
}

function visibleFromFlags(catalog?: ColumnOverride): boolean {
    if (catalog?.hidden === true) return false;
    if (catalog?.visible === false) return false;
    return true; // visible por defecto
}

function defaultAlignFor(kind: ColumnMeta["kind"]): Align {
    switch (kind) {
        case "number":
            return "right";
        case "boolean":
            return "center";
        default:
            return "left";
    }
}

function resolveLabel(columnName: string, catalog?: ColumnOverride): string {
    const label = catalog?.label;
    if (label && label.trim().length > 0) return label;
    if (STRICT_LABELS) {
        throw new Error(`Preset error: falta 'label' para la columna '${columnName}' en catalog.`);
    }
    return titleCase(columnName);
}

function resolveAlign(kind: ColumnMeta["kind"], catalog?: ColumnOverride): Align {
    return (catalog?.align ?? defaultAlignFor(kind)) as Align;
}

function resolveSortable(kind: ColumnMeta["kind"], catalog?: ColumnOverride): boolean {
    return catalog?.sortable ?? true;
}

function resolveFilterable(catalog?: ColumnOverride): boolean {
    return catalog?.filterable ?? true;
}

function pickDefaultSortForView(
    catalogIndex: Record<string, ColumnOverride>,
    viewColumns: ReadonlyArray<ResolvedColumn>
): SortSpec | undefined {
    for (const col of viewColumns) {
        const dir = catalogIndex[col.column]?.defaultSort;
        if (dir) {
            return {column: col.column, direction: dir};
        }
    }
    return undefined;
}

export function normalizeTablePreset(
    meta: ReadonlyArray<ColumnMeta>,
    preset: TablePreset
): TablePresetResolved {
    const metaByColumn: Record<string, ColumnMeta> = indexMeta(meta);


    // —— Catalog: validar y normalizar
    const catalogIndex: Record<string, ColumnOverride> = {};
    const catalogResolved: ResolvedColumn[] = preset.catalog.map((entry, idx) => {
        const columnName = entry.column;
        const metaEntry = metaByColumn[columnName];
        if (!metaEntry) {
            throw new Error(`Preset error: la columna '${columnName}' (catalog[${idx}]) no existe en schema.columns.`);
        }
        if (typeof entry.order !== "number" || Number.isNaN(entry.order)) {
            throw new Error(`Preset error: 'order' es obligatorio y debe ser numérico en catalog para '${columnName}'.`);
        }
        catalogIndex[columnName] = entry;
        return {
            column: columnName,
            kind: metaEntry.kind,
            label: resolveLabel(columnName, entry),
            order: entry.order,
            visible: entry.hidden === true ? false : entry.visible === false ? false : true,
            filterable: entry.filterable ?? true,
            sortable: entry.sortable ?? true,
            ...(entry.align !== undefined ? { align: entry.align } : {}),
            ...(entry.widthPx !== undefined ? { widthPx: entry.widthPx } : {}),
            ...(entry.tooltipText ? { tooltipText: entry.tooltipText } : {}),
            ...(entry.defaultValue !== undefined ? { defaultValue: entry.defaultValue } : {}),
            ...(metaEntry.options ? { options: metaEntry.options } : {}),
            ...(metaEntry.format ? { format: metaEntry.format } : {}),
            ...(metaEntry.validators ? { validators: metaEntry.validators } : {}),
        } satisfies ResolvedColumn;
    });

    // Ordenar por 'order' (y nombre para estabilidad)
    catalogResolved.sort((a, b) =>
        a.order !== b.order ? a.order - b.order : a.column.localeCompare(b.column)
    );

    // —— Views: subset del catálogo, manteniendo el orden del catálogo
    const viewsResolved: Record<ViewMode, ViewResolved> = {} as Record<ViewMode, ViewResolved>;
    const viewModes = Object.keys(preset.views) as ReadonlyArray<ViewMode>;

    for (const mode of viewModes) {
        const list = preset.views[mode];
        validateNoDuplicates(list, `views.${mode}`);

        for (const name of list) {
            if (!catalogIndex[name]) {
                throw new Error(`Preset error: la columna '${name}' en views.${mode} no está declarada en catalog.`);
            }
        }

        const subset = catalogResolved.filter((c) => list.includes(c.column));
        const defaultSort = pickDefaultSortForView(catalogIndex, subset);
        viewsResolved[mode] = {columns: subset,
            ...(defaultSort ? { defaultSort } : {}),};
    }

    return {catalog: catalogResolved, views: viewsResolved};
}

export function normalizeSearchPreset(
    meta: ReadonlyArray<ColumnMeta>,
    search: SearchPreset,
    catalogResolved: ReadonlyArray<ResolvedColumn>
): SearchPresetResolved {
    const metaByColumn = indexMeta(meta);
    const catalogByColumn: Record<string, ResolvedColumn> = {};
    for (const c of catalogResolved) catalogByColumn[c.column] = c;

    const seen = new Set<string>();
    const fields: SearchFieldResolved[] = [];

    for (let i = 0; i < search.fields.length; i++) {
        const columnName = search.fields[i];

        if (!columnName || columnName.trim().length === 0) {
            throw new Error(`Search error: hay un nombre de columna vacío en search.fields[${i}].`);
        }
        if (seen.has(columnName)) {
            throw new Error(`Search error: columna duplicada '${columnName}' en search.fields.`);
        }
        seen.add(columnName);

        const metaEntry = metaByColumn[columnName];
        if (!metaEntry) {
            throw new Error(`Search error: la columna '${columnName}' no existe en schema.columns.`);
        }

        const base = catalogByColumn[columnName];
        if (base && base.filterable === false) {
            continue; // respetar 'filterable: false'
        }

        fields.push({
            column: columnName,
            label: base?.label ?? titleCase(columnName),
            type: metaEntry.kind,
            ...(metaEntry.options ? {options: metaEntry.options} : {}),
        });
    }

    return {fields};
}
