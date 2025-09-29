
import React, { useMemo, useState } from 'react';
import FilterBar from '../../components/ui/FilterBar/FilterBar';
import DataTable from '../../components/ui/DataTable';
import type { SortState } from '../../components/ui/DataTable/types';
import { gastosPreset as preset } from '../../lib/gastos/presets';
import type { Gasto } from '../../lib/gastos/types';
import { useToast } from '../../components/ui/Toast/useToast';
import { useAlertConfirm } from '../../components/ui/AlertConfirm/useAlertConfirm';

export default function GastosPage(): JSX.Element {
    const [densityMode, setDensityMode] = useState<'detailed' | 'simple'>('detailed');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(preset.defaultPageSize ?? 20);
    const [sort, setSort] = useState<SortState>(preset.defaultSort ?? { columnId: null, direction: null });
    const [filters, setFilters] = useState<Record<string, unknown>>({ q: '' });

    const rows: Gasto[] = []; // TODO: trae datos reales

    const columns = useMemo(
        () => (densityMode === 'detailed' ? preset.columnsDetailed : (preset.columnsSimple ?? preset.columnsDetailed.filter(c => c.isSimpleKey))),
        [densityMode],
    );

    const { showToast } = useToast();
    const { confirm } = useAlertConfirm();

    async function onCreate() { showToast({ type: 'info', message: 'Abrir modal de creación (Gasto)' }); }
    async function onInfo(row: Gasto) { showToast({ type: 'default', message: `Info: ${row.producto}` }); }
    async function onEdit(row: Gasto) { showToast({ type: 'default', message: `Editar: ${row.producto}` }); }
    async function onDelete(row: Gasto) {
        const ok = await confirm({ title: 'Borrar gasto', description: '¿Seguro que quieres borrar este gasto?' });
        if (ok) showToast({ type: 'success', message: 'Gasto eliminado' });
    }
    async function onBlock(row: Gasto) {
        const ok = await confirm({ title: 'Bloquear gasto', description: '¿Seguro que quieres bloquear este gasto?' });
        if (ok) showToast({ type: 'success', message: 'Gasto bloqueado' });
    }

    return (
        <>
            <FilterBar fields={preset.filters} values={filters} onChange={setFilters} onClear={() => setFilters({ q: '' })} isCollapsible />
            <DataTable<Gasto>
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
                emptyState="Sin gastos"
            />
        </>
    );
}
