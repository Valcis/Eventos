import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import { useCrud, schemas } from '../lib/shared/utils/crud';
import type { Evento } from '../lib/shared/types';

export default function Home() {
  const { items, create } = useCrud<Evento>('eventos');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nav = useNavigate();
  const sorted = useMemo(() => [...items].sort((a, b) => b.fecha.localeCompare(a.fecha)), [items]);

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const raw = Object.fromEntries(new FormData(ev.currentTarget).entries());
    const parsed = schemas.evento.safeParse(raw);
    if (!parsed.success) {
      alert('Revisa los campos');
      return;
    }
    setIsSubmitting(true);
    const nuevo = create(parsed.data as any);
    setIsSubmitting(false);
    setIsOpen(false);
    nav(`/eventos/${nuevo.id}`);
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Eventos</h2>
        <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
          Crear evento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sorted.map((ev) => (
          <Link key={ev.id} to={`/eventos/${ev.id}`} className="card hover:shadow-lg transition">
            <div className="text-sm text-gray-500">{ev.fecha}</div>
            <div className="text-lg font-semibold">{ev.nombre}</div>
            <div className="text-xs text-gray-500">
              {ev.ubicacionId ? `Ubicación: ${ev.ubicacionId}` : 'Sin ubicación'}
            </div>
          </Link>
        ))}
        {sorted.length === 0 && (
          <div className="card">
            <p className="text-gray-600">Aún no hay eventos. Crea el primero.</p>
          </div>
        )}
      </div>

      <Modal title="Crear evento" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={onSubmit}>
          <FormField label="Nombre">
            <input className="input" name="nombre" />
          </FormField>
          <FormField label="Fecha">
            <input className="input" type="date" name="fecha" />
          </FormField>
          <FormField label="Ubicación (ID)">
            <input className="input" name="ubicacionId" />
          </FormField>
          <FormField label="Presupuesto (€)">
            <input className="input" name="presupuesto" defaultValue={0} />
          </FormField>
          <div className="col-span-full flex justify-end gap-2">
            <button type="button" className="btn" onClick={() => setIsOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
