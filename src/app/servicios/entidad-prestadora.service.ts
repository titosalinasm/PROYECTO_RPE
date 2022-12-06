import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralI } from '../utilitarios/GeneralI';
import { environment } from 'src/environments/environment';
import { END_POINTS } from '../utilitarios/end-point';
import { Observable } from 'rxjs';
// import { EntidadPrestadoraI } from '../interfaces/entidad-prestadora-i';

@Injectable({
  providedIn: 'root',
})
export class EntidadPrestadoraService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      // Authorization: 'my-auth-token'
    }),
  };

  constructor(private http: HttpClient,
    ) {}

  public agregarEntidad$(entity: any): Observable<GeneralI> {
    return this.http.post<GeneralI>(
      environment.apiGateway + END_POINTS.entidad_prestadora.crear,
      entity,
    );
  }

  public listarEntidad$(entity: any): Observable<GeneralI> {
    return this.http.post<GeneralI>(
      environment.apiGateway + END_POINTS.entidad_prestadora.listar,
      entity,
      this.httpOptions
    );
  }
}
