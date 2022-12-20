export interface UsuarioOrquestadorReqI {
  idusuario: number;
  usuario: string;
  password: string;
  idperfil: number;
  idpersona: number;
  identidadprestadora: number;
  idtipodocumento: number;
  numerodocumento: string;
  nombresapellidos: string;
  correoelectronico: string;
  celular: string;
  idcargo: number;
  idarea: number;
  estadousuario: true;
  usuariocreacion: string;
  fechacreacion: Date;
  usuariomodificacion: string;
  fechamodificacion: Date;
  estadoregistro: true;
}
