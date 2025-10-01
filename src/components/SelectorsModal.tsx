import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import FormField from "./FormField";

export interface BaseItem {
    id: string;
    nombre: string;
    isActive: boolean;
    notas?: string;
    [k: string]: unknown;
}

export type FieldType = "text" | "number" | "select" | "checkbox" | "textarea";

export interface FieldSpec {
    key: string;
    label: string;
    type: FieldType;
    optional?: boolean;
    options?: Array<{ value: string | number | boolean; label: string }>;
    maxLength?: number;
}

export interface SelectorsModalProps {
    isOpen: boolean;
    isReadOnly?: boolean;
    title: string;
    fields: FieldSpec[];
    validate?: (data: BaseItem) => { success: true; data: BaseItem } | { success: false; error: { message: string } };
    save?: (data: BaseItem) => Promise<void> | void;
    initial?: BaseItem;
    onClose: () => void;
    onSaved: () => void;
}

export default function SelectorsModal({
                                           isOpen,
                                           isReadOnly = false,
                                           title,
                                           fields,
                                           validate,
                                           save,
                                           initial,
                                           onClose,
                                           onSaved,
                                       }: SelectorsModalProps): JSX.Element {
    const [val, setVal] = useState<BaseItem>(() => seed(initial));
    useEffect(() => setVal(seed(initial)), [initial]);

    function seed(row?: BaseItem): BaseItem {
        if (row) {
            const legacy = (row as Record<string, unknown>)["activo"];
            const isActive =
                typeof row.isActive === "boolean"
                    ? row.isActive
                    : typeof legacy === "boolean"
                        ? (legacy as boolean)
                        : true;
            return { ...row, isActive };
        }
        return { id: crypto.randomUUID(), nombre: "", isActive: true, notas: "" };
    }

    function setField(key: string, v: unknown): void {
        setVal((s) => ({ ...s, [key]: v }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isReadOnly) {
            onClose();
            return;
        }
        if (validate) {
            const parsed = validate(val);
            if (!parsed.success) {
                alert(parsed.error.message || "Revisa los campos.");
                return;
            }
        }
        if (save) await save(val);
        onSaved();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit}>
                <FormField label="Activo">
                    <input
                        type="checkbox"
                        checked={Boolean(val.isActive)}
                        onChange={(e) => setField("isActive", e.target.checked)}
                        disabled={isReadOnly}
                    />
                </FormField>

                {fields.map((f) => {
                    const value = (val as Record<string, unknown>)[f.key];

                    if (f.type === "checkbox") {
                        return (
                            <FormField key={f.key} label={f.label}>
                                <input
                                    type="checkbox"
                                    checked={Boolean(value)}
                                    onChange={(e) => setField(f.key, e.target.checked)}
                                    disabled={isReadOnly}
                                />
                            </FormField>
                        );
                    }

                    if (f.type === "select") {
                        return (
                            <FormField key={f.key} label={f.label}>
                                <select
                                    value={String(value ?? "")}
                                    onChange={(e) => setField(f.key, e.target.value)}
                                    disabled={isReadOnly}
                                >
                                    <option value="">—</option>
                                    {(f.options ?? []).map((o) => (
                                        <option key={String(o.value)} value={String(o.value)}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </FormField>
                        );
                    }

                    if (f.type === "number") {
                        return (
                            <FormField key={f.key} label={f.label}>
                                <input
                                    type="number"
                                    value={value == null ? "" : String(value)}
                                    onChange={(e) => setField(f.key, e.target.value === "" ? undefined : Number(e.target.value))}
                                    disabled={isReadOnly}
                                />
                            </FormField>
                        );
                    }

                    if (f.type === "textarea") {
                        const max = typeof f.maxLength === "number" ? f.maxLength : 250;
                        const s = String((value as string | undefined) ?? "");
                        return (
                            <FormField key={f.key} label={f.label} hint={`${s.length}/${max}`}>
                <textarea
                    value={s}
                    onChange={(e) => setField(f.key, e.target.value.slice(0, max))}
                    maxLength={max}
                    disabled={isReadOnly}
                />
                            </FormField>
                        );
                    }

                    return (
                        <FormField key={f.key} label={f.label}>
                            <input
                                type="text"
                                value={value == null ? "" : String(value)}
                                onChange={(e) => setField(f.key, e.target.value)}
                                disabled={isReadOnly}
                            />
                        </FormField>
                    );
                })}

                <div className="flex gap-2 justify-end mt-4">
                    <button type="button" className="border rounded px-3 py-1" onClick={onClose}>
                        Cancelar
                    </button>
                    {!isReadOnly && (
                        <button type="submit" className="border rounded px-3 py-1">
                            Guardar
                        </button>
                    )}
                </div>
            </form>
        </Modal>
    );
}
