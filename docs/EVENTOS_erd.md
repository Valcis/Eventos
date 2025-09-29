
# EVENTOS — ERD (generado desde el código)

> Fuente: types & validators en `src/lib/*` de la rama `junie` del repo.

```mermaid
erDiagram
  %% ========= Core =========
  Evento {
    string id PK
    string createdAt
    string updatedAt
    boolean isActive
    string nombre
    string fecha
    string ubicacionId?  %% según código actual
    number presupuesto
  }

  Gasto {
    string id PK
    string createdAt
    string updatedAt
    boolean isActive
    string eventoId FK
    string producto
    string unidad       %% libre (selector Unidad.nombre, no FK)
    number cantidad
    enum tipoPrecio     %% 'bruto' | 'neto'
    number tipoIVA
    number base
    number iva
    number total
    boolean isPack
    number unidadesPack?
    number precioUnidad?
    string pagador?     %% libre (selector Pagador.nombre, no FK)
    string tienda?      %% libre (selector Tienda.nombre, no FK)
    string notas?
    boolean comprobado
    boolean locked
  }

  Precio {
    string id PK
    string createdAt
    string updatedAt
    boolean isActive
    string eventoId FK
    string concepto
    number importe
    boolean locked?
  }

  Reserva {
    string id PK
    string createdAt
    string updatedAt
    boolean isActive
    string eventoId FK
    string cliente
    number parrilladas
    number picarones
    enum tipoConsumo       %% 'local' | 'llevar' | 'delivery' (types) / validator acepta otros
    enum metodoPago        %% 'efectivo' | 'tarjeta' | 'bizum' | 'transferencia' (types)
    string receptor?
    number totalPedido
    boolean pagado
    boolean comprobado
    boolean locked
    string puntoRecogidaId?
  }

  %% ========= Selectores (catálogos) =========
  BaseItem {
    string id PK
    string nombre
    boolean activo
    string notas?
  }

  MetodoPago {
    string id PK
    string nombre
    boolean activo
    boolean requiereReceptor?
    string notas?
  }

  Tienda {
    string id PK
    string nombre
    boolean activo
    string direccion?
    string horario?
    string notas?
  }

  PuntoRecogida {
    string id PK
    string nombre
    boolean activo
    string direccion?
    string horario?
    string comentarios?
    string notas?
  }

  %% ========= Relaciones =========
  Gasto }o--|| Evento : "eventoId"
  Precio }o--|| Evento : "eventoId"
  Reserva }o--|| Evento : "eventoId"
  Reserva }o--o| PuntoRecogida : "puntoRecogidaId (opcional)"
```
