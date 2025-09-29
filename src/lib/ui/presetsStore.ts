import {TablePreset, SearchPreset} from "../ui/contracts";
import {Entity} from "./registry";

export interface EntityPresets {
    table: TablePreset;
    search: SearchPreset;
}

const registry: Partial<Record<Entity, EntityPresets>> = {};

/** Registra presets para una entidad (llamar en bootstrap de cada módulo). */
export function registerPresets(entity: Entity, presets: EntityPresets): void {
    registry[entity] = presets;
}

/** Obtiene los presets registrados. Lanza si faltan. */
export function getPresets(entity: Entity): EntityPresets {
    const found = registry[entity];
    if (!found) {
        throw new Error(`No hay presets registrados para la entidad "${entity}".`);
    }
    return found;
}
