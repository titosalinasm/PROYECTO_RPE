export interface convocatoriaRespuestaI {
  usuariocreacion: string;
  fechacreacion: Date;
  usuariomodificacion: string;
  fechamodificacion: Date;
  estadoregistro: boolean;
  idconvocatoria: number;
  nombreconvocatora: string;
  fechainicioinscripcion: Date;
  fechafininscripcion: Date;
  fechainicioevaluacion: Date;
  fechafinevaluacion: Date;
  fechainicioconfirmacionep: Date;
  fechafinconfirmacionep: Date;
  fechainicioconfirmacionorg: Date;
  fechafinconfirmacionorg: Date;
  estadoconvocatoria: string;
  flagpublicar: boolean;
  flagmodificar: boolean;
  flageliminar: boolean;
}
