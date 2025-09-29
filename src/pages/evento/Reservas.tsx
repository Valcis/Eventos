// src/pages/evento/Reservas.tsx
import React, {useMemo, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import DataTable from '../../components/ui/DataTable';
import {FilterBar} from '../../components/ui/FilterBar/FilterBar';

// 🔗 Utilidades de autoconfiguración (generadas en shared/ui/adapters)
import {buildDataTableColumnsFor, buildFilterFieldsFor} from '../../lib/shared/ui/adapters/autoConfig';

// 📌 Asegúrate de que en el bootstrap de UI se hayan registrado schemas y presets:
//   import '../../lib/reservas/schemas';          // registerSchema('reservas', ReservaUpsertSchema)
//   import '../../lib/reservas/presets/register'; // (opcional) presets de tabla/búsqueda

// ✅ Leemos datos de localStorage como en el resto de taps (sin alias)
function readReservas(): Record<string, unknown>[] {
    try {
        const raw = localStorage.getItem('reservas');
        if (!raw) return [];
        const arr = JSON.parse(raw) as unknown;
        return Array.isArray(arr) ? (arr as Record<string, unknown>[]) : [];
    } catch {
        return [];
    }
}

export default function Reservas(): JSX.Element {
    const [params] = useSearchParams();
    const eventIdParam = params.get('eventId') ?? undefined;

    // Datos (filtrados por evento si llega el parámetro)
    const all = useMemo(() => readReservas(), []);
    const rows = useMemo(() => {
        if (!eventIdParam) return all;
        return all.filter(r => String(r.eventoId ?? '') === eventIdParam);
    }, [all, eventIdParam]);

    // 🔧 Autoconfiguración 100% dinámica desde el schema (más preset si existe)
    const columns = useMemo(() => buildDataTableColumnsFor('reservas'), []);
    const filterFields = useMemo(() => buildFilterFieldsFor('reservas'), []);

    // Estado del buscador (clave → valor)
    const [query, setQuery] = useState<Record<string, unknown>>({});

    // Filtro simple (texto contiene / booleano exacto / number =)
    const filteredRows = useMemo(() => {
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
                <h2 className="text-lg font-semibold">Reservas</h2>
                {eventIdParam && (
                    <span className="text-xs text-gray-500">Evento: {eventIdParam}</span>
                )}
            </div>

            {/* 🔎 FilterBar dinámico (lee todo del schema/preset) */}
            <FilterBar
                fields={filterFields}
                value={query}
                onChange={setQuery}
            />

            {/* 📋 DataTable dinámico (columnas desde schema/preset) */}
            <DataTable
                columns={columns}
                rows={filteredRows}
            />
        </div>
    );
}
