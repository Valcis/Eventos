import type { ColumnDef } from '@tanstack/react-table';
import type { Reserva } from '../../types';

export function reservasColumns(): ColumnDef<Reserva, any>[] {
  return [
    { id: 'cliente', accessorKey: 'cliente', header: 'Cliente' },
    { id: 'parrilladas', accessorKey: 'parrilladas', header: 'Parrilladas' },
    { id: 'picarones', accessorKey: 'picarones', header: 'Picarones' },
    { id: 'tipoConsumo', accessorKey: 'tipoConsumo', header: 'Tipo de consumo' },
    { id: 'puntoRecogidaId', accessorKey: 'puntoRecogidaId', header: 'Punto de Recogida' },
    { id: 'metodoPago', accessorKey: 'metodoPago', header: 'Método de pago' },
    { id: 'receptor', accessorKey: 'receptor', header: 'Receptor' },
    { id: 'totalPedido', accessorKey: 'totalPedido', header: 'Total Pedido' },
    { id: 'pagado', accessorKey: 'pagado', header: 'Pagado' },
    { id: 'comprobado', accessorKey: 'comprobado', header: 'Comprobado' },
  ];
}
