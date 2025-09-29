import type {ColumnDef} from '../../components/ui/DataTable/types';
import type {Gasto} from '../shared/types';

const gastosDetailedColumns: Array<ColumnDef<Gasto>> = [
    {id: 'fecha', header: 'Fecha', accessorKey: 'fecha', isSortable: true, isSimpleKey: true},
    {id: 'categoria', header: 'Categoría', accessorKey: 'categoria', isSortable: true, isSimpleKey: true},
    {id: 'concepto', header: 'Concepto', accessorKey: 'concepto', isSortable: true, isSimpleKey: true},
    {id: 'proveedor', header: 'Proveedor', accessorKey: 'proveedor', isSortable: true},
    {id: 'metodo', header: 'Método', accessorKey: 'metodo', isSortable: true},
    {id: 'estado', header: 'Estado', accessorKey: 'estado', isSortable: true},
    {id: 'importe', header: 'Importe', accessorKey: 'importe', isSortable: true, align: 'right', isSimpleKey: true},
];

export default gastosDetailedColumns;
