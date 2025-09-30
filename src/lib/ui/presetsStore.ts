import {TablePreset, SearchPreset} from "./contracts";
import type {Entity} from "./registry";

export interface EntityPresets {
    table: TablePreset;
    search: SearchPreset;
}

const registry: Partial<Record<Entity, EntityPresets>> = {};

/** Registra presets para una entidad (llamar desde cada módulo de entidad). */
export function registerPresets(entity: Entity, presets: EntityPresets): void {
    if (import.meta.env.DEV && registry[entity]) {
        console.warn(`[presets] Reemplazando presets existentes para "${entity}".`);
    }
    registry[entity] = presets;
}

/** Obtiene los presets registrados. Lanza si faltan. */
export function getPresets(entity: Entity): EntityPresets {
    const found = registry[entity];
    if (!found) {
        throw new Error(
            `Presets error: no hay presets registrados para la entidad "${entity}". ` +
            `Asegúrate de importar el archivo de presets correspondiente antes de usar el façade.`
        );
    }
    return found;
}
