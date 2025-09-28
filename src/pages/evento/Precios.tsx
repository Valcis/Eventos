import React, {useEffect, useMemo, useState, FormEvent} from 'react';
import {useParams} from 'react-router-dom';
import DataTable from '../../components/ui/DataTable';
import type {SortState, ColumnDef} from '../../components/ui/DataTable/types';
import FilterBar from '../../components/ui/FilterBar/FilterBar';
import type {FilterValues, FilterField} from '../../components/ui/FilterBar/types';
import {defaultCompare, getDirectionMultiplier, stableSort} from '../../lib/utils';
import {preciosColumns, type PrecioItem} from '../../lib/tables/precios.columns';
import Pagination from '../../components/ui/DataTable/Pagination';
import IconButton from '../../components/ui/IconButton';
import { Info, Pencil, Trash2, Plus } from 'lucide-react';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import {useCrud} from '../../lib/crud';
import type {Precio, ID} from '../../types';

// La paginación se oculta automáticamente si total <= 5 (TablePaginator)

/**
 * Vista del tab "Precios" (capa visual). Los datos se inyectan localmente o por futura integración.
 */
export default function Precios() {
    const {id: eventoId} = useParams<{ id: ID }>();
    const crud = useCrud<Precio>('precios');
    const [filters, setFilters] = useState<FilterValues>({});
    const [sort, setSort] = useState<SortState>({columnId: null, direction: null});
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(true); // por defecto visibles
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // Definición de campos filtrables (se puede mover a config si se reutiliza fuera)
    const filterFields = useMemo<FilterField<PrecioItem>[]>(
        () => [
            {id: 'nombre', label: 'Nombre', type: 'text'},
            {id: 'categoria', label: 'Categoría', type: 'select', options: []},
            {id: 'moneda', label: 'Moneda', type: 'select', options: []},
            {id: 'importe', label: 'Importe mínimo', type: 'number'},
            {id: 'isActivo', label: 'Activo', type: 'boolean'},
            {id: 'actualizadoEl', label: 'Actualizado', type: 'date'},
        ],
        [],
    );

    // Datos base desde CRUD, filtrados por evento
    const rawRows = useMemo(() => crud.items.filter((p) => p.eventoId === eventoId), [crud.items, eventoId]);

    // Adaptamos a PrecioItem para reutilizar columnas existentes
    const rows: PrecioItem[] = useMemo(() => {
        return rawRows.map((p) => ({
            id: p.id,
            nombre: p.concepto, // mapeamos "concepto" -> "nombre"
            categoria: '',
            importe: p.importe,
            moneda: 'EUR',
            isActivo: p.isActive,
            actualizadoEl: p.updatedAt,
        }));
    }, [rawRows]);

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
            // actualizadoEl (date equals yyyy-mm-dd)
            const dateVal = String(filters['actualizadoEl'] ?? '');
            if (dateVal) {
                const rowDate = new Date(r.actualizadoEl).toISOString().slice(0, 10);
                if (rowDate !== dateVal) return false;
            }
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

    // Columna de acciones usando el DataTable existente (sin renderActions)
    const columns = useMemo<Array<ColumnDef<PrecioItem>>>(() => {
        const actionsCol: ColumnDef<PrecioItem> = {
            id: 'actions',
            header: 'Acciones',
            accessor: () => null,
            align: 'right',
            width: 120,
            cell: (_v, row) => (
                <div className="flex items-center justify-end gap-1">
                    <IconButton ariaLabel="Ver" size="xs" onClick={() => { /* TODO: view */ }}>
                        <Info size={13} />
                    </IconButton>
                    <IconButton ariaLabel="Editar" size="xs" onClick={() => { /* TODO: edit */ }}>
                        <Pencil size={13} />
                    </IconButton>
                    <IconButton ariaLabel="Eliminar" size="xs" className="border-red-200 text-red-600" onClick={() => crud.remove(row.id)}>
                        <Trash2 size={13} />
                    </IconButton>
                </div>
            ),
        };
        return [...preciosColumns, actionsCol];
    }, [crud]);

    const columnsCount = columns.length;

    // Reset de página al cambiar filtros/orden
    useEffect(() => setPage(1), [filters, sort]);

    function openCreateModal() { setIsModalOpen(true); }
function closeModal() { setIsModalOpen(false); }
function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!eventoId) return;
    const fd = new FormData(e.currentTarget);
    const concepto = String(fd.get('concepto') ?? '').trim();
    const importe = Number(fd.get('importe') ?? 0);
    if (!concepto) { alert('Ingrese un concepto'); return; }
    if (Number.isNaN(importe)) { alert('Importe inválido'); return; }
    crud.create({ eventoId, concepto, importe });
    closeModal();
    e.currentTarget.reset();
}

return (
        <div className="space-y-4">
        {/* Buscador */}
        <section className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
            <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-200">
                <h3 className="text-base font-semibold text-zinc-800">Buscador</h3>
                <button
                    type="button"
                    className="text-sm px-3 py-2 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                    onClick={() => setIsFiltersOpen((v) => !v)}
                    aria-expanded={isFiltersOpen}
                >
                    {isFiltersOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
                </button>
            </header>
            <div className="p-3">
                {isFiltersOpen && (
                    <>
                        <FilterBar<PrecioItem>
                            title="Filtros de Precios"
                            fields={effectiveFields}
                            values={filters}
                            onChange={setFilters}
                            isInline
                            isCollapsible={false}
                            isOpen
                        />
                        <div className="mt-3 flex items-center gap-2">
                            <button type="button" className="btn btn-primary btn-sm">
                                Buscar
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm"
                                onClick={() => setFilters({})}
                            >
                                Limpiar filtro
                            </button>
                        </div>
                    </>
                )}
            </div>
        </section>

        {/* Tabla */}
        <section className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
            <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-200">
                <h3 className="text-base font-semibold text-zinc-800">{`Tabla de Precios (${columnsCount})`}</h3>
                <button type="button" className="inline-flex items-center gap-1 text-sm px-3 py-2 rounded-xl border border-indigo-500 text-indigo-600 hover:bg-indigo-50" onClick={openCreateModal}>
                    <Plus size={16} />
                    Crear
                </button>
            </header>
            <div className="p-3">
                <DataTable<PrecioItem>
                    rows={paged}
                    columns={columns}
                    sort={sort}
                    onSortChange={setSort}
                    emptyState={<span>No hay precios que coincidan con los filtros.</span>}
                    density="normal"
                />
            </div>
            {filtered.length > 5 && (
                <div className="px-4 py-3">
                    <Pagination
                        page={page}
                        pageSize={pageSize}
                        total={filtered.length}
                        onPageChange={setPage}
                        onPageSizeChange={setPageSize}
                    />
                </div>
            )}
        </section>

        <Modal
            title="Nuevo precio"
            isOpen={isModalOpen}
            onClose={closeModal}
            isCloseOnEsc
            isCloseOnBackdrop
        >
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField label="Concepto">
                        <input name="concepto" className="input w-full" required />
                    </FormField>
                    <FormField label="Importe">
                        <input name="importe" type="number" step="0.01" min="0" className="input w-full" required />
                    </FormField>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <button type="button" className="btn" onClick={closeModal}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Guardar</button>
                </div>
            </form>
        </Modal>
        </div>
    );
}
