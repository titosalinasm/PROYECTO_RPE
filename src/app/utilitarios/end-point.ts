import { environment } from "src/environments/environment";

export const END_POINTS = {
  //MC GESTION DE PRODUCTOS /maestro/gestion/producto
  //API  region http://20.236.129.139:8020/swagger-ui/index.html
  region: {
    listar: environment.apiRoot.gestion_producto+'/region/regiones/paginado',
  },
  //API  sector http://20.236.129.139:8020/swagger-ui/index.html
  sector: {
    listar: environment.apiRoot.gestion_producto+'/sector/sectores/paginado',
  },
  //API  Linea de producto http://20.236.129.139:8020/swagger-ui/index.html
  linea_producto: {
    listar: environment.apiRoot.gestion_producto+'/linea/lineas/paginado',
  },
  //API producto http://20.236.129.139:8020/swagger-ui/index.html
  producto: {
    listar: environment.apiRoot.gestion_producto+'/producto/productos/paginado',
  },
  //API resuisito http://20.236.129.139:8020/swagger-ui/index.html
  requisito: {
    crear_actualizar: environment.apiRoot.gestion_producto+'/requisito/requisito',
    listar_paginado: environment.apiRoot.gestion_producto+'/requisito/requisitos/paginado',
    listar: environment.apiRoot.gestion_producto+'/requisito/requisitos',
    crear: environment.apiRoot.gestion_producto+'/requisito/requisito',
    eliminar: environment.apiRoot.gestion_producto+'/requisito/requisito/',
  },
  //MC GESTION DE USUARIO seguridad/gestion/usuario
  usuario: {
    iniciar_sesion: '/api/v1/usuario/usuario.json',
    crearActualiza: environment.apiRoot.gestion_usuario+'/usuario/usuario',
    listar_usuario_perfil: environment.apiRoot.gestion_usuario+'/usuario/usuarios/',
    eliminar: environment.apiRoot.gestion_usuario+'/usuario/usuario/',
    validar: environment.apiRoot.gestion_usuario+'/usuario/usuarios'
  },
  //API Seguridad parametro http://20.236.129.139:8030/swagger-ui/index.html
  parametro: {
    listar: environment.apiRoot.gestion_usuario+'/parametro/parametros',
  },
  //API Seguridad perfil http://20.236.129.139:8030/swagger-ui/index.html
  perfil: {
    listar: environment.apiRoot.gestion_usuario+'/perfil/perfiles',
  },
  //API Seguridad menu http://20.236.129.139:8030/swagger-ui/index.html
  menu: {
    listar: environment.apiRoot.gestion_usuario+'/menu/menus/',
  },
  //MC GESTION ORGANIZACION maestro/gestion/organizacion
  //API entidad Prestadora http://20.236.129.139:8010/swagger-ui/index.html
  entidad_prestadora: {
    crear_actualizar: environment.apiRoot.gestion_organizacion+'/entidad/entidad',
    listar_paginado: environment.apiRoot.gestion_organizacion+'/entidad/entidades/paginado',
    // crear: 'entidad-prestadora/entidad-prestadora/entidad',
    eliminar: environment.apiRoot.gestion_organizacion+'/entidad/entidad/',
  },
  //API organizacion rpe http://20.236.129.139:8010/swagger-ui/index.html
  organizacion_rpe: {
    listar_paginado:  environment.apiRoot.gestion_organizacion+'/organizacionrpe/organizaciones/paginado',
    crear: environment.apiRoot.gestion_organizacion+'/organizacionrpe/organizacion',
    eliminar: environment.apiRoot.gestion_organizacion+'/organizacionrpe/organizacion/',
  },
  //-----------------------ORQUESTADORES-------------------------------------
  //API Orquestador de usuario http://20.236.129.139:8040/swagger-ui/index.html
  usuarioOrquestador: {
    listar: environment.apiRoot.orquestador_usuario+'/usuario/paginado',
    eliminar: environment.apiRoot.orquestador_usuario+'/usuario/',
    crearActualiza: environment.apiRoot.orquestador_usuario+'/usuario',
    obtenerDetalle: environment.apiRoot.orquestador_usuario+'/usuario/',
  },
  convocatoria:{
    crea_actualiza : environment.apiRoot.gestion_convocatoria+'/convocatoria/convocatoria',
    listar: environment.apiRoot.gestion_convocatoria+'/convocatoria/convocatorias/paginado',
    eliminar: environment.apiRoot.gestion_convocatoria+''
  }


};
