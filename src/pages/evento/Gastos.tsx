import React, {useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';
import type {ColumnDef} from '../../components/ui/DataTable/types';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import {useCrud} from '../../lib/crud';
import type {Gasto} from '../../types';
import {calcularGasto} from '../../lib/calculations/gastos';
import {gastosColumnsSimple} from '../../lib/tables/gastos.columns.simple';
import {gastosColumnsDetailed} from '../../lib/tables/gastos.columns.detailed';
import {getGastosView, setGastosView, type GastosView} from '../../lib/view/views';
import {GastoUpsertSchema} from '../../lib/validators';
import {formatCurrency} from '../../lib/format';

export default function Gastos() {
    const {id: eventoId} = useParams<{ id: string }>();
    const crud = useCrud<Gasto>('gastos');

    const rows = useMemo(
        () => crud.items.filter((g) => g.eventoId === eventoId),
        [crud.items, eventoId],
    );

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Gasto | null>(null);
    const [view, setView] = useState<GastosView>(() =>
        eventoId ? getGastosView(eventoId) : 'simple',
    );

    // helper local: "normaliza" columnas tanstack-like a tu ColumnDef
    function normalizeColumns<T>(cols: unknown[]): ColumnDef<T>[] {
        return (cols as Array<Record<string, unknown>>).map((c, idx) => {
            const id = (c.id as string) ?? (c.accessorKey as string) ?? `col_${idx}`;

            const accessor =
                typeof c.accessorKey === "string"
                    ? (row: T) => (row as unknown as Record<string, unknown>)[c.accessorKey as string]
                    : undefined;

            const maybeCell = typeof c.cell === "function" ? c.cell : undefined;

            return {
                id,
                header: (c.header as React.ReactNode) ?? id,
                ...(accessor ? {accessor} : {}),
                ...(maybeCell
                    ? {
                        cell: (_v, row) =>
                            (maybeCell as (ctx: { row: { original: T } }) => React.ReactNode)({
                                row: {original: row},
                            }),
                    }
                    : {}),
            } as ColumnDef<T>;
        });
    }

    const columns = useMemo<ColumnDef<Gasto>[]>(() => {
        const baseTS = view === "simple" ? gastosColumnsSimple() : gastosColumnsDetailed();
        const base = normalizeColumns<Gasto>(baseTS);

        const actions: ColumnDef<Gasto> = {
            id: "actions",
            header: "Acciones",
            cell: (_value, r) => {
                const bloqueado = r.locked === true;
                return (
                    <div className="flex gap-2">
                        <button
                            className="btn btn-sm"
                            onClick={() => crud.update(r.id, {locked: !Boolean(r.locked)})}
                            title={bloqueado ? "Desbloquear" : "Bloquear"}
                        >
                            {bloqueado ? "🔓" : "🔒"}
                        </button>
                        <button
                            className="btn btn-sm"
                            onClick={() => {
                                if (!bloqueado) {
                                    setEditing(r);
                                    setOpen(true);
                                }
                            }}
                            disabled={bloqueado}
                        >
                            Editar
                        </button>
                        <button
                            className="btn btn-sm"
                            onClick={() => {
                                if (!bloqueado) crud.remove(r.id);
                            }}
                            disabled={bloqueado}
                        >
                            Borrar
                        </button>
                    </div>
                );
            },
        };

        return [...base, actions];
    }, [crud, view]);

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!eventoId) return;
        const fd = new FormData(e.currentTarget);

        const producto = String(fd.get('producto') ?? '');
        const unidad = String(fd.get('unidad') ?? '');
        const cantidad = Number(fd.get('cantidad') ?? 0);
        const tipoPrecio = String(fd.get('tipoPrecio') ?? 'bruto') as Gasto['tipoPrecio'];
        const tipoIVA = Number(fd.get('tipoIVA') ?? 21);

        // Entrada condicional según tipoPrecio
        const totalEntry = fd.get('total');
        const baseEntry = fd.get('base');

        // Construimos base/iva/total a partir de la selección
        const calculado =
            tipoPrecio === 'bruto'
                ? calcularGasto({tipoPrecio, tipoIVA, base: 0, total: Number(totalEntry ?? 0)})
                : calcularGasto({tipoPrecio, tipoIVA, base: Number(baseEntry ?? 0), total: 0});

        const isPack = Boolean(fd.get('isPack'));
        const unidadesPackEntry = fd.get('unidadesPack');

        // Derivar precioUnidad si es posible
        let precioUnidad: number | undefined;
        const unidadesPack =
            unidadesPackEntry && String(unidadesPackEntry) !== '' ? Number(unidadesPackEntry) : undefined;
        const divisor = cantidad * (unidadesPack ?? 1);
        if (divisor > 0) precioUnidad = calculado.total / divisor;

        const baseObj = {
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
            ...(String(fd.get('pagador') ?? '') !== '' ? {pagador: String(fd.get('pagador'))} : {}),
            ...(String(fd.get('tienda') ?? '') !== '' ? {tienda: String(fd.get('tienda'))} : {}),
            ...(String(fd.get('notas') ?? '') !== '' ? {notas: String(fd.get('notas'))} : {}),
        } as const;

        const parsed = GastoUpsertSchema.safeParse(baseObj);
        if (!parsed.success) {
            const first = parsed.error.issues[0];
            const msg = first
                ? `Error de validación en "${first.path.join('.')}": ${first.message}`
                : 'Error de validación en el formulario.';
            alert(msg);
            return;
        }
        const payload = parsed.data as typeof baseObj;
        if (editing) {
            crud.update(editing.id, {...payload});
        } else {
            crud.create({...payload});
        }

        setOpen(false);
        setEditing(null);
        (e.currentTarget as HTMLFormElement).reset();
    }

    function onChangeView(next: GastosView) {
        setView(next);
        if (eventoId) setGastosView(eventoId, next);
    }

    const gastoAcum = rows.reduce((acc, g) => acc + (g.total ?? 0), 0);

    return (
        <section className="space-y-4">
            <div className="card p-4 flex items-center justify-between">
                <div>
                    <div className="text-sm text-gray-500">Gasto acumulado</div>
                    <div className="text-2xl font-semibold">{formatCurrency(gastoAcum)}</div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm">Vista:</span>
                    <div className="flex items-center gap-1">
                        <button
                            className={`btn btn-sm ${view === 'simple' ? 'btn-primary' : ''}`}
                            onClick={() => onChangeView('simple')}
                        >
                            Simple
                        </button>
                        <button
                            className={`btn btn-sm ${view === 'detallada' ? 'btn-primary' : ''}`}
                            onClick={() => onChangeView('detallada')}
                        >
                            Detallada
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Gastos</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditing(null);
                        setOpen(true);
                    }}
                >
                    Añadir
                </button>
            </div>

            <DataTable<Gasto> columns={columns} rows={rows} globalFilterPlaceholder="Buscar gastos…"/>

            <Modal
                title={editing ? 'Editar gasto' : 'Nuevo gasto'}
                isOpen={open}
                onClose={() => {
                    setOpen(false);
                    setEditing(null);
                }}
            >
                <form className="grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={onSubmit}>
                    <FormField label="Producto">
                        <input
                            name="producto"
                            className="input"
                            required
                            defaultValue={editing?.producto ?? ''}
                        />
                    </FormField>
                    <FormField label="Unidad">
                        <input name="unidad" className="input" required defaultValue={editing?.unidad ?? ''}/>
                    </FormField>
                    <FormField label="Cantidad">
                        <input
                            name="cantidad"
                            type="number"
                            min={0}
                            step="1"
                            className="input"
                            defaultValue={editing?.cantidad ?? 1}
                        />
                    </FormField>

                    <FormField label="Tipo de precio">
                        <select
                            name="tipoPrecio"
                            className="input"
                            defaultValue={editing?.tipoPrecio ?? 'bruto'}
                        >
                            <option value="bruto">Bruto (total incluye IVA)</option>
                            <option value="neto">Neto (base sin IVA)</option>
                        </select>
                    </FormField>

                    <FormField label="Tipo IVA (%)">
                        <select name="tipoIVA" className="input" defaultValue={editing?.tipoIVA ?? 21}>
                            {[0, 4, 10, 21].map((v) => (
                                <option key={v} value={v}>
                                    {v}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    {/* Inputs condicionales: aceptamos ambos y usamos según tipoPrecio */}
                    <FormField label="Total (con IVA)">
                        <input
                            name="total"
                            type="number"
                            step="0.01"
                            min={0}
                            className="input"
                            defaultValue={editing?.total ?? ''}
                        />
                    </FormField>
                    <FormField label="Base (sin IVA)">
                        <input
                            name="base"
                            type="number"
                            step="0.01"
                            min={0}
                            className="input"
                            defaultValue={editing?.base ?? ''}
                        />
                    </FormField>

                    <FormField label="¿Pack?">
                        <input name="isPack" type="checkbox" defaultChecked={editing?.isPack ?? false}/>
                    </FormField>
                    <FormField label="Unidades en pack">
                        <input
                            name="unidadesPack"
                            type="number"
                            min={1}
                            className="input"
                            defaultValue={editing?.unidadesPack ?? ''}
                        />
                    </FormField>

                    <FormField label="Pagador">
                        <input name="pagador" className="input" defaultValue={editing?.pagador ?? ''}/>
                    </FormField>
                    <FormField label="Tienda">
                        <input name="tienda" className="input" defaultValue={editing?.tienda ?? ''}/>
                    </FormField>
                    <FormField label="Notas">
                        <input name="notas" className="input" defaultValue={editing?.notas ?? ''}/>
                    </FormField>

                    <div className="col-span-full flex justify-end gap-2">
                        <button
                            type="button"
                            className="btn"
                            onClick={() => {
                                setOpen(false);
                                setEditing(null);
                            }}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
