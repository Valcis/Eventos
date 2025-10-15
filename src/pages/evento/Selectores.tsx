// src/pages/evento/Selectores.tsx
import React from "react";
import {useParams} from "react-router-dom";
import SelectorsCard from "../../components/SelectorsCard";
import type {ColumnDef} from "../../components/ui/DataTable/types";
import {getUiForEntity, type Entity} from "../../lib/ui/facade";

type Kind =
    | "comerciales"
    | "metodosPago"
    | "pagadores"
    | "tiendas"
    | "unidades"
    | "tipoConsumo"
    | "receptorCobrador"
    | "puntosRecogida";

const KINDS: ReadonlyArray<Kind> = [
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

function kindToTitle(kind: Kind): string {
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

// Adaptador ResolvedColumn → ColumnDef<Row>, con fallback requireReceptor/requiereReceptor
function toColumnDef(rc: { column: string; label: string; align?: "left" | "center" | "right" }): ColumnDef<Row> {
    return {
        id: rc.column,
        header: rc.label,
        accessor: (row) => {
            if (rc.column === "requireReceptor") {
                const a = (row as Record<string, unknown>)["requireReceptor"];
                const b = (row as Record<string, unknown>)["requiereReceptor"];
                return typeof a === "boolean" ? a : typeof b === "boolean" ? b : undefined;
            }
            return (row as Record<string, unknown>)[rc.column];
        },
        align: rc.align ?? "left",
        isSortable: true,
    };
}

export default function SelectoresPage(): JSX.Element {
    const params = useParams<{ eventId: string }>();
    const eventId = params.eventId ?? "";

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-xl font-semibold">Selectores</h2>
                <p className="text-sm text-gray-600">Administración de los Selectores.</p>
            </header>

            {/* Grid 3 columnas (xl) → 2 columnas (sm/md). 3×3 → 2×4 con 8 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {KINDS.map((kind) => {
                    // 1) columnas desde UI (vista compact para card)
                    const ui = getUiForEntity(kind as unknown as Entity, "compact");

                    console.log("selectores ui", ui);
                    const columns: ReadonlyArray<ColumnDef<Row>> = ui.columns.map((c) => toColumnDef(c));

                    // 2) filas desde localdb para este evento y kind
                    const rows: ReadonlyArray<Row> = eventId
                        ? (getSelectors(eventId, kind as unknown as SelectorKind) as Row[])
                        : [];

                    return (
                        <SelectorsCard<Row>
                            key={kind}
                            title={kindToTitle(kind)}
                            columns={columns}
                            rows={rows}
                        />
                    );
                })}
            </div>
        </div>
    );
}
