# Project Overview — EVENTOS (estructura vigente, oct 2025)

> Documento de referencia técnica y funcional. Refleja la estructura actual del repo y las directrices de tipado/UX acordadas.

---

## 1) Visión general
- SPA con **React + Vite + TypeScript**.
- Navegación por evento: `/eventos/:id` con pestañas: **Resumen, Reservas, Gastos, Precios, Selectores**.
- Persistencia local en desarrollo via **`src/store/localdb.ts`**.
- **Tablas** con ordenación asc/desc, paginación (tamaño seleccionable y página visible) y filtros.
- **Convenciones de código** (Proyecto *EcosystemControl*):
  - **TypeScript estricto** (no `any`).
  - Props booleanas con prefijo `is*/has*` (p.ej., `isActive`, `isOpen`).
  - Imports mínimos (preferir `lazy` cuando aplique).
  - Mantener/actualizar documentación existente; añadir TSDoc en componentes/funciones principales.
  - Nombres descriptivos; evitar literales sueltos.

---

## 2) Rutas & páginas
- `/` → **Home**: crea/lista eventos y navega a `/eventos/:id`.
- `/eventos/:id` → **EventLayout** (layout + Tabs):
  - **Resumen**: métricas agregadas del evento.
  - **Reservas**: CRUD + cálculo de **Total Pedido** a partir de precios.
  - **Gastos**: CRUD con vista **simple**/**detallada**, IVA y *packs*.
  - **Precios**: CRUD de conceptos/unidades y soporte de *packs*.
  - **Selectores**: opciones dinámicas por evento: `tipoConsumo`, `metodoPago`, `receptor`, `puntoRecogida`.

---

## 3) UI compartida y patrones
**Componentes (src/components/):**
- Base: `FormField.tsx`, `Modal.tsx`, `TabsNav.tsx`, `IconButton.tsx`, `ui/ActiveCheckbox.tsx`.
- **Toast** (`ui/Toast/`): `useToast`, `Toast.tsx`, `ToastProvider.tsx`, `index.ts`.
- **AlertConfirm** (`ui/AlertConfirm/`): `useAlertConfirm`, `AlertConfirm.tsx`, `AlertConfirmProvider.tsx`, `index.ts`.
- **DataTable** (`ui/DataTable/`): `index.tsx`, `Pagination.tsx`, `types.ts`.
  - El paginador **se monta siempre** y se **oculta** cuando `totalItems <= 5`.
  - Control de **vista simple/detallada** centralizado en la tabla (la `FilterBar` puede exponerlo pero el control vive en la tabla).
- **FilterBar** (`ui/FilterBar/`): `FilterBar.tsx`, `types.ts` — estado controlado, *debounce*, colapsable y atajos (Enter/Escape).
- **Selectores UI** (`components/`): `SelectorsCard.tsx`, `SelectorsModal.tsx`.

**Infraestructura UI (src/lib/ui/):**
- `contracts.ts`, `normalize.ts`, `builder.ts`, `facade.ts`.
- `registry.ts`, `presetsStore.ts` para registro/carga de presets por pestaña.
- `zod-to-columns.ts` para derivar columnas de esquemas Zod.

---

## 4) Datos, validación y cálculos
**Tipos núcleo**
- `src/lib/globalTypes.ts` — tipos base reutilizables (evitar literales "fríos").
- `src/lib/evento/types.ts` y `src/lib/evento/schemas.ts` — tipos/esquemas del dominio `evento`.

**Dominios**
- **Reservas** (`src/lib/reservas/`): `types.ts`, `schema.zod.ts`, `schema.columns.ts`, `presets.ts`, `calculations.ts`.
- **Gastos** (`src/lib/gastos/`): `types.ts`, `schema.zod.ts`, `schema.columns.ts`, `presets.ts`, `calculations.ts`.
- **Precios** (`src/lib/precios/`): `types.ts`, `schema.zod.ts`, `schema.columns.ts`, `presets.ts`.
- **Selectores** (`src/lib/selectores/`): `types.ts`, `schemas.zod.ts`, `schemas.colums.ts` *(nombre de fichero actual)*, `presets.ts`.
- **Resumen** (`src/lib/resumen/`): `calculations.ts` para agregados.

**Convenciones**
- Validación con **Zod** por entidad (`schema.zod.ts`).
- Definición de columnas en `schema.columns.ts` (o `schemas.colums.ts` en *selectores*).
- Normalización de inputs (trim, límites) en esquemas/normalizadores.
- Cálculos clave:
  - **Reservas**: `totalPedido = Σ(unidades_i * precio_i)`.
  - **Gastos**: si `tipoPrecio='bruto'` → `base = total / (1 + IVA%)`; si `tipoPrecio='neto'` → `total = base * (1 + IVA%)`.

---

## 5) Estructura de carpetas (actual)
```txt
src/
  components/
    FormField.tsx
    Modal.tsx
    TabsNav.tsx
    components/SelectorsCard.tsx
    components/SelectorsModal.tsx
    ui/
      ActiveCheckbox.tsx
      IconButton.tsx
      DataTable/
        index.tsx
        Pagination.tsx
        types.ts
      FilterBar/
        FilterBar.tsx
        types.ts
      Toast/
        index.ts
        Toast.tsx
        ToastProvider.tsx
        useToast.ts
      AlertConfirm/
        index.ts
        AlertConfirm.tsx
        AlertConfirmProvider.tsx
        useAlertConfirm.ts
  lib/
    evento/
      schemas.ts
      types.ts
    gastos/
      calculations.ts
      presets.ts
      schema.columns.ts
      schema.zod.ts
      types.ts
    precios/
      presets.ts
      schema.columns.ts
      schema.zod.ts
      types.ts
    reservas/
      calculations.ts
      presets.ts
      schema.columns.ts
      schema.zod.ts
      types.ts
    resumen/
      calculations.ts
    selectores/
      presets.ts
      schemas.colums.ts
      schemas.zod.ts
      types.ts
    ui/
      builder.ts
      contracts.ts
      facade.ts
      normalize.ts
      presetsStore.ts
      registry.ts
      zod-to-columns.ts
    useLocalRepo.ts
  pages/
    Home.tsx
    evento/
      EventLayout.tsx
      Gastos.tsx
      Precios.tsx
      Reservas.tsx
      Resumen.tsx
      Selectores.tsx
  store/
    localdb.ts
  styles/
    index.css
  App.tsx
  main.tsx
  vite-env.d.ts
```

---

## 6) Reglas de interacción (bloqueo & UX tablas)
- `locked = true` → deshabilita edición/borrado y cambio de campos; solo disponible **toggle de candado**.
- Paginación: **siempre montada**; **oculta** si hay ≤ 5 filas.
- Preferencia de **vista simple/detallada** persistible por evento (cuando aplique); control en **DataTable**.

---

## 7) Plan por fases (propuesta)
1. **Infraestructura UI y tipos** (localdb, DataTable, tipos y esquemas Zod, `lib/ui/*`).
2. **Pestañas funcionales**: Reservas, Gastos, Precios, Selectores.
3. **Resumen**: agregados y métricas principales.
4. **Pulido**: filtros, paginación, persistencia de vista, bloqueo por fila.

### Entregables por sprint (orientativo)
- **S1**: DataTable + tipos/esquemas + Selectores (mínimo) + Reservas base con `totalPedido`.
- **S2**: Precios + integración de Selectores con Reservas.
- **S3**: Gastos (simple/detallada) + cálculos IVA.
- **S4**: Resumen + bloqueo completo + persistencia de vista.

---

## 8) Documentación relacionada
- **UML**: `docs/EVENTOS_UML.puml`.
- **Checklist de paridad con Excel**: `docs/Paridad_Excel_Checklist.md`.
- **Prompts**: `docs/prompts.txt`.

---

## 9) Definición de Hecho (DoD)
- Tipado estricto sin `any`; props booleanas `is*/has*`.
- Ordenación/filtros/paginación por tabla validados.
- Esquemas Zod alineados con UI (`schema.columns.ts` ↔ `zod-to-columns.ts`).
- Cálculos probados con *seed* de ejemplo.
- Bloqueo impide modificaciones salvo toggle de candado.
- README/mini-doc por página cuando aplique.
