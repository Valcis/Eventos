import {registerTablePreset, registerSearchPreset} from '../shared/ui/presets/registry';

registerTablePreset('metodoPago', {columns: ['nombre', 'activo', 'requiereReceptor'], hidden: ['notas']});
registerSearchPreset('metodoPago', {fields: ['nombre', 'activo', 'requiereReceptor']});

registerTablePreset('receptorCobrador', {columns: ['nombre', 'activo'], hidden: ['notas']});
registerSearchPreset('receptorCobrador', {fields: ['nombre', 'activo']});

registerTablePreset('tipoConsumo', {columns: ['nombre', 'activo'], hidden: ['notas']});
registerSearchPreset('tipoConsumo', {fields: ['nombre', 'activo']});

registerTablePreset('comercial', {columns: ['nombre', 'activo'], hidden: ['notas']});
registerSearchPreset('comercial', {fields: ['nombre', 'activo']});

registerTablePreset('tienda', {columns: ['nombre', 'activo', 'direccion', 'horario'], hidden: ['notas']});
registerSearchPreset('tienda', {fields: ['nombre', 'activo', 'direccion', 'horario']});

registerTablePreset('pagador', {columns: ['nombre', 'activo'], hidden: ['notas']});
registerSearchPreset('pagador', {fields: ['nombre', 'activo']});

registerTablePreset('unidad', {columns: ['nombre', 'activo'], hidden: ['notas']});
registerSearchPreset('unidad', {fields: ['nombre', 'activo']});

registerTablePreset('puntoRecogida', {columns: ['nombre', 'activo', 'direccion', 'horario', 'comentarios']});
registerSearchPreset('puntoRecogida', {fields: ['nombre', 'activo', 'direccion', 'horario', 'comentarios']});
