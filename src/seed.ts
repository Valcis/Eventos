import { seed } from './store/localdb'
seed('eventos',[{ id:'e1', nombre:'Congreso Tech', fecha:'2025-10-20', ubicacionId:'u1', presupuesto:20000, createdAt:'2025-01-05', updatedAt:'2025-01-05', isActive:true }])
seed('ubicaciones',[{ id:'u1', nombre:'Auditorio Central', direccion:'C/ Mayor 1', capacidad:500, createdAt:'2025-01-01', updatedAt:'2025-01-01', isActive:true }])
seed('asistentes',[{ id:'a1', nombre:'Ana Pérez', email:'ana@example.com', telefono:'600123123', eventoId:'e1', checkedIn:false, createdAt:'2025-03-01', updatedAt:'2025-03-01', isActive:true }])
seed('proveedores',[{ id:'p1', nombre:'Catering Deluxe', categoria:'Catering', contacto:'catering@example.com', createdAt:'2025-03-02', updatedAt:'2025-03-02', isActive:true }])
seed('entradas',[{ id:'t1', eventoId:'e1', tipo:'General', precio:50, disponibles:200, createdAt:'2025-03-03', updatedAt:'2025-03-03', isActive:true }])
seed('gastos',[{ id:'g1', eventoId:'e1', categoria:'Publicidad', monto:1200, notas:'Redes sociales', createdAt:'2025-03-04', updatedAt:'2025-03-04', isActive:true }])
seed('precios',[{ id:'pr1', eventoId:'e1', concepto:'General', importe:50, createdAt:'2025-03-05', updatedAt:'2025-03-05', isActive:true }])