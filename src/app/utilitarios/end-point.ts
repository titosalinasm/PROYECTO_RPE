export const END_POINTS = {
  usuario: {
    iniciar_sesion : "/api/v1/usuario/usuario.json"
  },
  entidad_prestadora: {
    crear_actualizar: '/api/v1/maestro/entidad-prestadora/entidad',
    listar_paginado: '/api/v1/maestro/entidad-prestadora/entidades/paginado',
    crear: '/api/v1/maestro/entidad-prestadora/entidad',
    eliminar: '/api/v1/maestro/entidad-prestadora/entidad/'
  },
  organizacion_rpe :{
    listar_paginado : '/api/v1/maestro/organizacionrpe/organizaciones/paginado',
    crear: '/api/v1/maestro/organizacionrpe/organizacion',
    eliminar:'/api/v1/maestro/organizacionrpe/organizacion/'
  },
  requisito: {
    crear_actualizar: '/api/v1/maestro/requisito/requisito',
    listar_paginado: '/api/v1/maestro/requisito/requisitos/paginado',
    crear: '/api/v1/maestro/requisito/requisito',
    eliminar: '/api/v1/maestro/requisito/requisito/'
  },
  linea_producto:{
    listar: '/api/v1/maestro/linea/lineas/paginado'
  },
  producto:{
    listar:'/api/v1/maestro/producto/productos/paginado'
  },
  sector:{
    listar: '/api/v1/maestro/sector/sectores/paginado'
  },
  region:{
    listar:'/api/v1/maestro/region/regiones/paginado'
  }
};
