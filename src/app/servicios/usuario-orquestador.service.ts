import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { END_POINTS } from '../utilitarios/end-point';
import { CookieService } from "ngx-cookie-service";
import { GeneralI } from '../utilitarios/GeneralI';
import { UsuarioOrquestadorFilterI } from '../interfaces/usuario-orquestador-filter';
import { UsuarioOrquestadorReqI } from '../interfaces/usuario-orquestador-resp-i';

@Injectable({
  providedIn: 'root'
})
export class UsuarioOrquestadorService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
  };

  constructor(
    private http: HttpClient,
    private cookies: CookieService
  ) { }

  public listarUsuario$(entity: UsuarioOrquestadorFilterI): Observable<GeneralI> {
    return this.http.post<GeneralI>(
      // environment.apiGateway +
      environment.apiGateway+
      END_POINTS.usuarioOrquestador.listar,
      entity,
      this.httpOptions
    );
  }

  public creaActualizaUsuario$(entity: UsuarioOrquestadorReqI): Observable<GeneralI> {
    return this.http.post<GeneralI>(
      // environment.apiGateway +
      environment.apiGateway+
      END_POINTS.usuarioOrquestador.crearActualiza,
      entity,
      this.httpOptions
    );
  }

  public obtenerDetalleUsuario$(id : number): Observable<GeneralI> {
    return this.http.get<GeneralI>(
      // environment.apiGateway +
      environment.apiGateway+
      END_POINTS.usuarioOrquestador.obtenerDetalle+id,
      this.httpOptions
    );
  }

  public eliminarUsuario$(id: number): Observable<GeneralI> {
    return this.http.put<GeneralI>(
      // environment.apiGateway
      environment.apiGateway
      + END_POINTS.usuarioOrquestador.eliminar + id,
      this.httpOptions
    );
  }


}
