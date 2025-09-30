// Presets de selectores (sin UI). Tipados contra Selectores.* y validados con Zod.
import {Selectores} from "./types";
import {SELECTOR_SCHEMAS, SelectorKind,} from "./schemas.zod";

// ---------- Datos base ----------
// NOTA: En TipoPrecio y TipoConsumo los nombres son NOMINALES y deben ser exactos:
//   - TipoPrecio: "con_iva", "sin_iva"
//   - TipoConsumo: "comer_aqui", "recoger"

const comerciales: Selectores.Comercial[] = [
    {id: "com-001", nombre: "Comercial general", activo: true, telefono: "600000001"},
    {id: "com-002", nombre: "Comercial online", activo: true},
];

const metodosPago: Selectores.MetodoPago[] = [
    {id: "mp-001", nombre: "Efectivo", activo: true, requiereReceptor: false},
    {id: "mp-002", nombre: "Tarjeta", activo: true, requiereReceptor: false},
    {id: "mp-003", nombre: "Transferencia", activo: true, requiereReceptor: true},
];

const pagadores: Selectores.Pagador[] = [
    {id: "pg-001", nombre: "Cliente final", activo: true},
    {id: "pg-002", nombre: "Empresa", activo: true, telefono: "600000002"},
];

const tiendas: Selectores.Tienda[] = [
    {id: "ti-001", nombre: "Tienda Centro", activo: true, direccion: "C/ Mayor 1", horario: "10:00-20:00"},
    {id: "ti-002", nombre: "Tienda Barrio", activo: true},
];

const unidades: Selectores.Unidad[] = [
    {id: "un-ud", nombre: "Unidad", activo: true, abreviatura: "ud"},
    {id: "un-kg", nombre: "Kilogramo", activo: true, abreviatura: "kg"},
];

const tipoPrecio: Selectores.TipoPrecio[] = [
    {id: "tp-1", nombre: "con_iva", activo: true},
    {id: "tp-2", nombre: "sin_iva", activo: true},
];

const tipoConsumo: Selectores.TipoConsumo[] = [
    {id: "tc-1", nombre: "comer_aqui", activo: true},
    {id: "tc-2", nombre: "recoger", activo: true},
];

const receptorCobrador: Selectores.ReceptorCobrador[] = [
    {id: "rc-1", nombre: "Mostrador", activo: true, telefono: "600000003"},
    {id: "rc-2", nombre: "Repartidor", activo: true},
];

const puntosRecogida: Selectores.PuntoRecogida[] = [
    {
        id: "pr-1",
        nombre: "Punto Centro",
        activo: true,
        direccion: "Plaza Mayor s/n",
        horario: "12:00-22:00",
        telefono: "600000004",
        capacidad: 50,
        comentarios: "Recogida rápida",
    },
    {id: "pr-2", nombre: "Punto Norte", activo: true},
];

// ---------- Export principal tipado ----------
export const SELECTOR_PRESETS = {
    comerciales,
    metodosPago,
    pagadores,
    tiendas,
    unidades,
    tipoPrecio,     // auxiliar (siembras si la tabla se usa)
    tipoConsumo,
    receptorCobrador,
    puntosRecogida,
} as const satisfies {
    comerciales: Selectores.Comercial[];
    metodosPago: Selectores.MetodoPago[];
    pagadores: Selectores.Pagador[];
    tiendas: Selectores.Tienda[];
    unidades: Selectores.Unidad[];
    tipoPrecio: Selectores.TipoPrecio[];
    tipoConsumo: Selectores.TipoConsumo[];
    receptorCobrador: Selectores.ReceptorCobrador[];
    puntosRecogida: Selectores.PuntoRecogida[];
};

// ---------- Utilidades opcionales ----------
/**
 * Devuelve el preset de una tabla principal.
 * Ojo: "tipoPrecio" es auxiliar y puede no pintarse como tabla en UI.
 */
export function getSelectorPreset<K extends SelectorKind>(
    kind: K
): readonly Selectores.ItemByKind<K>[] {
    return SELECTOR_PRESETS[kind] as unknown as readonly Selectores.ItemByKind<K>[];
}

/**
 * Valida todos los presets contra Zod para detectar desalineaciones.
 * (Útil en tests o para sanity-check en desarrollo)
 */
export function validateSelectorPresets(): { ok: true } | { ok: false; errors: string[] } {
    const errors: string[] = [];

    const check = <K extends SelectorKind>(kind: K) => {
        const schema = SELECTOR_SCHEMAS[kind];
        for (const item of SELECTOR_PRESETS[kind] as unknown as object[]) {
            const res = schema.safeParse(item);
            if (!res.success) {
                errors.push(`${kind}::${(item as any).id ?? "?"} -> ${res.error.message}`);
            }
        }
    };

    ([
        "comerciales",
        "metodosPago",
        "pagadores",
        "tiendas",
        "unidades",
        "tipoConsumo",
        "receptorCobrador",
        "puntosRecogida",
    ] as const).forEach(check);

    return errors.length === 0 ? {ok: true} : {ok: false, errors};
}
