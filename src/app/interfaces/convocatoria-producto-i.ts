import { convocatoriaProductoRequisitoI } from "./convocatoria-producto-requisito-I";

export interface convocatoriaProductoI {
  usuariocreacion: string;
  fechacreacion: Date;
  usuariomodificacion: string;
  fechamodificacion: Date;
  estadoregistro: true;
  idproducto: number;
  nombreproducto: string;
  idsector: number;
  nombresector: string;
  idlineaproducto: number;
  nombrelineaproducto: string;
  requisitos: convocatoriaProductoRequisitoI[];
}
