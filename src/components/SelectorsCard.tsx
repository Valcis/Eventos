import React, { useMemo, useState, useCallback } from "react";
import MiniTable from "./ui/MiniTable";
import SelectorsModal from "./SelectorsModal";

// Tipos mínimos y estrictos
export interface BaseItem {
    id: string;
    nombre: string;
    isActive: boolean;
    notas?: string;
    [k: string]: unknown;
}

export interface ListColumn<T extends BaseItem = BaseItem> {
    key: keyof T & string;
    header: string;
    isHidden?: boolean;
    width?: string | number;
    render?: (row: T) => React.ReactNode;
}

export interface FilterField {
    key: string;
    label: string;
    type: "text" | "select" | "checkbox" | "number";
    options?: Array<{ value: string | number | boolean; label: string }>;
}

export interface FilterConfig<T extends BaseItem = BaseItem> {
    fields: FilterField[];
    defaultState: Record<string, unknown>;
    apply: (rows: T[], state: Record<string, unknown>) => T[];
}

export interface SelectorsCardProps<T extends BaseItem = BaseItem> {
    title: string;
    columns: Array<ListColumn<T>>;
    rows: T[];
    filters?: FilterConfig<T>;
    isReadOnly?: boolean;

    // Acciones de fila (opcional)
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;

    // Modal interno opcional (si no usas onEdit)
    modal?: {
        title: string;
        fields: React.ComponentProps<typeof SelectorsModal>["fields"];
        validate?: React.ComponentProps<typeof SelectorsModal>["validate"];
        save?: React.ComponentProps<typeof SelectorsModal>["save"];
    };
    onSaved?: () => void;
}

export default function SelectorsCard<T extends BaseItem>({
                                                              title,
                                                              columns,
                                                              rows,
                                                              filters,
                                                              isReadOnly = false,
                                                              onEdit,
                                                              onDelete,
                                                              modal,
                                                              onSaved,
                                                          }: SelectorsCardProps<T>): JSX.Element {
    // Filtros
    const [filterState, setFilterState] = useState<Record<string, unknown>>(filters?.defaultState ?? {});
    const filteredRows = useMemo<T[]>(
        () => (filters ? filters.apply(rows, filterState) : rows),
        [filters, rows, filterState]
    );

    // Búsqueda rápida básica
    const [q, setQ] = useState<string>("");
    const quickRows = useMemo<T[]>(() => {
        const s = q.trim().toLowerCase();
        if (!s) return filteredRows;
        return filteredRows.filter((r) => {
            const nombre = String((r as BaseItem).nombre ?? "").toLowerCase();
            const notas = String((r as BaseItem).notas ?? "").toLowerCase();
            return nombre.includes(s) || notas.includes(s);
        });
    }, [q, filteredRows]);

    // Modal interno (edición/creación simple)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editing, setEditing] = useState<T | null>(null);

    const openEditLocal = useCallback(
        (row: T) => {
            if (onEdit) {
                onEdit(row);
                return;
            }
            if (!modal) return;
            setEditing(row);
            setIsModalOpen(true);
        },
        [onEdit, modal]
    );

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setEditing(null);
    }, []);

    const handleSaved = useCallback(() => {
        closeModal();
        if (onSaved) onSaved();
    }, [closeModal, onSaved]);

    return (
        <section className="border rounded-lg p-3 space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">{title}</h3>
                <div className="flex items-center gap-2">
                    {filters ? (
                        <button
                            type="button"
                            className="border rounded px-2 py-1 text-sm"
                            onClick={() => setFilterState(filters.defaultState)}
                            title="Limpiar filtros"
                        >
                            Limpiar
                        </button>
                    ) : null}
                    <input
                        className="border rounded px-2 py-1 text-sm"
                        placeholder="Buscar…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        aria-label="Búsqueda rápida"
                    />
                </div>
            </div>

            {filters && filters.fields.length > 0 && (
                <div className="grid gap-2 md:grid-cols-3">
                    {filters.fields.map((f) => {
                        if (f.type === "checkbox") {
                            const checked = Boolean(filterState[f.key]);
                            return (
                                <label key={f.key} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={(e) => setFilterState((s) => ({ ...s, [f.key]: e.target.checked }))}
                                    />
                                    <span>{f.label}</span>
                                </label>
                            );
                        }
                        if (f.type === "select") {
                            return (
                                <label key={f.key} className="flex items-center gap-2">
                                    <span className="w-32">{f.label}</span>
                                    <select
                                        className="flex-1 border rounded px-2 py-1"
                                        value={String(filterState[f.key] ?? "")}
                                        onChange={(e) => setFilterState((s) => ({ ...s, [f.key]: e.target.value }))}
                                    >
                                        <option value="">—</option>
                                        {(f.options ?? []).map((o) => (
                                            <option key={String(o.value)} value={String(o.value)}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            );
                        }
                        if (f.type === "number") {
                            return (
                                <label key={f.key} className="flex items-center gap-2">
                                    <span className="w-32">{f.label}</span>
                                    <input
                                        type="number"
                                        className="flex-1 border rounded px-2 py-1"
                                        value={String(filterState[f.key] ?? "")}
                                        onChange={(e) =>
                                            setFilterState((s) => ({
                                                ...s,
                                                [f.key]: e.target.value === "" ? undefined : Number(e.target.value),
                                            }))
                                        }
                                    />
                                </label>
                            );
                        }
                        // text
                        return (
                            <label key={f.key} className="flex items-center gap-2">
                                <span className="w-32">{f.label}</span>
                                <input
                                    className="flex-1 border rounded px-2 py-1"
                                    value={String(filterState[f.key] ?? "")}
                                    onChange={(e) => setFilterState((s) => ({ ...s, [f.key]: e.target.value }))}
                                />
                            </label>
                        );
                    })}
                </div>
            )}

            <MiniTable<BaseItem>
                columns={columns}
                rows={quickRows}
                isReadOnly={isReadOnly}
                onAction={(actionKey, row) => {
                    if (actionKey === "edit") openEditLocal(row as T);
                    if (actionKey === "delete" && onDelete) onDelete(row as T);
                }}
                renderFallback={(colKey, row) =>
                    colKey === "isActive"
                        ? row.isActive
                            ? <span className="px-2 py-0.5 rounded bg-green-100">Activo</span>
                            : <span className="px-2 py-0.5 rounded bg-gray-200">Inactivo</span>
                        : String((row as Record<string, unknown>)[colKey] ?? "—")
                }
            />

            {modal && (
                <SelectorsModal
                    isOpen={isModalOpen}
                    isReadOnly={isReadOnly}
                    title={modal.title}
                    fields={modal.fields}
                    validate={modal.validate}
                    save={modal.save}
                    initial={editing ?? undefined}
                    onClose={closeModal}
                    onSaved={handleSaved}
                />
            )}
        </section>
    );
}
