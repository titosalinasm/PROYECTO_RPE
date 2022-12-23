// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiGateway: "http://20.236.129.139",
  apiRoot:{
    gestion_organizacion: '/api/v1/maestro/gestion/organizacion',
    gestion_producto: '/api/v1/maestro/gestion/producto',
    gestion_usuario: '/api/v1/seguridad/gestion/usuario',
    orquestador_usuario: '/api/v1/seguridad/orquestador/usuario',
    gestion_convocatoria : '/api/v1/convocatoria/gestion/convocatoria'
  },

  recaptcha:{siteKey:''}
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
