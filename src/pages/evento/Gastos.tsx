// src/pages/evento/Gastos.tsx
import React, {useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';

import DataTable from '../../components/ui/DataTable';
import type {ColumnDef} from '../../components/ui/DataTable/types';

import Modal from '../../components/Modal';
import FormField from '../../components/FormField';

import {useCrud, type WithoutBase} from '../../lib/crud';

import type {Gasto} from '../../types';
import {calcularGasto} from '../../lib/calculations/gastos';
import {getGastosView, setGastosView, type GastosView} from '../../lib/view/views';
import {GastoUpsertSchema} from '../../lib/validators';
import {formatCurrency} from '../../lib/format';

export default function Gastos(): JSX.Element {
    const {id: eventoId} = useParams<{ id: string }>();
    const crud = useCrud<Gasto>('gastos');

    // ---- Estado UI
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingRow, setEditingRow] = useState<Gasto | null>(null);
    const [view, setView] = useState<GastosView>(() =>
        eventoId ? getGastosView(eventoId) : 'simple'
    );
    const [globalFilter, setGlobalFilter] = useState<string>('');

    // ---- Datos
    const rowsForEvent = useMemo<Gasto[]>(
        () => crud.items.filter((row) => row.eventoId === eventoId),
        [crud.items, eventoId]
    );

    const filteredRows = useMemo<Gasto[]>(() => {
        const query = globalFilter.trim().toLowerCase();
        if (query === '') return rowsForEvent;
        return rowsForEvent.filter((row) => JSON.stringify(row).toLowerCase().includes(query));
    }, [rowsForEvent, globalFilter]);

    const totalAcumulado = useMemo<number>(
        () => rowsForEvent.reduce((acc, row) => acc + (row.total ?? 0), 0),
        [rowsForEvent]
    );

    // ---- Columnas (definidas aquí, en tu formato ColumnDef)
    const commonColumns: ColumnDef<Gasto>[] = [
        {
            id: 'producto',
            header: 'Producto',
            accessor: (row) => row.producto,
            isSortable: true,
            width: 220,
        },
        {
            id: 'unidad',
            header: 'Unidad',
            accessor: (row) => row.unidad,
            width: 120,
        },
        {
            id: 'cantidad',
            header: 'Cantidad',
            accessor: (row) => row.cantidad,
            align: 'right',
            isSortable: true,
            width: 110,
        },
        {
            id: 'tipoPrecio',
            header: 'Precio',
            accessor: (row) => (row.tipoPrecio === 'bruto' ? 'Bruto' : 'Neto'),
            width: 90,
        },
        {
            id: 'tipoIVA',
            header: 'IVA %',
            accessor: (row) => row.tipoIVA,
            align: 'right',
            width: 80,
        },
        {
            id: 'base',
            header: 'Base',
            accessor: (row) => formatCurrency(row.base ?? 0),
            align: 'right',
            isSortable: true,
            width: 120,
        },
        {
            id: 'iva',
            header: 'IVA',
            accessor: (row) => formatCurrency(row.iva ?? 0),
            align: 'right',
            isSortable: true,
            width: 120,
        },
        {
            id: 'total',
            header: 'Total',
            accessor: (row) => formatCurrency(row.total ?? 0),
            align: 'right',
            isSortable: true,
            width: 140,
        },
    ];

    const detailedOnly: ColumnDef<Gasto>[] = [
        {
            id: 'isPack',
            header: 'Pack',
            accessor: (row) => (row.isPack ? 'Sí' : 'No'),
            align: 'center',
            width: 80,
        },
        {
            id: 'unidadesPack',
            header: 'Unidades/Pack',
            accessor: (row) => row.unidadesPack ?? '-',
            align: 'right',
            width: 130,
        },
        {
            id: 'precioUnidad',
            header: '€/Unidad',
            accessor: (row) => (row.precioUnidad != null ? formatCurrency(row.precioUnidad) : '-'),
            align: 'right',
            width: 120,
        },
        {
            id: 'pagador',
            header: 'Pagador',
            accessor: (row) => row.pagador ?? '—',
            width: 140,
        },
        {
            id: 'tienda',
            header: 'Tienda',
            accessor: (row) => row.tienda ?? '—',
            width: 140,
        },
        {
            id: 'comprobado',
            header: 'OK',
            accessor: (row) => (row.comprobado ? '✓' : '—'),
            align: 'center',
            width: 70,
        },
    ];

    const actionsColumn: ColumnDef<Gasto> = {
        id: 'actions',
        header: 'Acciones',
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

    const columns = useMemo<ColumnDef<Gasto>[]>(() => {
        return view === 'simple'
            ? [...commonColumns, actionsColumn]
            : [...commonColumns, ...detailedOnly, actionsColumn];
    }, [view]); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Handlers
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

    function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
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
            eventoId,
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

        // elimina propiedades undefined para update
        const cleanedForUpdate: Partial<Gasto> = Object.fromEntries(
            Object.entries(parsed.data).filter(([, value]) => value !== undefined)
        ) as Partial<Gasto>;

        const createPayload: WithoutBase<Gasto> = {
            // --- requeridos ---
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
            // --- opcionales (solo si existen) ---
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

    // ---- Render
    return (
        <div className="space-y-4">
            {/* Resumen */}
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

            {/* Controles */}
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

            {/* Tabla */}
            <DataTable<Gasto>
                className="card"
                columns={columns}
                rows={filteredRows}
                emptyState={<span className="text-zinc-500">Sin gastos aún</span>}
            />

            {/* Modal alta/edición */}
            <Modal
                title={editingRow ? 'Editar gasto' : 'Nuevo gasto'}
                isOpen={isModalOpen}
                onClose={closeModal}
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

                        <FormField label="Tipo IVA (%)">
                            <select name="tipoIVA" className="input w-full" defaultValue={21}>
                                {[0, 4, 10, 21].map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        {/* Campos alternativos según tipoPrecio */}
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
                        <button type="button" className="btn" onClick={closeModal}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
