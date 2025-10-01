import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { getUiForEntity } from "../../lib/ui/facade";

// 8 tablas del Tab Selectores (NO existe entidad “selectores”)
type Kind =
    | "comerciales"
    | "metodosPago"
    | "pagadores"
    | "tiendas"
    | "unidades"
    | "tipoConsumo"
    | "receptorCobrador"
    | "puntosRecogida";

const KINDS: Kind[] = [
    "comerciales",
    "metodosPago",
    "pagadores",
    "tiendas",
    "unidades",
    "tipoConsumo",
    "receptorCobrador",
    "puntosRecogida",
];

type Row = {
    id: string;
    nombre: string;
    isActive: boolean;
    notas?: string;
    [k: string]: unknown;
};

type Column = { key: string; header: string; isHidden?: boolean; width?: string | number };

// ---- helpers mínimos ----
function titleFromKind(kind: Kind): string {
    const map: Record<Kind, string> = {
        comerciales: "Comerciales",
        metodosPago: "Métodos de pago",
        pagadores: "Pagadores",
        tiendas: "Tiendas",
        unidades: "Unidades",
        tipoConsumo: "Tipo de consumo",
        receptorCobrador: "Receptor/Cobrador",
        puntosRecogida: "Puntos de recogida",
    };
    return map[kind];
}

function capitalize(s: string): string {
    return s ? s[0].toUpperCase() + s.slice(1) : s;
}

function deriveColumnsFromRows(rows: Row[]): Column[] {
    // Ordena y oculta "notas" por defecto
    const keys = new Set<string>(["isActive", "nombre", "notas"]);
    rows.slice(0, 5).forEach((r) => Object.keys(r).forEach((k) => keys.add(k)));
    return [...keys].map((k) => ({
        key: k,
        header: k === "isActive" ? "Activo" : k === "nombre" ? "Nombre" : capitalize(k),
        isHidden: k === "notas",
    }));
}

function normalizeList(kind: Kind, eventId: string): { title: string; rows: Row[]; columns: Column[] } {
    try {
        const ui = getUiForEntity(kind, { eventId }) as
            | {
            list?:
                | Row[]
                | {
                title?: string;
                rows?: Row[];
                columns?: Column[];
            };
        }
            | undefined;

        if (ui?.list) {
            if (Array.isArray(ui.list)) {
                const rows = ui.list as Row[];
                return { title: titleFromKind(kind), rows, columns: deriveColumnsFromRows(rows) };
            }
            const l = ui.list as { title?: string; rows?: Row[]; columns?: Column[] };
            const rows = Array.isArray(l.rows) ? l.rows : [];
            const columns =
                (Array.isArray(l.columns) && l.columns.length > 0 && l.columns) || deriveColumnsFromRows(rows);
            return { title: l.title || titleFromKind(kind), rows, columns };
        }
    } catch {
        // Si getUiForEntity lanza, seguimos con fallback.
    }

    // Fallback duro si no hay list:
    return {
        title: titleFromKind(kind),
        rows: [],
        columns: [
            { key: "isActive", header: "Activo" },
            { key: "nombre", header: "Nombre" },
            { key: "notas", header: "Notas", isHidden: true },
        ],
    };
}

// ---- Página ----
export default function SelectoresPage(): JSX.Element {
    const params = useParams<{ eventId: string }>();
    const eventId = params.eventId ?? "";

    const blocks = useMemo(() => KINDS.map((kind) => ({ kind, ...normalizeList(kind, eventId) })), [eventId]);

    return (
        <div className="container mx-auto px-3 py-4 space-y-8">
            <header>
                <h2 className="text-xl font-semibold">Selectores</h2>
                <p className="text-sm opacity-80">Administración de las 8 mini-tablas del evento.</p>
            </header>

            {blocks.map(({ kind, title, rows, columns }) => {
                const visibleCols = columns.filter((c) => !c.isHidden);
                return (
                    <section key={kind} className="border rounded-lg p-3 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{title}</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="text-left">
                                    {visibleCols.map((c) => (
                                        <th key={c.key} className="py-2 font-semibold" style={{ width: c.width }}>
                                            {c.header}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {rows.length === 0 && (
                                    <tr>
                                        <td className="py-6 text-center opacity-70" colSpan={visibleCols.length}>
                                            No hay resultados
                                        </td>
                                    </tr>
                                )}
                                {rows.map((row) => (
                                    <tr key={row.id} className="border-t">
                                        {visibleCols.map((c) => {
                                            const v = (row as Record<string, unknown>)[c.key];
                                            let content: React.ReactNode = "—";
                                            if (c.key === "isActive") {
                                                content = row.isActive ? (
                                                    <span className="px-2 py-0.5 rounded bg-green-100">Activo</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded bg-gray-200">Inactivo</span>
                                                );
                                            } else if (v != null && v !== "") {
                                                content = String(v);
                                            }
                                            return (
                                                <td key={c.key} className="py-2 align-top">
                                                    {content}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
