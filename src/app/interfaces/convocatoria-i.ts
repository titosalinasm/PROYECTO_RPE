export interface convocatoriaI {
  usuariocreacion: string;
  fechacreacion: Date;
  usuariomodificacion: string;
  fechamodificacion: Date;
  estadoregistro: true;
  idconvocatoria: number;
  nombre: string;
  descripcion: string;
  idrutapostulacionl: number;
  fechainicioinscripcion: Date;
  fechafininscripcion: Date;
  fechainicioevaluacion: Date;
  fechafinevaluacion: Date;
  fechainicioconfirmacionep: Date;
  fechafinconfirmacionep: Date;
  fechainicioconfirmacionorg: Date;
  fechafinconfirmacionorg: Date;
  idestadoconvocatoria: number;
  flagfinconvocatoria: true;
  regiones: [
    {
      usuariocreacion: string;
      fechacreacion: Date;
      usuariomodificacion: string;
      fechamodificacion: Date;
      estadoregistro: true;
      idregion: number;
    }
  ];
  productos: [
    {
      usuariocreacion: string;
      fechacreacion: Date;
      usuariomodificacion: string;
      fechamodificacion: Date;
      estadoregistro: true;
      idproducto: number;
      idsector: number;
      idlineaproducto: number;
      requisitos: [
        {
          usuariocreacion: string;
          fechacreacion: Date;
          usuariomodificacion: string;
          fechamodificacion: Date;
          estadoregistro: true;
          idproducto: number;
          idrequisito: number;
          nombre: string;
          descripcion: string;
          valor: string;
        }
      ];
    }
  ];
}
