export interface RequisitoI {
  idrequisito: number;
  nombre: string;
  descripcion: string;
  idproducto: number;
  tipovalor: string;
  listavalorkey: string;
  nombresector: string;
  nombrelineaproducto: string;
  usuariocreacion: string;
  fechacreacion: Date;
  usuariomodificacion: string;
  fechamodificacion: Date;
  estadoregistro: boolean;
  idlineaproducto: number;
  idsector: number;
  isChecked: boolean;
}
