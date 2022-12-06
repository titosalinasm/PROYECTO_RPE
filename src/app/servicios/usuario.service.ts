import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { END_POINTS } from '../utilitarios/end-point';
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient,
    private cookies: CookieService
    ) { }

  getValidaUsuario() {
    return this.http.get<any>('assets/apigetway'+END_POINTS.usuario.iniciar_sesion);
  }

  setUsuario(usuario: string) {
    this.cookies.set("usuario", usuario);
  }
  getUsuario() {
    return this.cookies.get("usuario");
  }

  logout(){
    this.cookies.delete("usuario");
  }


}
