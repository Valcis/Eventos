# WebEventos — Paridad Excel ↔ App & Plan de Implementación
**Fecha:** 2025-09-26 17:08


Este documento consolida **todo** lo necesario para llevar a paridad el Excel `NOTOCAR.xlsx` con la app **WebEventos** y continuar la implementación. Incluye: descripción del Excel, mapeo funcional a la app, gaps detectados, checklist accionable, y *snippets* listos para pegar.

---

## 1) Qué hace el Excel y cómo está montado

El archivo Excel funciona como un **mini-ERP** para gestionar **ventas** (pedidos) y **costes** (gastos/ingredientes) de un evento/negocio de comida, con listas maestras, parámetros de precios y validaciones.

### 1.1 Hojas principales
- **Pedidos Reservados**  
  Campos: _Cliente, Comercial, Parrillada, Picarones, Tipo de consumo, Punto de recogida, Método de pago, Receptor (Bizum), Total pedido (calculado), Pagado, Comprobado, Observaciones_.  
  **Validaciones/Reglas:**  
  - Listas para `Comercial`, `Tipo de consumo`, `Método de pago`, `Pagado/Comprobado` y `Punto de recogida`.  
  - **Reglas condicionales:**  
    - Si `Tipo de consumo = "comer aquí"` ⇒ **Punto de recogida** debe estar vacío.  
    - Si `Método de pago ≠ "bizum"` ⇒ **Receptor (beneficiario)** debe quedar vacío.  
  **Cálculo:** `Total pedido` se calcula con precios desde **Config** según `Tipo de consumo`.

- **Gastos e Ingredientes**  
  Campos clave: _Producto, Unidad, Cantidad, Tipo de precio (Con/Sin IVA), IVA %, Base sin IVA, IVA €, Total con IVA, ¿Pack?, Unidades por pack, Precio por unidad, Pagador, Tienda, Comprobado, Notas_.  
  **Lógica:** cálculo coherente **Base/IVA/Total** según `Tipo de precio` y **Precio por unidad** considerando packs.

- **Selectores (maestros)**  
  Catálogos para: _Comerciales, MétodosPago, BenefBizum, Tiendas, Unidades, Sí/No, TiposPrecio, TipoConsumo, Pagadores_.  
  Se usan como fuentes de **listas desplegables**.

- **Config (parámetros)**  
  `PRECIO_PARR_AQUI`, `PRECIO_PARR_REC`, `PRECIO_PICARONES` expuestos como rangos con nombre y usados por fórmulas.

- **Puntos de Recogida**  
  Maestro: _Nombre, Dirección, Horario, Comentarios_. Alimenta la lista de puntos en Pedidos.

### 1.2 Rangos con nombre y validaciones
- **Listas:** `Lista_Comerciales`, `Lista_MetodosPago`, `Lista_BenefBizum`, `Lista_Tiendas`, `Lista_Unidades`, `Lista_SiNo`, `Lista_TiposPrecio`, `Lista_TipoConsumo`, `Lista_Pagadores`, `Lista_PuntosRecogida`.
- **Parámetros:** `PRECIO_PARR_AQUI`, `PRECIO_PARR_REC`, `PRECIO_PICARONES`.
- **Reglas condicionales (negocio):**  
  - `punto_recogida` depende de `tipo_consumo`.  
  - `receptor_bizum` depende de `metodo_pago`.  
  - Coherencias IVA/Base/Total en gastos y packs.

---

## 2) App WebEventos — qué hay y qué falta (mapa a alto nivel)

> Nota: tu repo ya incluye páginas por entidad (Asistentes, Reservas, Gastos, Precios, Ubicaciones, Proveedores, Resumen, Balance), componentes base (DataTable modular, Toolbar, Pagination), tablas de columnas y seeds/store local. Los gaps clave están en **schemas por entidad**, **normalización**, **formateo monetario/fecha** y **tests**.

### 2.1 Mapeo Excel → Web
| Excel | Entidad/Función esperada en la Web | Estado típico | Gap principal |
|---|---|---|---|
| Pedidos Reservados | **Pedido/Reserva** con cálculo de **total** y **reglas condicionales** | Página de Reservas/Pedidos | Falta **schema** por entidad + **lógica de cálculo** + **validación condicional** |
| Gastos e Ingredientes | **Gasto**: coherencia IVA/Base/Total + **packs** | Página de Gastos + columnas | Falta **schema** + **funciones de dominio** + **tests** |
| Selectores | Catálogos maestros | Página Selectores | Falta tipado/validators por catálogo + uso uniforme |
| Config | Parámetros `PRECIO_*` | Seed/Store | Falta **módulo Config** con hook/servicio e integración en cálculo |
| Puntos de Recogida | Maestro de puntos | Página Ubicaciones | Verificar mapeo exacto y uso en reglas de Pedido |
| Validaciones generales | Normalización + error handling | Parcial | Faltan **normalizers** y aplicación sistemática |
| Formatos | € y fechas ES | Parcial | Faltan **formatters** centralizados |
| Calidad | Pruebas de dominio/UX | Ausente | Faltan **tests** (cálculos, reglas, render) |

---

## 3) Reglas de negocio (de Excel) a replicar en la Web

### 3.1 Pedidos/Reservas
- `punto_recogida`:  
  - **Obligatorio** si `tipo_consumo = "recoger"`.  
  - **Prohibido** si `tipo_consumo = "comer_aqui"`.
- `receptor_bizum`:  
  - **Obligatorio** si `metodo_pago = "bizum"`.  
  - **Prohibido** si `metodo_pago ≠ "bizum"`.
- `total_pedido` =  
  `parrilladas * (PRECIO_PARR_AQUI | PRECIO_PARR_REC según tipo_consumo) + picarones * PRECIO_PICARONES`.

### 3.2 Gastos/Ingredientes
- Coherencia **Base/IVA/Total** según `tipo_precio` (Con/Sin IVA).  
- `precio_unitario` = `total_con_iva / (cantidad * unidades_por_pack)` si pack; si no, `total_con_iva / cantidad`.  
- `iva_pct` ∈ {{4, 10, 21}}. Validación de números finitos y no negativos.

---

## 4) Checklist de implementación (claro y accionable)

> Orden recomendado: **Dominio/Validación → UI → Tests → Documentación**.

### A. Normalización y Formatos
- [ ] Crear `src/lib/normalizers.ts` y aplicarlo en cada formulario:
  ```ts
  export const normalizeStr = (s: unknown, max=200) => String(s??"").normalize("NFC").trim().slice(0,max);
  export const normalizeMoney = (n: unknown) => {
    const num = typeof n === "string" ? Number(n.replace(/[^\d.-]/g,"")) : Number(n);
    return Number.isFinite(num) ? num : 0;
  };
  ```
- [ ] Crear `src/lib/format.ts` y usarlo en tablas y UI:
  ```ts
  const LOCALE="es-ES";
  export const fmtMoney=(n:number)=>new Intl.NumberFormat(LOCALE,{style:"currency",currency:"EUR"}).format(n);
  export const fmtDate=(iso:string|Date)=>new Intl.DateTimeFormat(LOCALE,{dateStyle:"medium"}).format(typeof iso==="string"?new Date(iso):iso);
  ```

### B. Validators por entidad
- [ ] Dividir `validators/schemas.ts` en archivos por entidad (y re-exportar en `validators/index.ts`):  
  `validators/pedido.ts`, `validators/gastos.ts`, `validators/asistentes.ts`, `validators/reservas.ts`, `validators/proveedores.ts`, `validators/ubicaciones.ts`, `validators/precios.ts`.

**Ejemplo — Pedido (reglas Excel):**
```ts
import { z } from "zod";
export const PedidoSchema = z.object({
  cliente: z.string().trim().min(1),
  comercialId: z.string().trim().min(1),
  parrillada: z.number().int().min(0),
  picarones: z.number().int().min(0),
  tipoConsumo: z.enum(["comer_aqui","recoger"]),
  puntoRecogidaId: z.string().trim().optional(),
  metodoPago: z.enum(["bizum","tarjeta","efectivo","transferencia"]),
  receptorBizum: z.string().trim().optional(),
  pagado: z.boolean().default(false),
  comprobado: z.boolean().default(false),
  observaciones: z.string().trim().max(500).optional()
}).superRefine((v, ctx) => {
  if (v.tipoConsumo === "comer_aqui" && v.puntoRecogidaId)
    ctx.addIssue({ code:"custom", path:["puntoRecogidaId"], message:"No indicar punto si es 'comer aquí'." });
  if (v.tipoConsumo === "recoger" && !v.puntoRecogidaId)
    ctx.addIssue({ code:"custom", path:["puntoRecogidaId"], message:"Punto de recogida obligatorio si es 'recoger'." });
  const esBizum = v.metodoPago === "bizum";
  if (esBizum && !v.receptorBizum)
    ctx.addIssue({ code:"custom", path:["receptorBizum"], message:"Receptor Bizum obligatorio con Bizum." });
  if (!esBizum && v.receptorBizum)
    ctx.addIssue({ code:"custom", path:["receptorBizum"], message:"No indicar receptor si no es Bizum." });
});
export type Pedido = z.infer<typeof PedidoSchema>;
```

**Ejemplo — Gasto (coherencia IVA/Base/Total + packs):**
```ts
import { z } from "zod";
export const GastoSchema = z.object({
  producto: z.string().trim().min(1),
  unidadId: z.string().trim().min(1),
  cantidad: z.number().positive(),
  tipoPrecio: z.enum(["con_iva","sin_iva"]),
  ivaPct: z.union([z.literal(4), z.literal(10), z.literal(21)]),
  base: z.number().nonnegative().optional(),
  ivaEur: z.number().nonnegative().optional(),
  total: z.number().nonnegative().optional(),
  esPack: z.boolean().default(false),
  unidadesPorPack: z.number().int().nonnegative().default(0),
}).superRefine((v, ctx) => {
  if (v.tipoPrecio === "sin_iva") {
    if (!(v.base >= 0)) ctx.addIssue({ code:"custom", path:["base"], message:"Base requerida (sin IVA)." });
    const iva = (v.base ?? 0) * (v.ivaPct/100);
    const total = (v.base ?? 0) + iva;
    if (v.total != null && Math.abs(v.total - total) > 0.01)
      ctx.addIssue({ code:"custom", path:["total"], message:"Total no cuadra con Base + IVA." });
  } else {
    if (!(v.total >= 0)) ctx.addIssue({ code:"custom", path:["total"], message:"Total con IVA requerido." });
    const baseCalc = (v.total ?? 0) / (1 + v.ivaPct/100);
    if (v.base != null && Math.abs(v.base - baseCalc) > 0.01)
      ctx.addIssue({ code:"custom", path:["base"], message:"Base no cuadra con Total/IVA." });
  }
});
export type Gasto = z.infer<typeof GastoSchema>;

export function precioUnitario(g: Gasto) {
  const unidadesTot = g.esPack ? g.cantidad * Math.max(1, g.unidadesPorPack) : g.cantidad;
  return (g.total ?? 0) / Math.max(1, unidadesTot);
}
```

### C. Cálculos de dominio
- [ ] **Pedido.total** (inyectando Config):
```ts
export type Config = Record<"PRECIO_PARR_AQUI"|"PRECIO_PARR_REC"|"PRECIO_PICARONES", number>;
export function calcularTotalPedido(p: Pick<Pedido,"parrillada"|"picarones"|"tipoConsumo">, cfg: Config) {
  const precioParr = p.tipoConsumo === "comer_aqui" ? cfg.PRECIO_PARR_AQUI : cfg.PRECIO_PARR_REC;
  return p.parrillada * precioParr + p.picarones * cfg.PRECIO_PICARONES;
}
```

### D. Config y catálogos
- [ ] **Hook/servicio** para `Config` (clave/valor) con caché y actualización.  
- [ ] **Modelos** para catálogos (Comerciales, MétodosPago, Pagadores, Tiendas, Unidades, TiposPrecio, TipoConsumo, BenefBizum) y uso como **FK** en entidades.

### E. Integración en páginas
- [ ] Aplicar **normalize → validate (safeParse) → guardar/errores** en: `Pedidos/Reservas`, `Gastos`, `Precios`, `Ubicaciones`, `Proveedores`.  
- [ ] Usar `fmtMoney`/`fmtDate` en las columnas y totales.  
- [ ] Asegurar que `Ubicaciones` (puntos) se utiliza cuando `tipoConsumo="recoger"` (y se prohíbe si `comer_aqui`).

### F. Tests mínimos
- [ ] Pedido.total: combinaciones `(comer_aqui/recoger) × cantidades`.  
- [ ] Pedido reglas: (sin punto/ con punto) y (bizum con receptor / otros sin receptor).  
- [ ] Gasto: `(sin_iva|con_iva) × (4|10|21) × (pack|no pack)`; bordes de redondeo.  
- [ ] Render de tablas: formatos € y fecha, columnas y sorting básico.

### G. Infra (recomendado)
- [ ] `ErrorBoundary` básico, `toast` centralizado, `logger` por entorno, `Skeleton` de carga.  
- [ ] Store local: **namespacing por evento** y **versión de esquema** (migraciones simples).  
- [ ] Seeds: sólo en `import.meta.env.DEV`.

---

## 5) Rutas y UI propuesta (recordatorio)
- `/pedidos` · `/pedidos/nuevo` · `/pedidos/:id`  
- `/gastos` · `/gastos/nuevo` · `/gastos/:id`  
- `/maestros` (tabs: comerciales, métodos pago, pagadores, tiendas, unidades, tipos precio, tipo consumo, beneficiarios Bizum, puntos de recogida)  
- `/config` (parámetros de precios)  
- `/resumen` (KPIs: ventas por comercial, por método de pago, % consumo aquí vs recoger)

---

## 6) Cierre
- El Excel ya define claramente la **regla de negocio**; la web debe **replicarla** con validación y cálculos consistentes.  
- La app ya tiene la **estructura**; ahora el foco es **dominio (schemas/calculations)**, **normalización/formateo** y **tests**.  
- Con este checklist puedes asignar tareas por bloque y cerrar la paridad.  
- Cuando subas cambios, compárteme **raw URLs** de los archivos tocados y te devuelvo revisión puntual con fixes.
