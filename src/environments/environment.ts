// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiGateway: "http://20.236.129.139:8010",
  apiMaestroOrganizacionRpe : 'http://20.236.129.139:8030',
  apiMaestroLineaProducto : 'http://20.236.129.139:8020',
  apiMaestroProducto : 'http://20.236.129.139:8050',
  apiMaestroRegion: 'http://20.236.129.139:8060',
  apiMaestroSector : 'http://20.236.129.139:8080',
  apiMaestroRequisito: 'http://20.236.129.139:8070',
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
