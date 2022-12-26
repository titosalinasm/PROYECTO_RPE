import { convocatoriaProductoI } from "./convocatoria-producto-i";
import { convocatoriaRegionI } from "./convocatoria-region-i";

export interface convocatoriaI {
  usuariocreacion: string;
  fechacreacion: Date;
  usuariomodificacion: string;
  fechamodificacion: Date;
  estadoregistro: boolean;
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
  flagfinconvocatoria: boolean;
  regiones: convocatoriaRegionI[];
  productos: convocatoriaProductoI[];
}
