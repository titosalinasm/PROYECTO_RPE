import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { END_POINTS } from '../utilitarios/end-point';
import { CookieService } from "ngx-cookie-service";
import { GeneralI } from '../utilitarios/GeneralI';
import { UsuarioOrquestadorFilterI } from '../interfaces/usuario-orquestador-filter';

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
      environment.apiGatewaySeguridad + END_POINTS.usuarioOrquestador.listar,
      entity,
      this.httpOptions
    );
  }

  public eliminarUsuario$(id: number): Observable<GeneralI> {
    return this.http.put<GeneralI>(
      environment.apiGatewaySeguridad + END_POINTS._usuario.eliminar + id,
      this.httpOptions
    );
  }


}
