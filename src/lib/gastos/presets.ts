import { TablePreset, SearchPreset } from "../ui/contracts";
import { registerPresets } from "../ui/presetsStore";

const table: TablePreset = {
    catalog: [
        { column: "eventoId",      label: "Evento",          order: 10,  filterable: true,  sortable: true },
        { column: "producto",      label: "Producto",        order: 20,  filterable: true,  sortable: true, tooltipText: "Nombre del artículo o producto" },
        { column: "unidadId",      label: "Unidad",          order: 30,  filterable: true,  sortable: true },
        { column: "cantidad",      label: "Cantidad",        order: 40,  filterable: true,  sortable: true,  align: "right", defaultValue: 1 },
        { column: "tipoPrecio",    label: "Tipo de precio",  order: 50,  filterable: true,  sortable: true,  tooltipText: "Con IVA / Sin IVA", align: "center" },
        { column: "tipoIVA",       label: "IVA %",           order: 60,  filterable: true,  sortable: true,  align: "right", defaultValue: 21 },
        { column: "precioBase",    label: "Precio base",     order: 70,  filterable: true,  sortable: true,  align: "right", defaultSort: "desc" },
        { column: "precioNeto",    label: "Precio neto",     order: 80,  filterable: true,  sortable: true,  align: "right" },
        { column: "isPack",        label: "Pack",            order: 90,  filterable: true,  sortable: true,  align: "center", defaultValue: false, tooltipText: "¿Forma parte de un pack?" },
        { column: "unidadesPack",  label: "Unidades pack",   order: 100, filterable: true,  sortable: true,  align: "right" },
        { column: "precioUnidad",  label: "Precio unidad",   order: 110, filterable: true,  sortable: true,  align: "right" },
        { column: "pagadorId",     label: "Pagador",         order: 120, filterable: true,  sortable: true },
        { column: "tiendaId",      label: "Tienda",          order: 130, filterable: true,  sortable: true },
        { column: "notas",         label: "Notas",           order: 140, filterable: true,  sortable: false },
        { column: "comprobado",    label: "Comprobado",      order: 150, filterable: true,  sortable: true,  align: "center", defaultValue: false },
        { column: "locked",        label: "Bloqueado",       order: 160, filterable: true,  sortable: true,  align: "center", defaultValue: false, tooltipText: "Protegido contra cambios" },
        { column: "createdAt",     label: "Creado",          order: 170, filterable: true,  sortable: true },
        { column: "updatedAt",     label: "Actualizado",     order: 180, filterable: true,  sortable: true },
        { column: "isActive",      label: "Activo",          order: 190, filterable: true,  sortable: true,  align: "center", defaultValue: true },
    ],
    views: {
        compact: [
            "producto",
            "cantidad",
            "precioBase",
            "precioNeto",
            "comprobado",
        ],
        expanded: [
            "eventoId",
            "producto",
            "unidadId",
            "cantidad",
            "tipoPrecio",
            "tipoIVA",
            "precioBase",
            "precioNeto",
            "isPack",
            "unidadesPack",
            "precioUnidad",
            "pagadorId",
            "tiendaId",
            "comprobado",
            "locked",
        ],
    },
};

const search: SearchPreset = {
    fields: [
        "producto",
        "unidadId",
        "tipoPrecio",
        "precioBase",
        "precioNeto",
        "comprobado",
    ],
};

registerPresets("gastos", { table, search });
