export const END_POINTS = {
  usuario: {
    iniciar_sesion: "/api/v1/usuario/usuario.json"
  },
  entidad_prestadora: {
    crear_actualizar: 'entidad-prestadora/api/v1/maestro/entidad-prestadora/entidad',
    listar_paginado: 'entidad-prestadora/api/v1/maestro/entidad-prestadora/entidades/paginado',
    crear: 'entidad-prestadora/api/v1/maestro/entidad-prestadora/entidad',
    eliminar: 'entidad-prestadora/api/v1/maestro/entidad-prestadora/entidad/'
  },
  organizacion_rpe: {
    listar_paginado: 'organizacionrpe/api/v1/maestro/organizacionrpe/organizaciones/paginado',
    crear: 'organizacionrpe/api/v1/maestro/organizacionrpe/organizacion',
    eliminar: 'organizacionrpe/api/v1/maestro/organizacionrpe/organizacion/'
  },
  requisito: {
    crear_actualizar: 'requisito/api/v1/maestro/requisito/requisito',
    listar_paginado: 'requisito/api/v1/maestro/requisito/requisitos/paginado',
    crear: 'requisito/api/v1/maestro/requisito/requisito',
    eliminar: 'requisito/api/v1/maestro/requisito/requisito/'
  },
  linea_producto: {
    listar: 'linea/api/v1/maestro/linea/lineas/paginado'
  },
  producto: {
    listar: 'producto/api/v1/maestro/producto/productos/paginado'
  },
  sector: {
    listar: 'sector/api/v1/maestro/sector/sectores/paginado'
  },
  region: {
    listar: 'region/api/v1/maestro/region/regiones/paginado'
  },
  parametro: {
    listar: 'parametro/api/v1/seguridad/parametro/parametros'
  },
  perfil: {
    listar: 'perfil/api/v1/seguridad/perfil/perfiles'
  }
};
