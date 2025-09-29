import type {ColumnDef} from '../../components/ui/DataTable/types';
import type {Precio} from '../shared/types';

export const preciosColumns: Array<ColumnDef<Precio>> = [
    {id: 'producto', header: 'Producto', accessorKey: 'producto', isSortable: true, isSimpleKey: true},
    {id: 'tarifa', header: 'Tarifa', accessorKey: 'tarifa', isSortable: true, isSimpleKey: true},
    {id: 'precio', header: 'Precio', accessorKey: 'precio', isSortable: true, align: 'right', isSimpleKey: true},
    {id: 'moneda', header: 'Moneda', accessorKey: 'moneda', isSortable: true},
    {id: 'vigenteDesde', header: 'Desde', accessorKey: 'vigenteDesde', isSortable: true},
    {id: 'vigenteHasta', header: 'Hasta', accessorKey: 'vigenteHasta', isSortable: true},
];
