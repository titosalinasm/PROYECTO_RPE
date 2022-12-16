import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralI } from '../utilitarios/GeneralI';
import { environment } from 'src/environments/environment';
import { END_POINTS } from '../utilitarios/end-point';
import { Observable } from 'rxjs';
import { EntidadPrestadoraFilterI } from '../interfaces/entidad-prestadora-filter';
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
      environment.apiGatewayMaestro + END_POINTS.entidad_prestadora.crear,
      entity,
    );
  }

  public listarEntidad$(entity: EntidadPrestadoraFilterI): Observable<GeneralI> {
    return this.http.post<GeneralI>(
      environment.apiGatewayMaestro + END_POINTS.entidad_prestadora.listar_paginado,
      entity,
      this.httpOptions
    );
  }

  public eliminarEntidad$(id: number): Observable<GeneralI> {
    return this.http.put<GeneralI>(
      environment.apiGatewayMaestro + END_POINTS.entidad_prestadora.eliminar+id,
      this.httpOptions
    );
  }
}
