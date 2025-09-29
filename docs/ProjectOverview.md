# Project Overview — EVENTOS (estructura vigente, sep 2025)

>Este documento describe la organización funcional y técnica del proyecto según los requisitos acordados, manteniendo el look & feel actual y enfocándonos en funcionalidad y versatilidad.



## 1) Visión general
- SPA con **React + Vite + TypeScript**.
- Navegación por evento: `/eventos/:id` con pestañas: **Resumen, Reservas, Gastos, Precios, Selectores** (sin *Balance* de momento).
- Persistencia local temporal vía **localdb** (tablas por entidad) para desarrollo.
- **Tablas** con ordenación asc/desc, paginación (tamaño seleccionable y página visible) y filtros.
- **Convenciones**: TypeScript estricto (sin `any`), props booleanas `is*/has*`, imports mínimos.

## 2) Rutas & páginas
- `/` → **Home**: crea/lista eventos y navega a `/eventos/:id`.
- `/eventos/:id` → **EventLayout**: layout + Tabs.
  - **Resumen**: tarjetas con *Gasto acumulado* y *Reservas confirmadas*.
  - **Reservas**: listado CRUD con calculadora de **Total Pedido** a partir de precios del evento.
  - **Gastos**: listado CRUD con **vista detallada**/**simple** (conmutables) y soporte de IVA y *pack*.
  - **Precios**: listado CRUD de conceptos/unidades y soporte de *pack*.
  - **Selectores**: gestión de opciones dinámicas por evento: `tipoConsumo`, `metodoPago`, `receptor`, `puntoRecogida`.

## 3) UI compartida y patrones
- **DataTable** (`src/components/ui/DataTable/`)
  - Entrada principal `index.tsx`.
  - **Paginación**: `Pagination.tsx`. El paginador **se monta siempre** y se **oculta** cuando `totalItems <= 5`.
  - Tipos en `types.ts` (`SortState`, `Density`, `ColumnDef`, …).
  - **Toggle de vista (simple/detallada)**: control en **DataTable** (botón central del header). La barra de filtros puede exponerlo, pero por defecto el control vive en la tabla.
- **FilterBar** (`src/components/ui/FilterBar/FilterBar.tsx`)
  - Definición dirigida por *presets* por pestaña.
  - Soporta estado controlado, *debounce*, modo colapsable y atajos (Enter/Escape). Puede exponer `densityMode` si se configura.
- **Feedback y acciones**
  - **Toast** (`src/components/ui/Toast/…`): `useToast`, `ToastProvider`.
  - **AlertConfirm** (`src/components/ui/AlertConfirm/…`): `useAlertConfirm`, modal de confirmación.
  - **Bloqueo por fila** (`locked`): deshabilita edición/borrado y solo permite alternar candado.
- Otros UI: `ActiveCheckbox`, `IconButton`, `MiniTable`, `Modal`, `FormField`, `TabsNav`.

## 4) Datos, validación y cálculos
- **Modelo base** (`src/lib/shared/types.ts`)
  - `BaseEntity`: `{ id, createdAt, updatedAt, isActive }`.
- **Entidades principales**
  - **Reserva**: `{ eventoId, cliente, parrilladas, picarones, tipoConsumo, puntoRecogida?, metodoPago, receptor?, totalPedido, pagado, comprobado, locked, …base }`.
  - **Gasto**: `{ eventoId, producto, unidad, cantidad, tipoPrecio ('bruto'|'neto'), tipoIVA, base, iva, total, isPack, unidadesPack?, precioUnidad?, pagador?, tienda?, notas?, comprobado, locked, …base }`.
  - **Precio** (unidad): `{ nombre, unidad, precioBase, tipoIVA, precioTotal, notas?, isPack, unidadesPack?, …base }`.
  - **Selector**: `{ eventoId, categoria ∈ {'tipoConsumo','metodoPago','receptor','puntoRecogida'}, valor, habilitado, orden, …base }`.
- **Validación**
  - Esquemas **Zod** por entidad (`src/lib/**/validators.ts`). Normalización de inputs (trim, límites) en los esquemas.
- **Cálculos**
  - **Reservas**: `totalPedido = parrilladas*precio.parrilladas + picarones*precio.picarones`.
  - **Gastos**: si `tipoPrecio='bruto'` → `base = total / (1 + IVA%)`; si `tipoPrecio='neto'` → `total = base + base*IVA%`.
  - **Resumen**: agregados de reservas y gastos (sin aforo/ubicaciones).

## 5) Estructura de carpetas (actual)
```
src/
  components/
    FormField.tsx
    Modal.tsx
    TabsNav.tsx
    ui/
      ActiveCheckbox.tsx
      IconButton.tsx
      MiniTable.tsx
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
      DataTable/
        index.tsx
        Pagination.tsx
        types.ts
      FilterBar/
        FilterBar.tsx
        types.ts
  features/
    selectors/
      config.ts
      SelectorsCard.tsx
      SelectorsModal.tsx
  lib/
    evento/
      types.ts
      validators.ts
    gastos/
      api.ts
      calculations.ts
      filters.ts
      hooks.ts
      index.ts
      presets.ts
      table.ts
      types.ts
      validators.ts
    precios/
      presets.ts
      types.ts
      validators.ts
    reservas/
      calculations.ts
      presets.ts
      types.ts
      validators.ts
    resumen/
      calculations.ts
    selectores/
      types.ts
      validators.ts
    shared/
      format.ts
      types.ts
      utils/
        crud.ts
  pages/
    Home.tsx
    evento/
      EventLayout.tsx
      Resumen.tsx
      Reservas.tsx
      Gastos.tsx
      Precios.tsx
      Selectores.tsx
  store/
    localdb.ts
  styles/
    index.css
  App.tsx
  main.tsx
```

## 6) Reglas de interacción (bloqueo & UX tablas)
- `locked = true` → no se puede editar, borrar ni cambiar campos/checkboxes; solo disponible el icono de **candado** para alternar.
- **Paginación**: montada siempre; **oculta** si hay ≤ 5 filas.
- **Vista simple/detallada**: control por **DataTable** y persistencia de preferencia por evento (cuando aplique).

## 7) Plan por fases (propuesta)
1. **Infraestructura UI y tipos** (localdb, DataTable, tipos y esquemas Zod).
2. **Pestañas funcionales**: Reservas, Gastos, Precios, Selectores.
3. **Resumen**: agregados y métricas principales.
4. **Pulido**: filtros, paginación, persistencia de vista, bloqueo por fila.

### Entregables por sprint (orientativo)
- **S1**: DataTable + tipos/esquemas + Selectores (mínimo) + Reservas base con `totalPedido`.
- **S2**: Precios + integración de Selectores con Reservas.
- **S3**: Gastos (simple/detallada) + cálculos IVA.
- **S4**: Resumen + bloqueo completo + persistencia de vista.

## 8) Definición de Hecho (DoD)
- Tipado estricto sin `any`; props booleanas `is*/has*`.
- Ordenación/filtros/paginación por tabla validados.
- Cálculos probados con *seed* de ejemplo.
- Bloqueo impide modificaciones salvo toggle de candado.
- README/mini-doc por página cuando aplique.
