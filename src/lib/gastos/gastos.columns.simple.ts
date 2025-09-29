import type {ColumnDef} from '../../components/ui/DataTable/types';
import type {Gasto} from '../shared/types';

const gastosSimpleColumns: Array<ColumnDef<Gasto>> = [
    {id: 'fecha', header: 'Fecha', accessorKey: 'fecha', isSortable: true, isSimpleKey: true},
    {id: 'categoria', header: 'Categoría', accessorKey: 'categoria', isSortable: true, isSimpleKey: true},
    {id: 'concepto', header: 'Concepto', accessorKey: 'concepto', isSortable: true, isSimpleKey: true},
    {id: 'importe', header: 'Importe', accessorKey: 'importe', isSortable: true, align: 'right', isSimpleKey: true},
];

export default gastosSimpleColumns;
