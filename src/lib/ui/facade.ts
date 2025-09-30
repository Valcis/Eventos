import {getSchemaColumns, type Entity} from "./registry";
import {getPresets} from "./presetsStore";
import {normalizeTablePreset, normalizeSearchPreset} from "./normalize";
import {buildUiProjectionResolved} from "./builder";
import type {UiProjection, ViewMode} from "./contracts";

/**
 * Punto de entrada para componentes.
 * Devuelve columnas resueltas + filtros + defaultSort para una entidad y vista.
 */
export function getUiForEntity(entity: Entity, mode: ViewMode = "compact"): UiProjection {
    try {
        // 1) Meta (fuente de verdad desde .sot → schema.columns)
        const meta = getSchemaColumns(entity);

        // 2) Presets RAW registrados para la entidad
        const {table, search} = getPresets(entity);

        // 3) Normalización (valida y fusiona catalog + meta; valida search)
        const tableResolved = normalizeTablePreset(meta, table);
        const searchResolved = normalizeSearchPreset(meta, search, tableResolved.catalog);

        // 4) Proyección final (sin transformar a otra capa; entrega ResolvedColumn)
        return buildUiProjectionResolved(meta, tableResolved, searchResolved, mode);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        // Enriquecemos el error con el contexto de entidad y vista
        throw new Error(`UI error (${entity}/${mode}): ${message}`);
    }
}
