import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import { useCrud } from '../../lib/crud';
import { precioSchema } from '../../lib/validators/schemas';
import type { Precio } from '../../types';
import { preciosColumns } from '../../lib/tables/precios.columns';

export default function Precios() {
  const { id: eventoId } = useParams<{ id: string }>();
  const crud = useCrud<Precio>('precios');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Precio | null>(null);

  const rows = useMemo(() => crud.items.filter(p => p.eventoId === eventoId), [crud.items, eventoId]);

  const columns = useMemo<ColumnDef<Precio, any>[]>(() => {
    const base = preciosColumns();
    const actions: ColumnDef<Precio, any> = {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const r = row.original;
        const bloqueado = r.locked === true;
        return (
          <div className="flex gap-2">
            <button
              className="btn btn-sm"
              onClick={() => crud.update(r.id, { locked: !Boolean(r.locked) })}
              title={bloqueado ? 'Desbloquear' : 'Bloquear'}
            >
              {bloqueado ? '🔓' : '🔒'}
            </button>
            <button
              className="btn btn-sm"
              onClick={() => { if (!bloqueado) { setEditing(r); setOpen(true); } }}
              disabled={bloqueado}
            >
              Editar
            </button>
            <button
              className="btn btn-sm"
              onClick={() => { if (!bloqueado) crud.remove(r.id); }}
              disabled={bloqueado}
            >
              Borrar
            </button>
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
    };
    return [...base, actions];
  }, [crud]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!eventoId) return;
    const fd = new FormData(e.currentTarget);
    const concepto = String(fd.get('concepto') ?? '').trim();
    const importe = Number(fd.get('importe') ?? 0);

    // Validar existencia/alta de “parrilladas” y “picarones”: permitir crear si faltan, evitar duplicados por evento
    const existeDuplicado = rows.some(p => p.concepto.toLowerCase() === concepto.toLowerCase() && (!editing || p.id !== editing.id));
    if (existeDuplicado) { alert('Ya existe un precio con ese concepto'); return; }

    const parsed = precioSchema.safeParse({ eventoId, concepto, importe, locked: false });
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      alert(first ? `Error de validación en "${first.path.join('.')}": ${first.message}` : 'Error de validación.');
      return;
    }

    if (editing) {
      crud.update(editing.id, { concepto: parsed.data.concepto, importe: parsed.data.importe });
    } else {
      // locked: false explícito para evitar undefined en exactOptionalPropertyTypes
      crud.create(parsed.data as any);
    }
    setOpen(false);
    setEditing(null);
    (e.currentTarget as HTMLFormElement).reset();
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Precios</h2>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setOpen(true); }}>Añadir</button>
      </div>
      <DataTable<Precio>
        columns={columns}
        data={rows}
        globalFilterPlaceholder="Buscar precios…"
      />

      <Modal title={editing ? 'Editar precio' : 'Nuevo precio'} isOpen={open} onClose={() => { setOpen(false); setEditing(null); }}>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={onSubmit}>
          <FormField label="Concepto">
            <input name="concepto" className="input" defaultValue={editing?.concepto ?? ''} required />
          </FormField>
          <FormField label="Importe">
            <input name="importe" type="number" step="0.01" min={0} className="input" defaultValue={editing?.importe ?? 0} />
          </FormField>
          <div className="col-span-full flex justify-end gap-2">
            <button type="button" className="btn" onClick={() => { setOpen(false); setEditing(null); }}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </Modal>

      <div className="text-sm text-gray-500">
        Nota: asegúrate de tener conceptos “parrilladas” y “picarones” para el cálculo de Reservas.
      </div>
    </section>
  );
}
