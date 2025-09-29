// Asegúrate de que en el bootstrap UI se registren schemas y presets de "gastos":
import '../../lib/gastos/schemas';      // registerSchema('gastos', GastoUpsertSchema)
import '../../lib/gastos/presets';          // (opcional) registerTablePreset/getSearchPreset


import React, {useMemo, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import DataTable from '../../components/ui/DataTable';
import FilterBar from '../../components/ui/FilterBar/FilterBar';

// Autoconfiguración dinámica desde schema + preset

import {FilterField, FilterValues} from "../../components/ui/FilterBar/types";



type Row = Record<string, unknown>;

function readGastos(): Row[] {
    try {
        const raw = localStorage.getItem('gastos');
        if (!raw) return [];
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? (arr as Row[]) : [];
    } catch {
        return [];
    }
}

export default function Gastos(): JSX.Element {
    const [params] = useSearchParams();
    const eventIdParam = params.get('eventId') ?? undefined;

    // Datos
    const all = useMemo(() => readGastos(), []);
    const rows = useMemo<Row[]>(() => {
        if (!eventIdParam) return all;
        return all.filter(r => String(r.eventoId ?? '') === eventIdParam);
    }, [all, eventIdParam]);

    // Props dinámicos para tus componentes
    const columns = useMemo(() => buildDataTableColumnsFor('gastos'), []);
    const filterFields = useMemo(() => buildFilterFieldsFor('gastos'), []);
    console.log("filterFields: ", filterFields)

    // Estado de filtros
    const [query, setQuery] = useState<FilterValues>({});


    // Filtrado simple (texto contiene / booleano exacto / number igual)
    const filteredRows = useMemo<Row[]>(() => {
        return rows.filter(r =>
            Object.entries(query).every(([k, v]) => {
                if (v == null || v === '') return true;
                const cell = r[k];
                if (typeof v === 'boolean') return cell === v;
                if (typeof v === 'number') return Number(cell) === v;
                return String(cell ?? '').toLowerCase().includes(String(v).toLowerCase());
            })
        );
    }, [rows, query]);



    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Gastos</h2>
                {eventIdParam && <span className="text-xs text-gray-500">Evento: {eventIdParam}</span>}
            </div>

            <FilterBar fields={filterFields} values={query} onChange={setQuery} title="Filtros" isCollapsible />;


            <DataTable columns={columns} rows={filteredRows}/>
        </div>
    );
}
