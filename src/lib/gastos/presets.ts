import {registerTablePreset, registerSearchPreset} from '../shared/ui/presets/registry';

registerTablePreset('gastos', {
    columns: ['producto', 'unidadId', 'cantidad', 'tipoPrecio', 'tipoIVA', 'precioBase', 'precioNeto', 'pagadorId', 'tiendaId', 'comprobado'],
    hidden: ['notas', 'isPack', 'unidadesPack', 'precioUnidad', 'locked'],
});
registerSearchPreset('gastos', {
    fields: ['producto', 'unidadId', 'pagadorId', 'tiendaId', 'tipoPrecio', 'comprobado'],
});
