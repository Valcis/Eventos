import * as React from "react";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/Modal";        // ajusta si tu import es distinto
import FormField from "../../components/FormField"; // idem
import {getSelectors, setSelectors, upsertSelector, removeSelector} from "../../store/localdb";
import {
    ComercialSchema, MetodoPagoSchema, PagadorSchema, TiendaSchema, UnidadSchema,
    TipoPrecioSchema, TipoConsumoSchema, BenefBizumSchema, PuntoRecogidaSchema
} from "../../lib/validators/selectores";
import type {SelectorKind, BaseItem} from "../../types/selectores";

// Config de todas las cards con columnas de la mini-tabla:
const CARDS: { kind: SelectorKind; title: string; columns: string[] }[] = [
    {kind: "comerciales", title: "Comerciales", columns: ["Nombre", "Tel.", "Activo"]},
    {kind: "metodosPago", title: "Métodos de pago", columns: ["Nombre", "Receptor Bizum", "Activo"]},
    {kind: "pagadores", title: "Pagadores", columns: ["Nombre", "Activo"]},
    {kind: "tiendas", title: "Tiendas", columns: ["Nombre", "Dirección", "Activo"]},
    {kind: "unidades", title: "Unidades", columns: ["Nombre", "Activo"]},
    {kind: "tiposPrecio", title: "Tipos de precio", columns: ["Nombre", "Activo"]},
    {kind: "tipoConsumo", title: "Tipo de consumo", columns: ["Nombre", "Activo"]},
    {kind: "benefBizum", title: "Benef. Bizum", columns: ["Nombre", "Activo"]},
    {kind: "puntosRecogida", title: "Puntos de recogida", columns: ["Nombre", "Horario", "Activo"]},
];

const byKind = {
    comerciales: ComercialSchema,
    metodosPago: MetodoPagoSchema,
    pagadores: PagadorSchema,
    tiendas: TiendaSchema,
    unidades: UnidadSchema,
    tiposPrecio: TipoPrecioSchema,
    tipoConsumo: TipoConsumoSchema,
    benefBizum: BenefBizumSchema,
    puntosRecogida: PuntoRecogidaSchema,
} as const;

export default function SelectoresPage() {
    // eventId: adáptalo a como lo resolves en tu app (params/router/context)
    const [eventId] = React.useState<string>("demo"); // TODO: reemplazar por el real
    const [query, setQuery] = React.useState("");

    return (
        <div className="p-4 md:p-6">
            <header className="mb-4 flex items-center gap-2">
                <h1 className="text-2xl font-semibold">Selectores</h1>
                <div className="ml-auto w-full max-w-md">
                    <input
                        aria-label="Buscar en selectores"
                        className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
                        placeholder="Buscar en todas las listas…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {CARDS.map(cfg => (
                    <SelectorCard key={cfg.kind} cfg={cfg} query={query} eventId={eventId}/>
                ))}
            </div>
        </div>
    );
}

function SelectorCard({cfg, query, eventId}: {
    cfg: { kind: SelectorKind; title: string; columns: string[] }; query: string; eventId: string
}) {
    const [items, setItems] = React.useState<BaseItem[]>([]);
    const [open, setOpen] = React.useState<null | { newMode?: boolean }>(null);

    const load = React.useCallback(() => {
        const all = getSelectors<BaseItem>(eventId, cfg.kind);
        setItems(query ? all.filter(x => (x.nombre ?? "").toLowerCase().includes(query.toLowerCase())) : all);
    }, [cfg.kind, eventId, query]);

    React.useEffect(load, [load]);

    return (
        <section className="rounded-2xl border bg-white shadow-sm">
            <header className="flex items-center gap-2 p-3 border-b">
                <div className="font-medium">{cfg.title}</div>
                <span className="ml-2 text-xs rounded-full bg-gray-100 px-2 py-0.5">{items.length}</span>

                <div className="ml-auto flex items-center gap-2">
                    <button
                        className="text-sm px-2 py-1 rounded-lg border"
                        onClick={() => setOpen({newMode: true})}
                        aria-label={`Añadir en ${cfg.title}`}
                    >
                        ➕ Añadir
                    </button>
                    <button
                        className="text-sm px-2 py-1 rounded-lg border"
                        onClick={() => setOpen({})}
                        aria-label={`Ver todo en ${cfg.title}`}
                    >
                        Ver todo
                    </button>
                </div>
            </header>

            <div className="p-3">
                {items.length === 0 ? (
                    <div className="text-sm text-gray-500">Sin datos. Añade el primero.</div>
                ) : (
                    <MiniTable columns={cfg.columns} rows={items}/>
                )}
            </div>

            {open && (
                <SelectorModal
                    title={cfg.title}
                    kind={cfg.kind}
                    eventId={eventId}
                    startInNewMode={!!open.newMode}
                    onClose={() => setOpen(null)}
                    onSaved={() => load()}   // 👈 refresca la card tras guardar
                />
            )}
        </section>
    );
}

function MiniTable({columns, rows}: { columns: string[]; rows: any[] }) {
    return (
        <table className="w-full text-sm">
            <thead>
            <tr className="text-left text-gray-600">
                {columns.map(c => <th key={c} className="py-1 pr-4">{c}</th>)}
            </tr>
            </thead>
            <tbody>
            {rows.slice(0, 6).map((r, i) => (
                <tr key={r.id ?? i} className="border-t">
                    {columns.map(c => <td key={c} className="py-1.5 pr-4">{renderCell(c, r)}</td>)}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

function renderCell(col: string, r: any) {
    switch (col) {
        case "Tel.":
            return r.telefono ?? "—";
        case "Receptor Bizum":
            return r.requiereReceptor ? "Sí" : "No";
        case "Dirección":
            return r.direccion ?? "—";
        case "Horario":
            return r.horario ?? "—";
        case "Activo":
            return r.activo ? "✅" : "⛔";
        default:
            return r.nombre ?? "—";
    }
}

// -------- Modal con DataTable completa + CRUD simple
function SelectorModal({title, kind, eventId, startInNewMode = false, onClose, onSaved}: {
    title: string;
    kind: SelectorKind;
    eventId: string;
    startInNewMode?: boolean;
    onClose: () => void;
    onSaved: () => void;          // 👈 notifica a la card que recargue
}) {
    const Schema = (byKind as any)[kind];
    const [rows, setRows] = React.useState<any[]>(() => getSelectors<any>(eventId, kind));
    const [editing, setEditing] = React.useState<any | null>(null);

    React.useEffect(() => {
        if (startInNewMode) {
            setEditing({id: crypto.randomUUID(), nombre: "", activo: true});
        }
    }, [startInNewMode]);

    const columns = React.useMemo(() => [
        {key: "nombre", header: "Nombre"},
        {key: "activo", header: "Activo", render: (r: any) => r.activo ? "Sí" : "No"},
        {
            key: "__actions",
            header: "",
            render: (r: any) => (
                <div className="flex justify-end gap-2">
                    <button className="px-2 py-1 rounded border text-xs" onClick={() => setEditing(r)}>Editar</button>
                    <button className="px-2 py-1 rounded border text-xs" onClick={() => handleDelete(r)}>Borrar</button>
                </div>
            )
        }
    ], []);

    const persist = (next: any[]) => {
        setSelectors(eventId, kind, next);
        setRows(next);
        onSaved(); // 👈 actualiza la card
    };

    const handleDelete = (r: any) => {
        removeSelector(eventId, kind, r.id);
        const next = rows.filter(x => x.id !== r.id);
        persist(next);
    };

    const handleSubmit = (val: any) => {
        const parsed = Schema.safeParse(val);
        if (!parsed.success) {
            alert(parsed.error.errors[0]?.message ?? "Datos inválidos"); // cambia por tu toast
            return;
        }
        // upsert en memoria y storage
        const idx = rows.findIndex(x => x.id === parsed.data.id);
        const next = idx >= 0
            ? rows.map((x, i) => i === idx ? parsed.data : x)
            : [parsed.data, ...rows];
        persist(next);
        setEditing(null);
    };

    return (
        <Modal title={title} onClose={onClose}>
            <div className="mb-3 flex items-center justify-between">
                <button className="text-sm px-3 py-1.5 rounded-lg border"
                        onClick={() => setEditing({id: crypto.randomUUID(), nombre: "", activo: true})}>
                    ➕ Añadir
                </button>
                <div className="space-x-2">
                    <button className="text-sm px-3 py-1.5 rounded-lg border" onClick={onClose}>Cerrar</button>
                </div>
            </div>

            <DataTable data={rows} columns={columns}/>

            {editing && <EditSelectorForm
                initial={editing}
                kind={kind}
                onCancel={() => setEditing(null)}
                onSubmit={(val) => handleSubmit({...editing, ...val})} // mezcla y envía
            />}

        </Modal>
    );
}

function EditSelectorForm({initial, kind, onCancel, onSubmit}: {
    initial: any; kind: SelectorKind; onCancel: () => void; onSubmit: (v: any) => void;
}) {
    const [val, setVal] = React.useState<any>(initial);
    const onChange = (k: string, v: any) => setVal((s: any) => ({...s, [k]: v}));

    const extraFields = () => {
        switch (kind) {
            case "comerciales":
                return <FormField label="Teléfono">
                    <input className="input" value={val.telefono ?? ""}
                           onChange={e => onChange("telefono", e.target.value)}/>
                </FormField>;
            case "metodosPago":
                return <FormField label="Requiere receptor (Bizum)">
                    <input type="checkbox" checked={!!val.requiereReceptor}
                           onChange={e => onChange("requiereReceptor", e.target.checked)}/>
                </FormField>;
            case "tiendas":
            case "puntosRecogida":
                return (
                    <>
                        <FormField label="Dirección">
                            <input className="input" value={val.direccion ?? ""}
                                   onChange={e => onChange("direccion", e.target.value)}/>
                        </FormField>
                        <FormField label="Horario">
                            <input className="input" value={val.horario ?? ""}
                                   onChange={e => onChange("horario", e.target.value)}/>
                        </FormField>
                        {kind === "puntosRecogida" && (
                            <FormField label="Comentarios">
                                <textarea className="input" value={val.comentarios ?? ""}
                                          onChange={e => onChange("comentarios", e.target.value)}/>
                            </FormField>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="mt-4 rounded-2xl border p-3 bg-gray-50">
            <div className="grid md:grid-cols-2 gap-3">
                <FormField label="Nombre">
                    <input className="input" value={val.nombre ?? ""}
                           onChange={e => onChange("nombre", e.target.value)}/>
                </FormField>
                <FormField label="Activo">
                    <input type="checkbox" checked={!!val.activo} onChange={e => onChange("activo", e.target.checked)}/>
                </FormField>
                <FormField label="Notas">
                    <input className="input" value={val.notas ?? ""} onChange={e => onChange("notas", e.target.value)}/>
                </FormField>
                {extraFields()}
            </div>

            <div className="mt-3 flex items-center justify-end gap-2">
                <button className="px-3 py-1.5 rounded-lg border" onClick={onCancel}>Cancelar</button>
                <button
                    className="px-3 py-1.5 rounded-lg. border"
                    onClick={() => onSubmit({...val, id: val.id ?? crypto.randomUUID()})}
                >
                    Guardar
                </button>
            </div>
        </div>
    );
}
