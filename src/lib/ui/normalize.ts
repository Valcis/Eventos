// lib/ui/normalize.ts
import {
    ColumnMeta, ColumnOverride, ColumnResolved,
    TablePreset, TablePresetResolved,
    SearchPreset, SearchPresetResolved,
    ViewMode,
} from "./contracts";

const STRICT_LABELS = true;

function titleCase(id: string): string {
    const spaced = id
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_\-\.]+/g, " ")
        .trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function indexMeta(meta: ReadonlyArray<ColumnMeta>): Record<string, ColumnMeta> {
    const map: Record<string, ColumnMeta> = {};
    for (const m of meta) map[m.id] = m;
    return map;
}

function requireId(ov: ColumnOverride, where: string): void {
    if (!ov.id) throw new Error(`Preset error: falta 'id' en ${where}.`);
}

function validateNoDups(list: ReadonlyArray<ColumnOverride>, where: string): void {
    const seen = new Set<string>();
    for (const it of list) {
        requireId(it, where);
        if (seen.has(it.id)) throw new Error(`Preset error: id duplicado '${it.id}' en ${where}.`);
        seen.add(it.id);
    }
}

function resolveVisible(view?: ColumnOverride, cat?: ColumnOverride): boolean {
    const hidden = (view?.hidden === true) || (view?.visible === false) || (cat?.hidden === true) || (cat?.visible === false);
    return !hidden;
}

function resolvedLabelFor(id: string, view?: ColumnOverride, cat?: ColumnOverride): string {
    const label = view?.label ?? cat?.label;
    if (label) return label;
    if (STRICT_LABELS) throw new Error(`Preset error: falta 'label' para columna '${id}'. Añádelo en vista o catalog.`);
    return titleCase(id);
}

export function normalizeTablePreset(
    meta: ReadonlyArray<ColumnMeta>,
    preset: TablePreset
): TablePresetResolved {
    const byId = indexMeta(meta);

    validateNoDups(preset.catalog, "catalog");

    const catIndex: Record<string, ColumnOverride> = {};
    for (const c of preset.catalog) {
        if (!byId[c.id]) throw new Error(`Preset error: id '${c.id}' en catalog no existe en el esquema.`);
        catIndex[c.id] = c;
    }

    const catalogResolved: ColumnResolved[] = preset.catalog.map(c => ({
        id: c.id,
        kind: byId[c.id].kind,
        label: resolvedLabelFor(c.id, undefined, c),
        widthPx: c.widthPx,
        visible: resolveVisible(undefined, c),
    }));

    const viewsResolved = {} as Record<ViewMode, ReadonlyArray<ColumnResolved>>;
    const modes = Object.keys(preset.views) as ReadonlyArray<ViewMode>;
    for (const mode of modes) {
        const view = preset.views[mode];
        validateNoDups(view, `views.${mode}`);

        const resolved: ColumnResolved[] = view.map(v => {
            const m = byId[v.id];
            if (!m) throw new Error(`Preset error: id '${v.id}' en views.${mode} no existe en el esquema.`);
            const cat = catIndex[v.id];
            return {
                id: v.id,
                kind: m.kind,
                label: resolvedLabelFor(v.id, v, cat),
                widthPx: v.widthPx ?? cat?.widthPx,
                visible: resolveVisible(v, cat),
            };
        });

        viewsResolved[mode] = resolved;
    }

    return { catalog: catalogResolved, views: viewsResolved };
}

export function normalizeSearchPreset(
    meta: ReadonlyArray<ColumnMeta>,
    search: SearchPreset,
    catalogResolved: ReadonlyArray<ColumnResolved>
): SearchPresetResolved {
    const byId = indexMeta(meta);
    const catIndex: Record<string, ColumnResolved> = {};
    for (const c of catalogResolved) catIndex[c.id] = c;

    validateNoDups(search.fields, "search.fields");

    const fields: ColumnResolved[] = search.fields
        .filter(f => f.filterable !== false)
        .map(f => {
            const m = byId[f.id];
            if (!m) throw new Error(`Preset error: id '${f.id}' en search.fields no existe en el esquema.`);
            const base = catIndex[f.id];
            const label = f.label ?? base?.label;
            if (!label && STRICT_LABELS) throw new Error(`Preset error: falta 'label' para filtro '${f.id}'.`);
            return {
                id: f.id,
                kind: m.kind,
                label: label ?? titleCase(f.id),
                widthPx: f.widthPx ?? base?.widthPx,
                visible: true,
            };
        });

    return { fields };
}
