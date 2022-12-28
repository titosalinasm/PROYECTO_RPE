export interface ServicioI {
  idservicio: number;
  nombreservicio: string;
  idtiposervicio: number;
  nombretiposervicio: string;
  idsector: number;
  nombresector: string;
  idproducto: number;
  nombreproducto: string;
  idestadoservicio: number;
  nombreestadoservicio: string;
  flagenviarservicio: boolean;
  usuariocreacion: string;
  fechacreacion: Date;
  usuariomodificacion: string;
  fechamodificacion: Date;
  estadoregistro: boolean;
}