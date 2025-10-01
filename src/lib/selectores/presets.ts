import { selectorKeys } from './schemas.zod';

/**
 * Column keys base usadas en presets para vistas compacta/ampliada.
 * (Se evita hardcodear literales dispersas)
 */
const baseColumnKeys = {
    id: 'id',
    nombre: 'nombre',
    isActive: 'isActive',
    notas: 'notas',
    telefono: 'telefono',
    requireReceptor: 'requireReceptor',
    direccion: 'direccion',
    horario: 'horario',
    comentarios: 'comentarios',
} as const;

type ColumnsPreset = {
    compact: string[];
    expanded: string[];
};

/**
 * Presets por mini-tabla.
 * Nota: Los presets incluyen siempre las base y añaden las específicas donde corresponda.
 */
export const selectoresPresets: Record<string, ColumnsPreset> = {
    [selectorKeys.comercial]: {
        compact: [baseColumnKeys.nombre, baseColumnKeys.isActive],
        expanded: [
            baseColumnKeys.id,
            baseColumnKeys.nombre,
            baseColumnKeys.telefono,
            baseColumnKeys.isActive,
            baseColumnKeys.notas,
        ],
    },
    [selectorKeys.metodoPago]: {
        compact: [baseColumnKeys.nombre, baseColumnKeys.isActive],
        expanded: [
            baseColumnKeys.id,
            baseColumnKeys.nombre,
            baseColumnKeys.requireReceptor,
            baseColumnKeys.isActive,
            baseColumnKeys.notas,
        ],
    },
    [selectorKeys.puntoRecogida]: {
        compact: [baseColumnKeys.nombre, baseColumnKeys.isActive],
        expanded: [
            baseColumnKeys.id,
            baseColumnKeys.nombre,
            baseColumnKeys.direccion,
            baseColumnKeys.horario,
            baseColumnKeys.comentarios,
            baseColumnKeys.isActive,
            baseColumnKeys.notas,
        ],
    },
    [selectorKeys.tipoConsumo]: {
        compact: [baseColumnKeys.nombre, baseColumnKeys.isActive],
        expanded: [
            baseColumnKeys.id,
            baseColumnKeys.nombre,
            baseColumnKeys.isActive,
            baseColumnKeys.notas,
        ],
    },
    [selectorKeys.receptor]: {
        compact: [baseColumnKeys.nombre, baseColumnKeys.isActive],
        expanded: [
            baseColumnKeys.id,
            baseColumnKeys.nombre,
            baseColumnKeys.isActive,
            baseColumnKeys.notas,
        ],
    },
    [selectorKeys.cobrador]: {
        compact: [baseColumnKeys.nombre, baseColumnKeys.isActive],
        expanded: [
            baseColumnKeys.id,
            baseColumnKeys.nombre,
            baseColumnKeys.isActive,
            baseColumnKeys.notas,
        ],
    },
    [selectorKeys.unidad]: {
        compact: [baseColumnKeys.nombre, baseColumnKeys.isActive],
        expanded: [
            baseColumnKeys.id,
            baseColumnKeys.nombre,
            baseColumnKeys.isActive,
            baseColumnKeys.notas,
        ],
    },
    [selectorKeys.pagador]: {
        compact: [baseColumnKeys.nombre, baseColumnKeys.isActive],
        expanded: [
            baseColumnKeys.id,
            baseColumnKeys.nombre,
            baseColumnKeys.isActive,
            baseColumnKeys.notas,
        ],
    },
    [selectorKeys.tienda]: {
        compact: [baseColumnKeys.nombre, baseColumnKeys.isActive],
        expanded: [
            baseColumnKeys.id,
            baseColumnKeys.nombre,
            baseColumnKeys.direccion,
            baseColumnKeys.horario,
            baseColumnKeys.isActive,
            baseColumnKeys.notas,
        ],
    },
};
