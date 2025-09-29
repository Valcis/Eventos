import React, {useMemo, useState} from 'react';
import FilterBar from '../../components/ui/FilterBar/FilterBar';
import DataTable from '../../components/ui/DataTable';
import type {SortState} from '../../components/ui/DataTable/types';
import {presets} from '../../lib/presets';
import {useToast} from '../../components/ui/Toast/useToast';
import {useAlertConfirm} from '../../components/ui/AlertConfirm/useAlertConfirm';
import type {Gasto} from '../../lib/shared/types';

export default function GastosPage(): JSX.Element {
    const preset = presets.gastos;

    const [densityMode, setDensityMode] = useState<'detailed' | 'simple'>('detailed');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(preset.defaultPageSize ?? 20);
    const [sort, setSort] = useState<SortState>(preset.defaultSort ?? {columnId: null, direction: null});

    const [filters, setFilters] = useState<Record<string, unknown>>({q: ''});

    // TODO: trae tus datos reales y aplica filtros/orden/paginación en servidor o aquí
    const rows: Gasto[] = [];

    const columns = useMemo(
        () => (densityMode === 'detailed' ? preset.columnsDetailed : (preset.columnsSimple ?? preset.columnsDetailed.filter(c => c.isSimpleKey))),
        [preset, densityMode],
    );

    const {showToast} = useToast();
    const {confirm} = useAlertConfirm();

    async function onCreate() {
        // TODO: abrir modal real (con preset.formSchema)
        showToast({type: 'info', message: 'Abrir modal de creación (Gasto)'});
    }

    async function onInfo(row: Gasto) {
        showToast({type: 'default', message: `Info: ${row.producto}`});
    }

    async function onEdit(row: Gasto) {
        showToast({type: 'default', message: `Editar: ${row.producto}`});
    }

    async function onDelete(row: Gasto) {
        const ok = await confirm({title: 'Borrar gasto', description: '¿Seguro que quieres borrar este gasto?'});
        if (!ok) return;
        // TODO: delete API
        showToast({type: 'success', message: 'Gasto eliminado'});
    }

    async function onBlock(row: Gasto) {
        const ok = await confirm({title: 'Bloquear gasto', description: '¿Seguro que quieres bloquear este gasto?'});
        if (!ok) return;
        // TODO: block API
        showToast({type: 'success', message: 'Gasto bloqueado'});
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <FilterBar<Gasto>
                fields={preset.filters}
                values={filters}
                onChange={(v) => setFilters(v)}
                onSearch={() => { /* aplica filtros */
                }}
                onClear={() => setFilters({q: ''})}
                isCollapsible
                // El selector de vista ahora está en la tabla (botón centro); si lo quisieras en la barra, ver FilterBar.tsx
            />

            {/* Tabla */}
            <DataTable<Gasto>
                rows={rows}
                columns={columns}
                sort={sort}
                onSortChange={setSort}
                densityMode={densityMode}
                showDensityToggle     // muestra botón de vista en el centro
                onCreate={onCreate}   // botón crear a la derecha
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                renderActions={(row) => (
                    <div className="flex gap-2 whitespace-nowrap">
                        <button className="icon-btn" onClick={() => onInfo(row)} aria-label="Info">ℹ️</button>
                        <button className="icon-btn" onClick={() => onEdit(row)} aria-label="Editar">✏️</button>
                        <button className="icon-btn" onClick={() => onDelete(row)} aria-label="Borrar">🗑️</button>
                        <button className="icon-btn" onClick={() => onBlock(row)} aria-label="Bloquear">⛔</button>
                    </div>
                )}
                emptyState="Sin gastos"
            />
        </div>
    );
}
