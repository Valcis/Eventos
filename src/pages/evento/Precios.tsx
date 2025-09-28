import React, {useEffect, useMemo, useState} from 'react';
import DataTable from '../../components/ui/DataTable';
import type {SortState} from '../../components/ui/DataTable/types';
import Pagination from '../../components/ui/DataTable/Pagination';
import FilterBar from '../../components/ui/FilterBar/FilterBar';
import type {FilterValues, FilterField} from '../../components/ui/FilterBar/types';
import {defaultCompare, getDirectionMultiplier, stableSort} from '../../lib/utils';
import {preciosColumns, type PrecioItem} from '../../lib/tables/precios.columns';

const MIN_ROWS_FOR_PAGINATION = 6; // aparece paginación si hay > 5 filas

/**
 * Vista del tab "Precios" (capa visual). Los datos se inyectan localmente o por futura integración.
 */
export default function Precios() {
    // TODO: Integrar con fuente real de datos. Por ahora, array vacío para no romper.
    const [rows] = useState<PrecioItem[]>([]);
    const [filters, setFilters] = useState<FilterValues>({});
    const [sort, setSort] = useState<SortState>({columnId: null, direction: null});
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false); // por defecto ocultos
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    // Definición de campos filtrables (se puede mover a config si se reutiliza fuera)
    const filterFields = useMemo<FilterField<PrecioItem>[]>(
        () => [
            {id: 'nombre', label: 'Nombre', type: 'text'},
            {id: 'categoria', label: 'Categoría', type: 'select', options: []},
            {id: 'moneda', label: 'Moneda', type: 'select', options: []},
            {id: 'importe', label: 'Importe mínimo', type: 'number'},
            {id: 'isActivo', label: 'Activo', type: 'boolean'},
        ],
        [],
    );

    // Valores derivados para selects (categoría/moneda) a partir de los datos
    const dynamicSelects = useMemo(() => {
        const categorias = Array.from(new Set(rows.map((r) => r.categoria))).sort();
        const monedas = Array.from(new Set(rows.map((r) => r.moneda))).sort();
        return {
            categorias: categorias.map((c) => ({label: c, value: c})),
            monedas: monedas.map((m) => ({label: m, value: m})),
        };
    }, [rows]);

    // Inyectar opciones dinámicas en los fields (sin re-crear referencias)
    const effectiveFields = useMemo(
        () =>
            filterFields.map((f) => {
                if (f.id === 'categoria') return {...f, options: dynamicSelects.categorias};
                if (f.id === 'moneda') return {...f, options: dynamicSelects.monedas};
                return f;
            }),
        [filterFields, dynamicSelects],
    );

    // Pipeline: filtros → orden → paginación
    const filtered = useMemo(() => {
        return rows.filter((r) => {
            // nombre (contains)
            const nombre = String(filters['nombre'] ?? '')
                .trim()
                .toLowerCase();
            if (nombre && !r.nombre.toLowerCase().includes(nombre)) return false;
            // categoria (equals)
            const cat = String(filters['categoria'] ?? '');
            if (cat && r.categoria !== cat) return false;
            // moneda (equals)
            const mon = String(filters['moneda'] ?? '');
            if (mon && r.moneda !== mon) return false;
            // importe mínimo (gte)
            const min = filters['importe'];
            if (typeof min === 'number' && r.importe < min) return false;
            // activo (equals)
            const act = filters['isActivo'];
            if (typeof act === 'boolean' && r.isActivo !== act) return false;
            return true;
        });
    }, [rows, filters]);

    const sorted = useMemo(() => {
        if (!sort.columnId || !sort.direction) return filtered;
        const col = preciosColumns.find((c) => String(c.id) === sort.columnId);
        if (!col) return filtered;
        const dir = getDirectionMultiplier(sort.direction);
        return stableSort(filtered, (a, b) => {
            if (col.sortFn) return col.sortFn(a, b, sort.direction!);
            const getVal = (row: PrecioItem) =>
                col.accessor
                    ? col.accessor(row)
                    : // usamos la id de la columna como key del row
                    (row)[col.id as keyof PrecioItem];

            const va = getVal(a);
            const vb = getVal(b);

            return defaultCompare(va, vb) * dir;
        });
    }, [filtered, sort]);

    const paged = useMemo(() => {
        const start = (page - 1) * pageSize;
        return sorted.slice(start, start + pageSize);
    }, [sorted, page, pageSize]);

    // Reset de página al cambiar filtros/orden
    useEffect(() => setPage(1), [filters, sort]);

    const shouldShowPagination = filtered.length >= MIN_ROWS_FOR_PAGINATION;

    return (
        <div className="space-y-4">
            {/* Toolbar con título + botón para mostrar/ocultar filtros */}

            <FilterBar<PrecioItem>
                title="Filtros de Precios"
                fields={effectiveFields}
                values={filters}
                onChange={setFilters}
                isInline
                isCollapsible
                isOpen={isFiltersOpen}
                onToggle={setIsFiltersOpen}
            />

            {/* Card de la tabla */}
            <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200">
                    <h3 className="text-base font-semibold text-zinc-800">
                        Precios <span className="text-sm font-normal text-zinc-500">({filtered.length})</span>
                    </h3>
                    <button
                        type="button"
                        className="text-sm px-3 py-2 rounded-xl border border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                        onClick={() => {
                            // Llama aquí a tu modal existente
                            // ej: openPrecioModal();
                        }}
                    >
                        Crear
                    </button>
                </div>

                <DataTable<PrecioItem>
                    rows={paged}
                    columns={preciosColumns}
                    sort={sort}
                    onSortChange={setSort}
                    emptyState={<span>No hay precios que coincidan con los filtros.</span>}
                />
            </div>

            {shouldShowPagination && (
                <Pagination
                    page={page}
                    pageSize={pageSize}
                    total={filtered.length}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                />
            )}
        </div>
    );
}
