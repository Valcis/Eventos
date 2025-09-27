import * as React from "react";
import MiniTable from "../../components/ui/MiniTable";
import ActiveCheckbox from "../../components/ui/ActiveCheckbox";
import SelectorsModal, { RowBase } from "./SelectorsModal";
import { getSelectors, removeSelector, upsertSelector } from "../../store/localdb";
import {useCallback, useEffect, useState} from "react";
import IconButton from "../../components/ui/IconButton";
import {Info, Pencil, Plus, Trash2} from "lucide-react";
import {SelectorKind} from "../../types/selectores";
import {SELECTOR_CONFIG} from "./config";


export default function SelectorsCard({ kind, eventId, query }: { kind: SelectorKind; eventId: string; query: string; }): JSX.Element {
    const cfg = SELECTOR_CONFIG[kind];
    const [items, setItems] = useState<RowBase[]>([]);


    type ModalMode = "create" | "edit" | "info";
    const [modal, setModal] = useState<{ mode: ModalMode; item?: RowBase } | null>(null);
    const isModalOpen = modal !== null;
    const isReadOnly = modal?.mode === "info";


    const load = useCallback(() => {
        const all = getSelectors<RowBase>(eventId, kind);
        if (!query.trim()) { setItems(all); return; }
        const q = query.toLowerCase();
        setItems(all.filter((x) => String(x.nombre ?? "").toLowerCase().includes(q)));
    }, [eventId, kind, query]);


    useEffect(load, [load]);


    const toggleActivo = (r: RowBase, next: boolean): void => {
        const updated: RowBase = { ...r, activo: next };
        upsertSelector<RowBase>(eventId, kind, updated);
        setItems((prev) => prev.map((x) => (x.id === r.id ? updated : x)));
    };


    const remove = (r: RowBase): void => {
        if (!r.id) return;
        removeSelector(eventId, kind, String(r.id));
        setItems((prev) => prev.filter((x) => x.id !== r.id));
    };


    const openCreate = (): void => setModal({ mode: "create" });
    const openEdit = (r: RowBase): void => setModal({ mode: "edit", item: r });
    const openInfo = (r: RowBase): void => setModal({ mode: "info", item: r });


    const columns = cfg.tableColumns;

    return (
        <section className="rounded-2xl border bg-white shadow-sm">
            <header className="flex items-center gap-2 border-b p-3">
                <div className="font-medium">{cfg.title}</div>
                <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs">{items.length}</span>
                <div className="ml-auto flex items-center gap-2">
                    <IconButton ariaLabel={`Añadir en ${cfg.title}`} onClick={openCreate}><Plus size={16} /></IconButton>
                </div>
            </header>


    <div className="p-3">
        {items.length === 0 ? (
            <div className="text-sm text-gray-500">Sin datos. Añade el primero.</div>
        ) : (
            <MiniTable
                columns={columns}
                rows={items}
                renderCell={(col, r) => {
                    switch (col) {
                        case "Tel.": return String((r.telefono as string | undefined) ?? "—");
                        case "Requiere receptor": return (r.requiereReceptor as boolean | undefined) ? "Sí" : "No";
                        case "Abreviatura": return String((r.abreviatura as string | undefined) ?? "—");
                        case "Dirección": return String((r.direccion as string | undefined) ?? "—");
                        case "Horario": return String((r.horario as string | undefined) ?? "—");
                        case "Activo": return (
                            <ActiveCheckbox isChecked={Boolean(r.activo)} onToggle={(next) => toggleActivo(r, next)} />
                        );
                        default: // Nombre u otros
                            return String((r as RowBase).nombre ?? "—");
                    }
                }}
                renderActions={(r) => (
                    <>
                        <IconButton ariaLabel="Información" onClick={() => openInfo(r)}><Info size={16} /></IconButton>
                        <IconButton ariaLabel="Editar" onClick={() => openEdit(r)}><Pencil size={16} /></IconButton>
                        <IconButton ariaLabel="Borrar" onClick={() => remove(r)}><Trash2 size={16} /></IconButton>
                    </>
                )}
            />
        )}
    </div>


    {isModalOpen && (
        <SelectorsModal
            title={cfg.title}
            kind={kind}
            eventId={eventId}
            isOpen={isModalOpen}
            isReadOnly={Boolean(isReadOnly)}
            {...(modal?.item ? { initial: modal.item } : {})}
            onClose={() => setModal(null)}
            onSaved={(saved) => {
                if (saved) {
                    setItems((prev) => {
                        const idx = prev.findIndex((x) => x.id === saved.id);
                        if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
                        return [saved, ...prev];
                    });
                }
                setModal(null);
            }}
        />
    )}
</section>
);
}