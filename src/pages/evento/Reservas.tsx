// src/evento/Reservas.tsx
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCrud } from '../../lib/shared/utils/crud';
import { reservaSchema } from '../../lib/reservas/validators';
import type { BaseEntity, Precio, Reserva, Ubicacion, Selector } from '../../lib/shared/types';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import { calcularTotalPedido } from '../../lib/reservas/calculations';

export default function Reservas() {
  const { id: eventoId } = useParams<{ id: string }>();
  const reservasCrud = useCrud<Reserva>('reservas');
  const preciosCrud = useCrud<Precio>('precios');
  const ubicCrud = useCrud<Ubicacion>('ubicaciones');
  const selCrud = useCrud<Selector>('selectores');

  const [open, setOpen] = useState(false);

  const precios = useMemo(
    () => preciosCrud.items.filter((p) => p.eventoId === eventoId),
    [preciosCrud.items, eventoId],
  );
  const ubicHabilitadas = useMemo(
    () => ubicCrud.items.filter((u) => u.eventoId === eventoId && u.habilitado),
    [ubicCrud.items, eventoId],
  );
  const selectores = useMemo(() => {
    const rows = selCrud.items
      .filter((s) => s.eventoId === eventoId && s.habilitado)
      .sort((a, b) => a.orden - b.orden);
    return {
      tipoConsumo: rows.filter((r) => r.categoria === 'tipoConsumo').map((r) => r.valor),
      metodoPago: rows.filter((r) => r.categoria === 'metodoPago').map((r) => r.valor),
      receptor: rows.filter((r) => r.categoria === 'receptor').map((r) => r.valor),
    };
  }, [selCrud.items, eventoId]);

  const rows = useMemo(
    () => reservasCrud.items.filter((r) => r.eventoId === eventoId),
    [reservasCrud.items, eventoId],
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!eventoId) return;
    const fd = new FormData(e.currentTarget);


    const cliente = String(fd.get('cliente') ?? '');
    const parrilladas = Number(fd.get('parrilladas') ?? 0);
    const picarones = Number(fd.get('picarones') ?? 0);
    const tipoConsumo = String(fd.get('tipoConsumo') ?? 'comer_aqui') as Reserva['tipoConsumo'];
    const metodoPago = String(fd.get('metodoPago') ?? 'efectivo') as Reserva['metodoPago'];
    const puntoRecogidaIdEntry = fd.get('puntoRecogidaId');
    const receptorEntry = fd.get('receptor');

    // Construimos el objeto respetando exactOptionalPropertyTypes
    const obj = {
      eventoId,
      cliente,
      parrilladas,
      picarones,
      tipoConsumo,
      metodoPago,
      pagado: false,
      comprobado: false,
      locked: false,
      ...(puntoRecogidaIdEntry ? { puntoRecogidaId: String(puntoRecogidaIdEntry) } : {}),
      ...(receptorEntry ? { receptor: String(receptorEntry) } : {}),
      totalPedido: 0,
    } as const;

    // Calcula total con precios del evento
    const total = calcularTotalPedido(
      { parrilladas: obj.parrilladas, picarones: obj.picarones },
      precios,
    );

    const parsed = reservaSchema.safeParse({ ...obj, totalPedido: total });
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      alert(
        first
          ? `Error de validación en "${first.path.join('.')}": ${first.message}`
          : 'Error de validación.',
      );
      return;
    }
    reservasCrud.create(parsed.data as any);
    setOpen(false);
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reservas</h2>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          Nueva reserva
        </button>
      </div>
      <div className="card overflow-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Parrilladas</th>
              <th>Picarones</th>
              <th>Tipo de consumo</th>
              <th>Punto de Recogida</th>
              <th>Método de pago</th>
              <th>Receptor</th>
              <th>Total Pedido</th>
              <th>Pagado</th>
              <th>Comprobado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const bloqueado = r.locked;
              return (
                <tr key={r.id} className={bloqueado ? 'opacity-60' : ''}>
                  <td>{r.cliente}</td>
                  <td>{r.parrilladas}</td>
                  <td>{r.picarones}</td>
                  <td>{r.tipoConsumo}</td>
                  <td>{ubicHabilitadas.find((u) => u.id === r.puntoRecogidaId)?.nombre ?? ''}</td>
                  <td>{r.metodoPago}</td>
                  <td>{r.receptor ?? ''}</td>
                  <td>{r.totalPedido}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={r.pagado}
                      onChange={() =>
                        !bloqueado && reservasCrud.update(r.id, { pagado: !r.pagado })
                      }
                      disabled={bloqueado}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={r.comprobado}
                      onChange={() =>
                        !bloqueado && reservasCrud.update(r.id, { comprobado: !r.comprobado })
                      }
                      disabled={bloqueado}
                    />
                  </td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-sm"
                      onClick={() => reservasCrud.update(r.id, { locked: !r.locked })}
                    >
                      {r.locked ? '🔓' : '🔒'}
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => !bloqueado && reservasCrud.remove(r.id)}
                      disabled={bloqueado}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={11} className="text-center text-gray-500 p-4">
                  Sin reservas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal title="Nueva reserva" isOpen={open} onClose={() => setOpen(false)}>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={onSubmit}>
          <FormField label="Cliente">
            <input name="cliente" className="input" required />
          </FormField>
          <FormField label="Parrilladas">
            <input name="parrilladas" type="number" min={0} defaultValue={0} className="input" />
          </FormField>
          <FormField label="Picarones">
            <input name="picarones" type="number" min={0} defaultValue={0} className="input" />
          </FormField>
          <FormField label="Tipo de consumo">
            <select name="tipoConsumo" className="input">
              {selectores.tipoConsumo.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Punto de Recogida">
            <select name="puntoRecogidaId" className="input">
              <option value="">—</option>
              {ubicHabilitadas.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Método de pago">
            <select name="metodoPago" className="input">
              {selectores.metodoPago.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Receptor">
            <select name="receptor" className="input">
              <option value="">—</option>
              {selectores.receptor.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </FormField>
          <div className="col-span-full flex justify-end gap-2">
            <button type="button" className="btn" onClick={() => setOpen(false)}>
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
