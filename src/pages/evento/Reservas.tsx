import React, {useMemo, useState} from 'react';
import FilterBar from '../../components/ui/FilterBar/FilterBar';
import DataTable from '../../components/ui/DataTable';
import type {SortState} from '../../components/ui/DataTable/types';
import {reservasPreset as preset} from '../../lib/reservas/presets';
import type {Reserva} from '../../lib/reservas/types';
import {useToast} from '../../components/ui/Toast/useToast';
import {useAlertConfirm} from '../../components/ui/AlertConfirm/useAlertConfirm';

export default function ReservasPage(): JSX.Element {
    const [densityMode, setDensityMode] = useState<'detailed' | 'simple'>('detailed');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(preset.defaultPageSize ?? 20);
    const [sort, setSort] = useState<SortState>(preset.defaultSort ?? {columnId: null, direction: null});
    const [filters, setFilters] = useState<Record<string, unknown>>({q: ''});

    const rows: Reserva[] = []; // TODO: datos reales

    const columns = useMemo(
        () => (densityMode === 'detailed' ? preset.columnsDetailed : (preset.columnsSimple ?? preset.columnsDetailed.filter(c => c.isSimpleKey))),
        [densityMode],
    );

    const {showToast} = useToast();
    const {confirm} = useAlertConfirm();

    async function onCreate() {
        showToast({type: 'info', message: 'Abrir modal de creación (Reserva)'});
    }

    async function onInfo(row: Reserva) {
        showToast({type: 'default', message: `Info: ${row.cliente}`});
    }

    async function onEdit(row: Reserva) {
        showToast({type: 'default', message: `Editar: ${row.cliente}`});
    }

    async function onDelete(row: Reserva) {
        const ok = await confirm({title: 'Borrar reserva', description: '¿Seguro que quieres borrar esta reserva?'});
        if (ok) showToast({type: 'success', message: 'Reserva eliminada'});
    }

    async function onBlock(row: Reserva) {
        const ok = await confirm({
            title: 'Bloquear reserva',
            description: '¿Seguro que quieres bloquear esta reserva?'
        });
        if (ok) showToast({type: 'success', message: 'Reserva bloqueada'});
    }

    return (
        <>
            <FilterBar fields={preset.filters} values={filters} onChange={setFilters}
                       onClear={() => setFilters({q: ''})} isCollapsible/>
            <DataTable<Reserva>
                rows={rows}
                columns={columns}
                sort={sort}
                onSortChange={setSort}
                densityMode={densityMode}
                showDensityToggle
                onCreate={onCreate}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                renderActions={(row) => (
                    <div className="flex gap-2">
                        <button onClick={() => onInfo(row)}>ℹ️</button>
                        <button onClick={() => onEdit(row)}>✏️</button>
                        <button onClick={() => onDelete(row)}>🗑️</button>
                        <button onClick={() => onBlock(row)}>⛔</button>
                    </div>
                )}
                emptyState="Sin reservas"
            />
        </>
    );
}
