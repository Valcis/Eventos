# Estructura del proyecto (propuesta aprobada)

Este documento describe la organización funcional y técnica del proyecto según los requisitos acordados, manteniendo el look & feel actual y enfocándonos en funcionalidad y versatilidad.

## Visión general

- SPA con React + Vite + TypeScript.
- Rutas por evento con pestañas: Resumen, Reservas, Ubicaciones, Gastos, Proveedores, Precios, Balance y Selectores (nuevo).
- Persistencia local (localdb) por tabla.
- Tablas con: orden asc/desc, paginación con tamaño seleccionable y número de página visible, filtros por columna.

## Rutas y páginas

- `/` → Home
  - Crea/lista eventos y navega a `/eventos/:id`.
- `/eventos/:id` → EventLayout (layout del evento + Tabs)
  - Resumen: tarjetas con Gasto acumulado, Reservas confirmadas y Aforo disponible.
  - Reservas: tabla con columnas
    - Cliente
    - Parrilladas
    - Picarones
    - Tipo de consumo (selector dinámico por evento; categoría: tipoConsumo)
    - Punto de Recogida (selector; intersecta Selectores habilitados con Ubicaciones habilitadas)
    - Método de pago (selector dinámico; categoría: metodoPago)
    - Receptor (selector dinámico; categoría: receptor)
    - Total Pedido (calculado en base a Precios del evento: “parrilladas”, “picarones”)
    - Pagado (checkbox)
    - Comprobado (checkbox)
    - Acciones (editar, borrar, bloquear)
    - Regla de bloqueo: si locked=true → no se puede editar ni borrar, ni cambiar campos/checkboxes; solo disponible icono de candado para desbloquear.
  - Ubicaciones: tabla con columnas
    - Nombre
    - Dirección
    - Teléfono
    - Horario
    - Comentarios
    - Habilitado (checkbox)
    - Acciones
  - Gastos:
    - Vista simple (por defecto): Producto, Unidad, Cantidad, Total con IVA, ¿Pack?, Unidades en pack, Precio por unidad, Pagador, Tienda, Notas, Comprobado, Acciones
    - Vista detallada (conmutador): añade Tipo de precio, Tipo IVA (%), Base (sin IVA), IVA (€)
    - Preferencia de vista persistida por evento.
    - Regla de bloqueo como en Reservas.
  - Proveedores: se mantiene (con Acciones).
  - Precios: tabla con columnas
    - Concepto
    - Importe
    - Acciones (edición, borrado, bloqueo)
    - Nota: los conceptos que impactan Reservas incluyen “parrilladas” y “picarones”.
  - Balance: reservado para cálculos avanzados futuros.
  - Selectores (nuevo): gestiona opciones dinámicas por evento para:
    - tipoConsumo
    - metodoPago
    - receptor
    - puntoRecogida (se cruza con Ubicaciones habilitadas al usarlo en Reservas)
    - Cada opción: valor, habilitado, orden.

## Cálculos y reglas

- Resumen:
  - Gasto acumulado: suma(Gastos.total).
  - Reservas confirmadas: totales agregados de parrilladas y picarones.
  - Aforo disponible: capacidad de la Ubicación asociada al evento − suma(parrilladas con tipoConsumo = “comer_aqui”).
- Reservas:
  - Total Pedido = (parrilladas × precio.parrilladas) + (picarones × precio.picarones).
- Gastos:
  - Si tipoPrecio = “bruto” → total incluye IVA → base = total / (1 + IVA%), iva = total − base.
  - Si tipoPrecio = “neto” → base provista → iva = base × IVA%, total = base + iva.
  - Soporte de pack: precioUnidad y unidadesPack derivados/mostrados.
- Bloqueo:
  - locked=true → deshabilita edición, borrado y cambios de campos; solo icono de candado para desbloqueo.

## Estructura de carpetas

- src/
  - app/
    - router.tsx (definición central de rutas)
  - components/
    - ui/
      - DataTable/
        - DataTable.tsx (wrapper genérico con sorting, paginación y filtros por columna)
        - DataTableToolbar.tsx (buscador global, filtros extra, conmutadores)
        - Pagination.tsx
      - Modal.tsx
      - FormField.tsx
      - Select.tsx
      - Checkbox.tsx
      - Input.tsx
      - Textarea.tsx
      - Toggle.tsx
      - ActionsCell.tsx (gestiona bloqueo)
    - resumen/
      - ResumenCards.tsx
    - reservas/
      - ReservaFormModal.tsx
      - ReservaFilters.tsx
    - ubicaciones/
      - UbicacionFormModal.tsx
    - gastos/
      - GastoFormModal.tsx
      - GastoViewSwitch.tsx
    - precios/
      - PrecioFormModal.tsx
    - selectores/
      - SelectorFormModal.tsx
  - pages/
    - Home.tsx
    - evento/
      - EventLayout.tsx
      - Resumen.tsx
      - Reservas.tsx
      - Ubicaciones.tsx
      - Gastos.tsx
      - Proveedores.tsx
      - Precios.tsx
      - Balance.tsx
      - Selectores.tsx
  - lib/
    - crud.ts (tipado estricto, sin any)
    - calculations/
      - resumen.ts
      - reservas.ts
      - gastos.ts
    - tables/
      - reservas.columns.ts
      - ubicaciones.columns.ts
      - gastos.columns.simple.ts
      - gastos.columns.detailed.ts
      - precios.columns.ts
      - selectores.columns.ts
    - utils/
      - id.ts
      - dates.ts
      - format.ts
      - filters.ts
    - validators/
      - schemas.ts (Zod)
    - view/
      - views.ts (persistencia de vista de Gastos por evento)
  - store/
    - localdb.ts (incluye tablas: eventos, reservas, ubicaciones, gastos, proveedores, precios, selectores)
    - selectors/
      - eventos.ts
      - reservas.ts
      - ubicaciones.ts
      - gastos.ts
      - precios.ts
      - selectores.ts
  - types/
    - index.ts (tipos compartidos)
      - Reserva: {
        id, eventoId, cliente:string,
        parrilladas:number, picarones:number,
        tipoConsumo:'comer_aqui'|'para_llevar'|'domicilio',
        puntoRecogidaId?:ID,
        metodoPago:'efectivo'|'tarjeta'|'bizum',
        receptor?:string,
        totalPedido:number,
        pagado:boolean, comprobado:boolean, locked:boolean,
        createdAt, updatedAt, isActive
        }
      - Ubicacion: {
        id, eventoId, nombre, direccion,
        telefono?:string, horario?:string, comentarios?:string,
        habilitado:boolean, createdAt, updatedAt, isActive
        }
      - Gasto: {
        id, eventoId, producto:string, unidad:string, cantidad:number,
        tipoPrecio:'bruto'|'neto', tipoIVA:number,
        base:number, iva:number, total:number,
        isPack:boolean, unidadesPack?:number, precioUnidad?:number,
        pagador?:string, tienda?:string, notas?:string,
        comprobado:boolean, locked:boolean,
        createdAt, updatedAt, isActive
        }
      - Precio: { id, eventoId, concepto:'parrilladas'|'picarones'|string, importe:number, createdAt, updatedAt, isActive }
      - Selector: { id, eventoId, categoria:'tipoConsumo'|'metodoPago'|'receptor'|'puntoRecogida', valor:string, habilitado:boolean, orden:number, createdAt, updatedAt, isActive }
- styles/
  - index.css (utilidades y clases base btn/card/input/table)
- App.tsx, main.tsx, seed.ts (semillas para nuevas tablas y selectores por evento)

---

# Plan de ejecución y reparto

## Fases

1. Infra UI y Tipos (base de datos local, DataTable genérica, tipos y esquemas)
2. Pestañas funcionales (Reservas, Gastos, Precios, Selectores)
3. Resumen (cálculos agregados) y reglas de aforo
4. Pulido: filtros, paginación avanzada, persistencia de vista, bloqueo por fila
5. Balance (posterior)

## Tareas (AI Assistant)

- Definir tipos y esquemas Zod en lib/[tab_name]/*.
- Implementar DataTable genérica (sorting, paginación, filtros).
- Implementar columns TS para cada tabla.
- Implementar calculations (reservas, gastos, resumen).
- Implementar Selectores.tsx y SelectorFormModal.tsx.
- Integrar bloqueo en ActionsCell y en formularios.
- Ajustar seed para datos de prueba.
- Actualizar router y páginas base.

## Tareas (Junie)

- Crear issues y milestones por fase.
- Orquestar PRs por módulo (reservas, ubicaciones, gastos, precios, selectores).
- Configurar CI (lint, typecheck, build) y reglas de revisión.
- Gestionar etiquetas (bug, feat, chore) y releases internos.
- Coordinar testing manual por checklist de cada vista.
- Planificar Balance para siguiente iteración.

## Tareas (tú)

- Validar modelo de datos (tipos y categorías de Selectores).
- Revisar y ajustar textos/UX de formularios y columnas.
- Confirmar reglas de IVA por defecto y ejemplos de precios.
- Aportar feedback sobre vista simple vs detallada en Gastos.
- Aprobar PRs y decidir orden de despliegue de funcionalidades.

## Entregables por sprint

- Sprint 1: DataTable + tipos/esquemas + Selectores (mínimo) + Reservas (tabla con totalPedido).
- Sprint 2: Ubicaciones + Precios + integración Selectores con Reservas.
- Sprint 3: Gastos (simple/detallada) + cálculos IVA.
- Sprint 4: Resumen (agregados) + bloqueo completo + persistencia de vista.
- Sprint 5: Balance (diseño y primeros cálculos).

## Definiciones clave de listo (DoD)

- Tipado estricto sin `any`, imports sin alias.
- Sorting/filtros/paginación funcionando por tabla.
- Cálculos validados con pruebas de ejemplo (seed).
- Bloqueo impide todas las modificaciones excepto toggle de candado.
- Documentación mínima en cada página: breve README en docs/ si aplica.

---

¿Doy inicio con Sprint 1 (tipos, schemas, DataTable y Selectores + Reservas base) y abro las primeras tareas en issues?

## Validación y formato (implementación inicial)

- Validadores por entidad en src/lib/validators/ (iniciado con gastos.ts). Se usan esquemas Zod y tipos inferidos.
- Normalización de inputs (trim y límites) a través de los esquemas.
- Formateo centralizado en src/lib/format.ts (moneda EUR y números con 2/4 decimales). Tablas de Gastos usan estos helpers.
