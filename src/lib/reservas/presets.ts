import { TablePreset, SearchPreset } from "../ui/contracts";
import { registerPresets } from "../ui/presetsStore";

const table: TablePreset = {
    catalog: [
        { column: "eventoId",        label: "Evento",          order: 10,  filterable: true, sortable: true },
        { column: "cliente",         label: "Cliente",         order: 20,  filterable: true, sortable: true, tooltipText: "Nombre de quien reserva" },
        { column: "parrilladas",     label: "Parrilladas",     order: 30,  filterable: true, sortable: true, align: "right", defaultValue: 0 },
        { column: "picarones",       label: "Picarones",       order: 40,  filterable: true, sortable: true, align: "right", defaultValue: 0 },
        { column: "metodoPagoId",    label: "Método de pago",  order: 50,  filterable: true, sortable: true },
        { column: "receptorId",      label: "Receptor",        order: 60,  filterable: true, sortable: true },
        { column: "tipoConsumoId",   label: "Tipo de consumo", order: 70,  filterable: true, sortable: true },
        { column: "comercialId",     label: "Comercial",       order: 80,  filterable: true, sortable: true },
        { column: "totalPedido",     label: "Total pedido",    order: 90,  filterable: true, sortable: true, align: "right", defaultSort: "desc" },
        { column: "pagado",          label: "Pagado",          order: 100, filterable: true, sortable: true, align: "center", defaultValue: false },
        { column: "comprobado",      label: "Comprobado",      order: 110, filterable: true, sortable: true, align: "center", defaultValue: false },
        { column: "locked",          label: "Bloqueado",       order: 120, filterable: true, sortable: true, align: "center", defaultValue: false },
        { column: "puntoRecogidaId", label: "Punto recogida",  order: 130, filterable: true, sortable: true },
        { column: "createdAt",       label: "Creado",          order: 140, filterable: true, sortable: true },
        { column: "updatedAt",       label: "Actualizado",     order: 150, filterable: true, sortable: true },
        { column: "isActive",        label: "Activo",          order: 160, filterable: true, sortable: true, align: "center", defaultValue: true },
    ],
    views: {
        compact: [
            "cliente",
            "parrilladas",
            "picarones",
            "totalPedido",
            "pagado",
        ],
        expanded: [
            "eventoId",
            "cliente",
            "parrilladas",
            "picarones",
            "metodoPagoId",
            "receptorId",
            "tipoConsumoId",
            "comercialId",
            "totalPedido",
            "pagado",
            "comprobado",
            "locked",
        ],
    },
};

const search: SearchPreset = {
    fields: [
        "cliente",
        "metodoPagoId",
        "tipoConsumoId",
        "comercialId",
        "pagado",
        "comprobado",
    ],
};

registerPresets("reservas", { table, search });