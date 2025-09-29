import { useParams } from 'react-router-dom';
import { useCrud } from '../../lib/shared/utils/crud';
import type { Gasto, Precio, Asistente } from '../../lib/shared/types';

export default function Balance() {
  const { id } = useParams<{ id: string }>();
  const { items: gastos } = useCrud<Gasto>('gastos');
  const { items: precios } = useCrud<Precio>('precios');

  const gs = gastos.filter((g) => g.eventoId === id);
  const ps = precios.filter((p) => p.eventoId === id);

  const precioBase = ps.find((p) => p.concepto.toLowerCase() === 'general')?.importe ?? 0;

  return <div className="grid grid-cols-1 md:grid-cols-3 gap-4"></div>;
}
