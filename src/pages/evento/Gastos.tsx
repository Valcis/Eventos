import React, {FormEvent, ReactNode, useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';

import DataTable from '../../components/ui/DataTable';
import type {ColumnDef, SortState} from '../../components/ui/DataTable/types';

import Modal from '../../components/Modal';
import FormField from '../../components/FormField';

import {useCrud, type WithoutBase} from '../../lib/crud';
import type {Gasto, ID} from '../../types';
import {calcularGasto} from '../../lib/calculations/gastos';
import {getGastosView, setGastosView, type GastosView} from '../../lib/view/views';
import {GastoUpsertSchema} from '../../lib/validators';
import {formatCurrency} from '../../lib/format';

// Unificamos el tipo del valor de celda para evitar invariancia de genéricos
type GastoCell = string | number | boolean | null | undefined;

export default function Gastos(): JSX.Element {
    const {id: eventoId} = useParams<{ id: ID }>();
    const crud = useCrud<Gasto>('gastos');

    // ---------- estado UI ----------
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingRow, setEditingRow] = useState<Gasto | null>(null);
    const [view, setView] = useState<GastosView>(() =>
        eventoId ? getGastosView(eventoId) : 'simple'
    );
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [sortState, setSortState] = useState<SortState>({columnId: null, direction: null});

    // ---------- datos ----------
    const rowsForEvent = useMemo<Gasto[]>(
        () => crud.items.filter((row) => row.eventoId === eventoId),
        [crud.items, eventoId]
    );

    const filteredRows = useMemo<Gasto[]>(() => {
        const query = globalFilter.trim().toLowerCase();
        if (query === '') return rowsForEvent;
        return rowsForEvent.filter((row) => JSON.stringify(row).toLowerCase().includes(query));
    }, [rowsForEvent, globalFilter]);

    const displayedRows = useMemo<Gasto[]>(() => {
        const {columnId, direction} = sortState;
        if (!columnId || !direction) return filteredRows;

        const getComparableValue = (row: Gasto): unknown => {
            switch (columnId) {
                case 'producto':
                    return row.producto;
                case 'unidad':
                    return row.unidad;
                case 'cantidad':
                    return row.cantidad;
                case 'tipoPrecio':
                    return row.tipoPrecio;
                case 'tipoIVA':
                    return row.tipoIVA;
                case 'base':
                    return row.base;
                case 'iva':
                    return row.iva;
                case 'total':
                    return row.total;
                case 'isPack':
                    return row.isPack;
                case 'unidadesPack':
                    return row.unidadesPack;
                case 'precioUnidad':
                    return row.precioUnidad;
                case 'pagador':
                    return row.pagador;
                case 'tienda':
                    return row.tienda;
                case 'comprobado':
                    return row.comprobado;
                default:
                    return undefined;
            }
        };

        const compareRows = (leftRow: Gasto, rightRow: Gasto): number => {
            const leftValue = getComparableValue(leftRow);
            const rightValue = getComparableValue(rightRow);

            if (leftValue == null && rightValue == null) return 0;
            if (leftValue == null) return direction === 'asc' ? -1 : 1;
            if (rightValue == null) return direction === 'asc' ? 1 : -1;

            if (typeof leftValue === 'number' && typeof rightValue === 'number') {
                return direction === 'asc' ? leftValue - rightValue : rightValue - leftValue;
            }
            if (typeof leftValue === 'boolean' && typeof rightValue === 'boolean') {
                const leftAsNumber = Number(leftValue);
                const rightAsNumber = Number(rightValue);
                return direction === 'asc' ? leftAsNumber - rightAsNumber : rightAsNumber - leftAsNumber;
            }
            const leftAsString = String(leftValue);
            const rightAsString = String(rightValue);
            return direction === 'asc'
                ? leftAsString.localeCompare(rightAsString)
                : rightAsString.localeCompare(leftAsString);
        };

        return [...filteredRows].sort(compareRows);
    }, [filteredRows, sortState]);

    const totalAcumulado = useMemo<number>(
        () => rowsForEvent.reduce((sum, row) => sum + (row.total ?? 0), 0),
        [rowsForEvent]
    );

    // ---------- columnas (TODAS con GastoCell; sin anys, sin unknown en tu código) ----------
    const commonColumns: ColumnDef<Gasto>[] = [
        {id: 'producto', header: 'Producto', accessor: (row) => row.producto, isSortable: true, width: 220},
        {id: 'unidad', header: 'Unidad', accessor: (row) => row.unidad, width: 120},
        {
            id: 'cantidad',
            header: 'Cantidad',
            accessor: (row) => row.cantidad,
            align: 'right',
            isSortable: true,
            width: 110
        },
        {
            id: 'tipoPrecio',
            header: 'Precio',
            accessor: (row) => row.tipoPrecio,
            cell: (value) => (value === 'bruto' ? 'Bruto' : 'Neto'),
            width: 90,
        },
        {id: 'tipoIVA', header: 'IVA %', accessor: (row) => row.tipoIVA, align: 'right', width: 80},
        {
            id: 'base',
            header: 'Base',
            accessor: (row) => row.base,
            cell: (value) => formatCurrency(Number(value ?? 0)),
            align: 'right',
            isSortable: true,
            width: 120,
        },
        {
            id: 'iva',
            header: 'IVA',
            accessor: (row) => row.iva,
            cell: (value) => formatCurrency(Number(value ?? 0)),
            align: 'right',
            isSortable: true,
            width: 120,
        },
        {
            id: 'total',
            header: 'Total',
            accessor: (row) => row.total,
            cell: (value) => formatCurrency(Number(value ?? 0)),
            align: 'right',
            isSortable: true,
            width: 140,
        },
    ];

    const detailedOnly: ColumnDef<Gasto>[] = [
        {
            id: 'isPack',
            header: 'Pack',
            accessor: (row: Gasto) => row.isPack,
            cell: (value) => (value ? 'Sí' : 'No'),
            align: 'center',
            width: 80,
        },
        {
            id: 'unidadesPack',
            header: 'Unidades/Pack',
            accessor: (row: Gasto): number | undefined => row.unidadesPack,
            cell: (value: unknown, _row: Gasto): ReactNode => {
                const units = value as number | undefined;
                return units ?? '—';
            },
            align: 'right',
            width: 130,
        },
        {
            id: 'precioUnidad',
            header: '€/Unidad',
            accessor: (row) => row.precioUnidad,
            cell: (value) => (value != null ? formatCurrency(Number(value)) : '—'),
            align: 'right',
            width: 120,
        },
        {id: 'pagador', header: 'Pagador', accessor: (row) => row.pagador ?? '—', width: 140},
        {id: 'tienda', header: 'Tienda', accessor: (row) => row.tienda ?? '—', width: 140},
        {
            id: 'comprobado',
            header: 'OK',
            accessor: (row) => row.comprobado,
            cell: (value) => (value ? '✓' : '—'),
            align: 'center',
            width: 70,
        },
    ];

    const actionsColumn: ColumnDef<Gasto> = {
        id: 'actions',
        header: 'Acciones',
        accessor: () => null,
        cell: (_value, row) => {
            const isLocked = row.locked === true;
            return (
                <div className="flex gap-2 justify-end">
                    <button
                        type="button"
                        className="btn"
                        title={isLocked ? 'Desbloquear' : 'Bloquear'}
                        onClick={() => crud.update(row.id, {locked: !isLocked})}
                    >
                        {isLocked ? '🔓' : '🔒'}
                    </button>
                    <button
                        type="button"
                        className="btn"
                        disabled={isLocked}
                        onClick={() => {
                            if (!isLocked) {
                                setEditingRow(row);
                                setIsModalOpen(true);
                            }
                        }}
                    >
                        Editar
                    </button>
                    <button
                        type="button"
                        className="btn"
                        disabled={isLocked}
                        onClick={() => {
                            if (!isLocked) crud.remove(row.id);
                        }}
                    >
                        Borrar
                    </button>
                </div>
            );
        },
        align: 'right',
        width: 220,
    };

    const columns: Array<ColumnDef<Gasto>> = useMemo(() => {
        return view === 'simple'
            ? [...commonColumns, actionsColumn]
            : [...commonColumns, ...detailedOnly, actionsColumn];
    }, [view]); // columnas estáticas

    // ---------- handlers ----------
    const openCreateModal = (): void => {
        setEditingRow(null);
        setIsModalOpen(true);
    };

    const closeModal = (): void => {
        setIsModalOpen(false);
        setEditingRow(null);
    };

    function handleChangeView(next: GastosView): void {
        setView(next);
        if (eventoId) setGastosView(eventoId, next);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        if (!eventoId) return;

        const formData = new FormData(event.currentTarget);

        const producto = String(formData.get('producto') ?? '');
        const unidad = String(formData.get('unidad') ?? '');
        const cantidad = Number(formData.get('cantidad') ?? 0);
        const tipoPrecio = String(formData.get('tipoPrecio') ?? 'bruto') as Gasto['tipoPrecio'];
        const tipoIVA = Number(formData.get('tipoIVA') ?? 21);

        const totalEntry = formData.get('total');
        const baseEntry = formData.get('base');

        const calculado =
            tipoPrecio === 'bruto'
                ? calcularGasto({tipoPrecio, tipoIVA, base: 0, total: Number(totalEntry ?? 0)})
                : calcularGasto({tipoPrecio, tipoIVA, base: Number(baseEntry ?? 0), total: 0});

        const isPack = Boolean(formData.get('isPack'));
        const unidadesPackRaw = formData.get('unidadesPack');

        let precioUnidad: number | undefined;
        const unidadesPack =
            unidadesPackRaw && String(unidadesPackRaw) !== '' ? Number(unidadesPackRaw) : undefined;

        const divisor = cantidad * (unidadesPack ?? 1);
        if (divisor > 0) precioUnidad = calculado.total / divisor;

        const upsertCandidate = {
            eventoId: eventoId as string,
            producto,
            unidad,
            cantidad,
            tipoPrecio,
            tipoIVA,
            base: calculado.base,
            iva: calculado.iva,
            total: calculado.total,
            isPack,
            comprobado: false,
            locked: false,
            ...(unidadesPack !== undefined ? {unidadesPack} : {}),
            ...(precioUnidad !== undefined ? {precioUnidad} : {}),
            ...(String(formData.get('pagador') ?? '') !== '' ? {pagador: String(formData.get('pagador'))} : {}),
            ...(String(formData.get('tienda') ?? '') !== '' ? {tienda: String(formData.get('tienda'))} : {}),
            ...(String(formData.get('notas') ?? '') !== '' ? {notas: String(formData.get('notas'))} : {}),
        } as const;

        const parsed = GastoUpsertSchema.safeParse(upsertCandidate);
        if (!parsed.success) {
            const first = parsed.error.issues[0];
            const message = first
                ? `Error de validación en "${first.path.join('.')}": ${first.message}`
                : 'Error de validación en el formulario.';
            alert(message);
            return;
        }

        const cleanedForUpdate: Partial<Gasto> = Object.fromEntries(
            Object.entries(parsed.data).filter(([, value]) => value !== undefined)
        ) as Partial<Gasto>;

        const createPayload: WithoutBase<Gasto> = {
            eventoId: parsed.data.eventoId,
            producto: parsed.data.producto,
            unidad: parsed.data.unidad,
            cantidad: parsed.data.cantidad,
            tipoPrecio: parsed.data.tipoPrecio,
            tipoIVA: parsed.data.tipoIVA,
            base: parsed.data.base,
            iva: parsed.data.iva,
            total: parsed.data.total,
            isPack: parsed.data.isPack,
            comprobado: parsed.data.comprobado,
            locked: parsed.data.locked,
            ...(parsed.data.unidadesPack !== undefined ? {unidadesPack: parsed.data.unidadesPack} : {}),
            ...(parsed.data.precioUnidad !== undefined ? {precioUnidad: parsed.data.precioUnidad} : {}),
            ...(parsed.data.pagador !== undefined ? {pagador: parsed.data.pagador} : {}),
            ...(parsed.data.tienda !== undefined ? {tienda: parsed.data.tienda} : {}),
            ...(parsed.data.notas !== undefined ? {notas: parsed.data.notas} : {}),
        };

        if (editingRow) {
            crud.update(editingRow.id, cleanedForUpdate);
        } else {
            crud.create(createPayload);
        }

        closeModal();
        event.currentTarget.reset();
    }

    return (
        <div className="space-y-4">
            <div className="card flex items-center justify-between">
                <div>
                    <div className="text-xs uppercase text-zinc-500">Gasto acumulado</div>
                    <div className="text-2xl font-semibold">{formatCurrency(totalAcumulado)}</div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm">Vista:</span>
                    <button type="button" className="btn" onClick={() => handleChangeView('simple')}>
                        Simple
                    </button>
                    <button type="button" className="btn" onClick={() => handleChangeView('detallada')}>
                        Detallada
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={openCreateModal}
                    aria-label="Añadir nuevo gasto"
                >
                    Añadir
                </button>

                <input
                    className="input max-w-xs"
                    placeholder="Buscar gastos…"
                    value={globalFilter}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    aria-label="Filtro global de gastos"
                />
            </div>

            <DataTable<Gasto>
                className="card"
                columns={columns}
                rows={displayedRows}
                sort={sortState}
                onSortChange={setSortState}
                emptyState={<span className="text-zinc-500">Sin gastos aún</span>}
            />

            <Modal
                title={editingRow ? 'Editar gasto' : 'Nuevo gasto'}
                isOpen={isModalOpen}
                onClose={closeModal}
                isCloseOnEsc
                isCloseOnBackdrop
            >
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField label="Producto">
                            <input name="producto" className="input w-full" required/>
                        </FormField>
                        <FormField label="Unidad">
                            <input name="unidad" className="input w-full" required/>
                        </FormField>
                        <FormField label="Cantidad">
                            <input name="cantidad" type="number" step="1" min="0" className="input w-full" required/>
                        </FormField>
                        <FormField label="Tipo de precio">
                            <div className="flex items-center gap-4">
                                <label className="inline-flex items-center gap-2">
                                    <input type="radio" name="tipoPrecio" value="bruto" defaultChecked/> Bruto (total
                                    incluye IVA)
                                </label>
                                <label className="inline-flex items-center gap-2">
                                    <input type="radio" name="tipoPrecio" value="neto"/> Neto (base sin IVA)
                                </label>
                            </div>
                        </FormField>
                        <FormField label="Tipo IVA (%))">
                            <select name="tipoIVA" className="input w-full" defaultValue={21}>
                                {[0, 4, 10, 21].map((value) => (
                                    <option key={value} value={value}>{value}</option>
                                ))}
                            </select>
                        </FormField>
                        <FormField label="Total (si BRUTO)">
                            <input name="total" type="number" step="0.01" min="0" className="input w-full"/>
                        </FormField>
                        <FormField label="Base (si NETO)">
                            <input name="base" type="number" step="0.01" min="0" className="input w-full"/>
                        </FormField>
                        <FormField label="¿Pack?">
                            <label className="inline-flex items-center gap-2">
                                <input type="checkbox" name="isPack"/> Sí
                            </label>
                        </FormField>
                        <FormField label="Unidades en pack">
                            <input name="unidadesPack" type="number" step="1" min="1" className="input w-full"/>
                        </FormField>
                        <FormField label="Pagador">
                            <input name="pagador" className="input w-full"/>
                        </FormField>
                        <FormField label="Tienda">
                            <input name="tienda" className="input w-full"/>
                        </FormField>
                        <FormField label="Notas">
                            <textarea name="notas" className="input w-full" rows={3}/>
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
