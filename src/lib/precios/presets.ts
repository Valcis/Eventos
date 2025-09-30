import { TablePreset, SearchPreset } from "../ui/contracts";
import { registerPresets } from "../ui/presetsStore";

const table: TablePreset = {
    catalog: [
        { column: "eventoId",  label: "Evento",    order: 10, filterable: true, sortable: true },
        { column: "concepto",  label: "Concepto",  order: 20, filterable: true, sortable: true, tooltipText: "Descripción del concepto" },
        { column: "importe",   label: "Importe",   order: 30, filterable: true, sortable: true, align: "right", defaultSort: "desc", defaultValue: 0 },
        { column: "moneda",    label: "Moneda",    order: 40, filterable: true, sortable: true, align: "center" },
        { column: "locked",    label: "Bloqueado", order: 50, filterable: true, sortable: true, align: "center", defaultValue: false },
        { column: "createdAt", label: "Creado",    order: 60, filterable: true, sortable: true },
        { column: "updatedAt", label: "Actualizado", order: 70, filterable: true, sortable: true },
        { column: "isActive",  label: "Activo",    order: 80, filterable: true, sortable: true, align: "center", defaultValue: true },
    ],
    views: {
        compact: [
            "concepto",
            "importe",
            "moneda",
        ],
        expanded: [
            "eventoId",
            "concepto",
            "importe",
            "moneda",
            "locked",
        ],
    },
};

const search: SearchPreset = {
    fields: [
        "concepto",
        "importe",
        "moneda",
        "locked",
    ],
};

registerPresets("precios", { table, search });
