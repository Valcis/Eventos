import type {ColumnDef} from '@tanstack/react-table';
import type {Ubicacion} from '../../types';

export function ubicacionesColumns(): ColumnDef<Ubicacion>[] {
    return [
        {accessorKey: 'nombre', header: 'Nombre'},
        {accessorKey: 'direccion', header: 'Dirección'},
        {
            accessorKey: 'telefono',
            header: 'Teléfono',
            cell: (info) => info.getValue<string | undefined>() ?? '',
            enableColumnFilter: true,
        },
        {
            accessorKey: 'horario',
            header: 'Horario',
            cell: (info) => info.getValue<string | undefined>() ?? '',
        },
        {
            accessorKey: 'comentarios',
            header: 'Comentarios',
            cell: (info) => info.getValue<string | undefined>() ?? '',
        },
        {
            accessorKey: 'habilitado',
            header: 'Habilitado',
            cell: ({row}) => (row.original.habilitado ? 'Sí' : 'No'),
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'capacidad',
            header: 'Capacidad',
            cell: (info) => {
                const v = info.getValue<number | undefined>();
                return v ?? '';
            },
        },
    ];
}
