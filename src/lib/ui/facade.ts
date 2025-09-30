// lib/ui/facade.ts
import {UiProjection, ViewMode} from "./contracts";
import {getSchemaColumns, Entity} from "./registry";
import {gastosTablePreset, gastosSearchPreset} from "../gastos/presets";
import {reservasTablePreset, reservasSearchPreset} from "../reservas/presets";
import {preciosTablePreset, preciosSearchPreset} from "../precios/presets";
import {normalizeTablePreset, normalizeSearchPreset} from "./normalize";
import {buildUiProjectionResolved} from "./builder";

export function getUiForEntity(entity: Entity, mode: ViewMode): UiProjection {
    const meta = getSchemaColumns(entity);

    const raw = entity === "gastos" ? {t: gastosTablePreset, s: gastosSearchPreset}
        : entity === "reservas" ? {t: reservasTablePreset, s: reservasSearchPreset}
            : {t: preciosTablePreset, s: preciosSearchPreset};

    const tableN = normalizeTablePreset(meta, raw.t);
    const searchN = normalizeSearchPreset(meta, raw.s, tableN.catalog);

    return buildUiProjectionResolved(meta, tableN, searchN, mode);
}
