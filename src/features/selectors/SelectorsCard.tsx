import { JSX } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Plus, Info, Pencil, Trash2, Eye, Settings } from 'lucide-react';
import { useAlertConfirm } from '../../components/ui/AlertConfirm';
import type { SelectorKind } from '../../types/selectores';
import { SELECTOR_CONFIG } from './config';
import IconButton from '../../components/ui/IconButton';
import MiniTable from '../../components/ui/MiniTable';
import ActiveCheckbox from '../../components/ui/ActiveCheckbox';
import SelectorsModal, { RowBase } from './SelectorsModal';
import { getSelectors, removeSelector, upsertSelector } from '../../store/localdb';

export default function SelectorsCard({
  kind,
  eventId,
  query,
}: {
  kind: SelectorKind;
  eventId: string;
  query: string;
}): JSX.Element {
  const { confirm } = useAlertConfirm();
  const cfg = SELECTOR_CONFIG[kind];
  const [items, setItems] = useState<RowBase[]>([]);

  type ModalMode = 'create' | 'edit' | 'info';
  const [modal, setModal] = useState<{ mode: ModalMode; item?: RowBase } | null>(null);
  const isModalOpen = modal !== null;
  const isReadOnly = modal?.mode === 'info';

  const load = useCallback(() => {
    const all = getSelectors<RowBase>(eventId, kind);
    if (!query.trim()) {
      setItems(all);
      return;
    }
    const q = query.toLowerCase();
    setItems(
      all.filter((x) =>
        String(x.nombre ?? '')
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [eventId, kind, query]);

  useEffect(load, [load]);

  const toggleActivo = (r: RowBase, next: boolean): void => {
    const updated: RowBase = { ...r, activo: next };
    upsertSelector<RowBase>(eventId, kind, updated);
    setItems((prev) => prev.map((x) => (x.id === r.id ? updated : x)));
  };

  const remove = async (r: RowBase): Promise<void> => {
    if (!r.id) return;
    const ok = await confirm({
      title: 'Eliminar línea',
      description: r.nombre
        ? `Se eliminará “${String(r.nombre)}”. Esta acción no se puede deshacer.`
        : 'Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      isDestructive: true,
    });
    if (!ok) return;
    removeSelector(eventId, kind, String(r.id));
    setItems((prev) => prev.filter((x) => x.id !== r.id));
  };

  const openCreate = (): void => setModal({ mode: 'create' });
  const openEdit = (r: RowBase): void => setModal({ mode: 'edit', item: r });
  const openInfo = (r: RowBase): void => setModal({ mode: 'info', item: r });

  const columns = cfg.tableColumns; // "Activo" primero

  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <header className="flex items-center gap-2 border-b p-3">
        <div className="font-medium">{cfg.title}</div>
        <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs">{items.length}</span>
        <div className="ml-auto flex items-center gap-1">
          <IconButton ariaLabel={`Añadir en ${cfg.title}`} size="xs" onClick={openCreate}>
            <Plus size={13} />
          </IconButton>
        </div>
      </header>

      <div className="p-3">
        {items.length === 0 ? (
          <div className="text-sm text-gray-500">Sin datos. Añade el primero.</div>
        ) : (
          <MiniTable
            columns={columns}
            rows={items}
            density="compact"
            // 👇 Cabeceras con iconos visibles
            renderHeader={(col) => {
              if (col === 'Activo') {
                return (
                  <span
                    title="Activo"
                    aria-label="Activo"
                    className="inline-flex items-center justify-center"
                  >
                    <Eye size={18} />
                  </span>
                );
              }
              return col;
            }}
            actionsHeader={
              <span
                title="Acciones"
                aria-label="Acciones"
                className="inline-flex items-center justify-center"
              >
                <Settings size={18} />
              </span>
            }
            renderCell={(col, r) => {
              switch (col) {
                case 'Tel.':
                  return String((r.telefono as string | undefined) ?? '—');
                case 'Requiere receptor':
                  return (r.requiereReceptor as boolean | undefined) ? 'Sí' : 'No';
                case 'Abreviatura':
                  return String((r.abreviatura as string | undefined) ?? '—');
                case 'Dirección':
                  return String((r.direccion as string | undefined) ?? '—');
                case 'Horario':
                  return String((r.horario as string | undefined) ?? '—');
                case 'Activo':
                  return (
                    <ActiveCheckbox
                      isChecked={Boolean(r.activo)}
                      onToggle={(next) => toggleActivo(r, next)}
                    />
                  );
                default:
                  return String((r as RowBase).nombre ?? '—');
              }
            }}
            renderActions={(r) => (
              <>
                <IconButton ariaLabel="Información" size="xs" onClick={() => openInfo(r)}>
                  <Info size={13} />
                </IconButton>
                <IconButton ariaLabel="Editar" size="xs" onClick={() => openEdit(r)}>
                  <Pencil size={13} />
                </IconButton>
                <IconButton ariaLabel="Borrar" size="xs" onClick={() => remove(r)}>
                  <Trash2 size={13} />
                </IconButton>
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
                if (idx >= 0) {
                  const next = [...prev];
                  next[idx] = saved;
                  return next;
                }
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
