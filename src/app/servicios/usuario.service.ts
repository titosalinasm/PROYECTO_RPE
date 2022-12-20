import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { END_POINTS } from '../utilitarios/end-point';
import { CookieService } from "ngx-cookie-service";
import { GeneralI } from '../utilitarios/GeneralI';
import { UsuarioFilterI } from '../interfaces/usuario-filter';
import { validarUsuarioFilterI } from '../interfaces/validar-usuario-filter';
import { UsuarioI } from '../interfaces/usuario-i';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
  };

  constructor(
    private http: HttpClient,
    private cookies: CookieService
  ) { }

  getValidaUsuario() {
    return this.http.get<any>('assets/apigetway' + END_POINTS.usuario.iniciar_sesion);
  }

  setUsuario(usuario: string) {
    this.cookies.set("usuario", usuario);
  }

  getUsuario() {
    return this.cookies.get("usuario");
  }

  public creaActualizaUsuario$(entity: UsuarioI): Observable<GeneralI> {
    return this.http.post<GeneralI>(
      // environment.apiGatewaySeguridad
      'http://20.236.129.139:8140'
      + END_POINTS._usuario.crearActualiza,
      entity,
      this.httpOptions
    );
  }

  public listarUsuarioPerfil$(entity: UsuarioFilterI): Observable<GeneralI> {
    return this.http.get<GeneralI>(
      // environment.apiGatewaySeguridad
      'http://20.236.129.139:8150'
      + END_POINTS._usuario.listar_usuario_perfil + entity.idperfil,
      this.httpOptions
    );
  }

  public eliminarUsuario$(id: number): Observable<GeneralI> {
    return this.http.put<GeneralI>(
      // environment.apiGatewaySeguridad +
      'http://20.236.129.139:8150' +
      END_POINTS._usuario.eliminar + id,
      this.httpOptions
    );
  }

  public validarUsuario$(entity: validarUsuarioFilterI): Observable<GeneralI> {
    console.log('>>validarUsuario$');
    // let url = 'http://20.236.129.139:8150/' + END_POINTS._usuario.validar;
    // console.log('>>url: ' + url);
    return this.http.post<GeneralI>(
      // environment.apiGatewaySeguridad
      'http://20.236.129.139:8140'
      + END_POINTS._usuario.validar,
      entity,
      this.httpOptions
    );
  }

  logout() {
    this.cookies.delete("usuario");
  }


}
