export interface NuevoServicioI {
  idservicio: number,
  identidadprestadora: number,
  idconvocatoria: number,
  idsector: number,
  idlineaproducto: number,
  idproducto: number,
  flagreqevaluaciondeuda: boolean,
  idtiposervicio: number,
  nombreservicio: string,
  descripcionservicio: string,
  objetivoservicio: string,
  fechainicio: Date,
  fechafin: Date,
  nombrecapacitador: string,
  idmodalidad: number,
  numerototalsesiones: number,
  numerototalhoras: number,
  idestadoservicio: number,
  usuariocreacion: string,
  fechacreacion: Date,
  usuariomodificacion: string,
  fechamodificacion: Date,
  estadoregistro: true
}