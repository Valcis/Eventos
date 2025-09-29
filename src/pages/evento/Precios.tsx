import React, {useMemo, useState} from 'react';
import FilterBar from '../../components/ui/FilterBar/FilterBar';
import DataTable from '../../components/ui/DataTable';
import type {SortState} from '../../components/ui/DataTable/types';
import {preciosPreset as preset} from '../../lib/precios/presets';
import type {Precio} from '../../lib/precios/types';
import {useToast} from '../../components/ui/Toast/useToast';
import {useAlertConfirm} from '../../components/ui/AlertConfirm/useAlertConfirm';

export default function PreciosPage(): JSX.Element {
    const [densityMode, setDensityMode] = useState<'detailed' | 'simple'>('detailed');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(preset.defaultPageSize ?? 10);
    const [sort, setSort] = useState<SortState>(preset.defaultSort ?? {columnId: null, direction: null});
    const [filters, setFilters] = useState<Record<string, unknown>>({q: ''});

    const rows: Precio[] = []; // TODO: datos reales

    const columns = useMemo(
        () => (densityMode === 'detailed' ? preset.columnsDetailed : (preset.columnsSimple ?? preset.columnsDetailed.filter(c => c.isSimpleKey))),
        [densityMode],
    );

    const {showToast} = useToast();
    const {confirm} = useAlertConfirm();

    async function onCreate() {
        showToast({type: 'info', message: 'Abrir modal de creación (Precio)'});
    }

    async function onInfo(row: Precio) {
        showToast({type: 'default', message: `Info: ${row.concepto}`});
    }

    async function onEdit(row: Precio) {
        showToast({type: 'default', message: `Editar: ${row.concepto}`});
    }

    async function onDelete(row: Precio) {
        const ok = await confirm({title: 'Borrar precio', description: '¿Seguro que quieres borrar este precio?'});
        if (ok) showToast({type: 'success', message: 'Precio eliminado'});
    }

    async function onBlock(row: Precio) {
        const ok = await confirm({title: 'Bloquear precio', description: '¿Seguro que quieres bloquear este precio?'});
        if (ok) showToast({type: 'success', message: 'Precio bloqueado'});
    }

    return (
        <>
            <FilterBar fields={preset.filters} values={filters} onChange={setFilters}
                       onClear={() => setFilters({q: ''})} isCollapsible/>
            <DataTable<Precio>
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
                emptyState="Sin precios"
            />
        </>
    );
}
