import { registerTablePreset, registerSearchPreset } from '../shared/ui/presets/registry';

registerTablePreset('reservas', {
    columns: ['cliente','parrilladas','picarones','metodoPagoId','receptorId','tipoConsumoId','comercialId','puntoRecogidaId','pagado','comprobado'],
    hidden: ['locked','totalPedido'],
});
registerSearchPreset('reservas', {
    fields: ['cliente','metodoPagoId','receptorId','tipoConsumoId','comercialId','puntoRecogidaId','pagado','comprobado'],
});
