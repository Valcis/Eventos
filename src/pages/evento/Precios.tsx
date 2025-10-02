// src/pages/evento/Precios.tsx
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DataTable from "../../components/ui/DataTable";
import type { ColumnDef, SortState } from "../../components/ui/DataTable/types";
import FilterBar from "../../components/ui/FilterBar/FilterBar";
import type { FilterValues } from "../../components/ui/FilterBar/types";
import { getUiForEntity } from "../../lib/ui/facade";
import type { UiProjection } from "../../lib/ui/contracts";
import { useCrud } from "../../lib/useLocalRepo";
import type { Precio } from "../../lib/precios/types";

function asColumnDef(rc: UiProjection["columns"][number]): ColumnDef<Precio> {
    return {
        id: rc.column,
        header: rc.label,
        accessor: (row) => (row as Record<string, unknown>)[rc.column],
        align: rc.align ?? "left",
        isSortable: rc.sortable,
    };
}

function applyFilters(rows: readonly Precio[], filters: FilterValues): Precio[] {
    const entries = Object.entries(filters);
    if (entries.length === 0) return rows.slice();
    return rows.filter((row) =>
        entries.every(([key, val]) => {
            const v = (row as unknown as Record<string, unknown>)[key];
            if (val === "" || val === null || typeof val === "undefined") return true;
            if (typeof val === "number") return Number(v) === val;
            if (typeof val === "boolean") return Boolean(v) === val;
            if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
                const iso = String(v ?? "");
                return iso.startsWith(val);
            }
            const left = String(v ?? "").toLowerCase();
            const right = String(val).toLowerCase();
            return left.includes(right);
        })
    );
}

export default function Precios(): JSX.Element {
    const { id: eventoId } = useParams<{ id: string }>();
    const { items } = useCrud<Precio>("precios");

    const ui = useMemo(() => getUiForEntity("precios", "compact"), []);
    const columns: ReadonlyArray<ColumnDef<Precio>> = useMemo(
        () => ui.columns.map(asColumnDef),
        [ui.columns]
    );

    const [filters, setFilters] = useState<FilterValues>({});
    const filteredByEvent = useMemo(
        () => items.filter((p) => p.eventoId === eventoId),
        [items, eventoId]
    );
    const filteredRows = useMemo(
        () => applyFilters(filteredByEvent, filters),
        [filteredByEvent, filters]
    );

    const [sort, setSort] = useState<SortState>({ columnId: null, direction: null });

    return (
        <div className="space-y-4">
            <FilterBar fields={ui.filters} values={filters} onChange={setFilters} title="Filtros de precios" />
            <DataTable<Precio>
                rows={filteredRows}
                columns={columns}
                sort={sort}
                onSortChange={setSort}
                density="compact"
                emptyState={<span className="text-gray-500">No hay precios</span>}
            />
        </div>
    );
}
