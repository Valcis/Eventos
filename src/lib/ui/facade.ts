// Fachada única: desde una entidad -> columnas y filtros listos.

import { UiProjection, ViewMode } from "./contracts";
import {getSchemaColumns} from "./registry";
import {getPresets} from "./presetsStore";

export function getUiForEntity(entity: string, mode: ViewMode): UiProjection {
    // entity es limitada via types si usas el tipo Entity en tus llamadas
    const columnsFromSchema = getSchemaColumns(entity as never);
    const presets = getPresets(entity as never);
    return {
        columns: presets.table ? undefined! : [], // placeholder para no engañar TS
        filters: presets.search ? undefined! : [],
        ...(() => {
            const { buildUiProjection } = require("") as {
                buildUiProjection: (
                    allCols: ReturnType<typeof getSchemaColumns>,
                    t: ReturnType<typeof getPresets>["table"],
                    s: ReturnType<typeof getPresets>["search"],
                    m: ViewMode
                ) => UiProjection;
            };
            return buildUiProjection(columnsFromSchema, presets.table, presets.search, mode);
        })(),
    };
}
