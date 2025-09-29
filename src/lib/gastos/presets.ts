import {SearchPreset, TablePreset} from "../ui/contracts";
import {registerPresets} from "../ui/presetsStore";

const tablePreset: TablePreset = {
    allColumns: [
        { id: 'eventoId',     kind: 'text',     label: 'Evento',         order: 1,  visible: true,  filterable: true,  align: 'left',   sortable: true,  defaultSort: 'asc' },
        { id: 'producto',     kind: 'text',     label: 'Producto',       order: 2,  visible: true,  filterable: true,  align: 'left',   sortable: true },
        { id: 'unidadId',     kind: 'text',     label: 'Unidad',         order: 3,  visible: true,  filterable: true,  align: 'left',   sortable: true },
        { id: 'cantidad',     kind: 'number',     label: 'Cantidad',       order: 4,  visible: true,  filterable: true,  align: 'right',  sortable: true },
        { id: 'tipoPrecio',   kind: 'text', label: 'Tipo de precio', order: 5,  visible: true,  filterable: true,  align: 'left',   sortable: true },
        { id: 'tipoIVA',      kind: 'number',     label: 'IVA (%)',        order: 6,  visible: true,  filterable: true,  align: 'right',  sortable: true },
        { id: 'precioBase',   kind: 'number',     label: 'Precio base',    order: 7,  visible: true,  filterable: true,  align: 'right',  sortable: true },
        { id: 'precioNeto',   kind: 'number',     label: 'Precio neto',    order: 8,  visible: true,  filterable: true,  align: 'right',  sortable: true },
        { id: 'isPack',       kind: 'boolean',    label: 'Es pack',        order: 9,  visible: true,  filterable: true,  align: 'center', sortable: true },
        { id: 'unidadesPack', kind: 'number',     label: 'Unid. pack',     order: 10, visible: false, filterable: true,  align: 'right',  sortable: true },
        { id: 'precioUnidad', kind: 'number',     label: 'Precio unidad',  order: 11, visible: false, filterable: true,  align: 'right',  sortable: true },
        { id: 'pagadorId',    kind: 'text',     label: 'Pagador',        order: 12, visible: false, filterable: true,  align: 'left',   sortable: true },
        { id: 'tiendaId',     kind: 'text',     label: 'Tienda',         order: 13, visible: false, filterable: true,  align: 'left',   sortable: true },
        { id: 'notas',        kind: 'text',     label: 'Notas',          order: 14, visible: false, filterable: true,  align: 'left',   sortable: true },
        { id: 'comprobado',   kind: 'boolean',    label: 'Comprobado',     order: 15, visible: true,  filterable: true,  align: 'center', sortable: true },
        { id: 'locked',       kind: 'boolean',    label: 'Bloqueado',      order: 16, visible: true,  filterable: true,  align: 'center', sortable: true },
    ],
    views: {
        compact: [
            { id: 'precioNeto',   kind: 'number',     label: 'Precio neto',    order: 8,  visible: true,  filterable: true,  align: 'right',  sortable: true },
            { id: 'isPack',       kind: 'boolean',    label: 'Es pack',        order: 9,  visible: true,  filterable: true,  align: 'center', sortable: true },
            { id: 'unidadesPack', kind: 'number',     label: 'Unid. pack',     order: 10, visible: false, filterable: true,  align: 'right',  sortable: true },
            { id: 'precioUnidad', kind: 'number',     label: 'Precio unidad',  order: 11, visible: false, filterable: true,  align: 'right',  sortable: true },
            { id: 'pagadorId',    kind: 'text',     label: 'Pagador',        order: 12, visible: false, filterable: true,  align: 'left',   sortable: true },
        ],
        expanded: [
            { id: 'eventoId',     kind: 'text',     label: 'Evento',         order: 1,  visible: true,  filterable: true,  align: 'left',   sortable: true,  defaultSort: 'asc' },
            { id: 'producto',     kind: 'text',     label: 'Producto',       order: 2,  visible: true,  filterable: true,  align: 'left',   sortable: true },
            { id: 'cantidad',     kind: 'number',     label: 'Cantidad',       order: 4,  visible: true,  filterable: true,  align: 'right',  sortable: true },
            { id: 'tipoPrecio',   kind: 'text', label: 'Tipo de precio', order: 5,  visible: true,  filterable: true,  align: 'left',   sortable: true },
            { id: 'tipoIVA',      kind: 'number',     label: 'IVA (%)',        order: 6,  visible: true,  filterable: true,  align: 'right',  sortable: true },
            { id: 'precioBase',   kind: 'number',     label: 'Precio base',    order: 7,  visible: true,  filterable: true,  align: 'right',  sortable: true },
            { id: 'precioNeto',   kind: 'number',     label: 'Precio neto',    order: 8,  visible: true,  filterable: true,  align: 'right',  sortable: true },
            { id: 'isPack',       kind: 'boolean',    label: 'Es pack',        order: 9,  visible: true,  filterable: true,  align: 'center', sortable: true },
            { id: 'unidadesPack', kind: 'number',     label: 'Unid. pack',     order: 10, visible: false, filterable: true,  align: 'right',  sortable: true },
            { id: 'precioUnidad', kind: 'number',     label: 'Precio unidad',  order: 11, visible: false, filterable: true,  align: 'right',  sortable: true },
            { id: 'pagadorId',    kind: 'text',     label: 'Pagador',        order: 12, visible: false, filterable: true,  align: 'left',   sortable: true },
            { id: 'tiendaId',     kind: 'text',     label: 'Tienda',         order: 13, visible: false, filterable: true,  align: 'left',   sortable: true },
            { id: 'notas',        kind: 'text',     label: 'Notas',          order: 14, visible: false, filterable: true,  align: 'left',   sortable: true },
            { id: 'comprobado',   kind: 'boolean',    label: 'Comprobado',     order: 15, visible: true,  filterable: true,  align: 'center', sortable: true },
            { id: 'locked',       kind: 'boolean',    label: 'Bloqueado',      order: 16, visible: true,  filterable: true,  align: 'center', sortable: true },
        ],
    },
catalog:[]
};

const searchPreset: SearchPreset = {
    fields: [
        { id: 'unidadesPack', kind: 'number',     label: 'Unid. pack',     order: 10, visible: false, filterable: true,  align: 'right',  sortable: true },
        { id: 'precioUnidad', kind: 'number',     label: 'Precio unidad',  order: 11, visible: false, filterable: true,  align: 'right',  sortable: true },
        { id: 'pagadorId',    kind: 'text',     label: 'Pagador',        order: 12, visible: false, filterable: true,  align: 'left',   sortable: true },
    ],

};

registerPresets("gastos", {table: tablePreset, search: searchPreset});
