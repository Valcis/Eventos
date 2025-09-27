import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import Modal from "../../components/Modal";
import FormField from "../../components/FormField";
import type {SelectorKind, BaseItem} from "../../types/selectores";
import {SELECTOR_CONFIG} from "./config";
import {z} from "zod";
import {upsertSelector} from "../../store/localdb";

type UnknownRecord = Record<string, unknown>;
export type RowBase = BaseItem & UnknownRecord;

type Props = {
    title: string;
    kind: SelectorKind;
    eventId: string;
    isOpen: boolean;
    isReadOnly: boolean;
    initial?: RowBase;
    onClose: () => void;
    onSaved: (saved?: RowBase) => void;
};

export default function SelectorsModal({
                                           title,
                                           kind,
                                           eventId,
                                           isOpen,
                                           isReadOnly,
                                           initial,
                                           onClose,
                                           onSaved,
                                       }: Props): JSX.Element {
    const cfg = SELECTOR_CONFIG[kind];
    const schema: z.ZodType<unknown> = cfg.schema;

    const baseNew: RowBase = useMemo(
        () => ({id: crypto.randomUUID(), nombre: "", notas: "", activo: true}),
        []
    );

    const [val, setVal] = useState<RowBase>(initial ?? baseNew);
    useEffect(() => {
        setVal(initial ?? baseNew);
    }, [initial, baseNew]);

    const onChange = (k: string, v: unknown): void => setVal((s) => ({...s, [k]: v}));

    const handleAccept = (): void => {
        if (isReadOnly) {
            onClose();
            return;
        }
        const parsed = schema.safeParse(val);
        if (!parsed.success) {
            alert(parsed.error.errors[0]?.message ?? "Datos inválidos");
            return;
        }
        const data = parsed.data as RowBase;
        if (!initial) data.activo = true; // crear => activo true
        upsertSelector<RowBase>(eventId, kind, data);
        onSaved(data);
    };

    return (
        <Modal title={title} isOpen={isOpen} onClose={onClose}>
            <div className="grid gap-3 md:grid-cols-2">
                {cfg.fields.map((f) => (
                    <FormField key={f.key} label={f.label}>
                        {f.type === "text" && (
                            <input
                                className="input"
                                value={String((val[f.key] as string | undefined) ?? "")}
                                onChange={(e) => onChange(f.key, e.target.value)}
                                disabled={isReadOnly}
                            />
                        )}
                        {f.type === "textarea" && (
                            <textarea
                                className="input"
                                value={String((val[f.key] as string | undefined) ?? "")}
                                onChange={(e) => onChange(f.key, e.target.value)}
                                disabled={isReadOnly}
                            />
                        )}
                        {f.type === "checkbox" && (
                            <input
                                type="checkbox"
                                checked={Boolean(val[f.key])}
                                onChange={(e) => onChange(f.key, e.target.checked)}
                                disabled={isReadOnly}
                            />
                        )}
                    </FormField>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
                <button className="rounded-2xl border px-3 py-1.5" onClick={onClose}>
                    {isReadOnly ? "Cerrar" : "Cancelar"}
                </button>
                {!isReadOnly && (
                    <button className="rounded-2xl border px-3 py-1.5" onClick={handleAccept}>
                        Guardar
                    </button>
                )}
            </div>
        </Modal>
    );
}
