import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralI } from '../utilitarios/GeneralI';
import { environment } from 'src/environments/environment';
import { END_POINTS } from '../utilitarios/end-point';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConvocatoriaService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      // Authorization: 'my-auth-token'
    }),
  };

  constructor(private http: HttpClient,
  ) { }

  public agregarActualizarConvocatoria$(entity: any): Observable<GeneralI> {
    return this.http.post<GeneralI>(
      environment.apiGateway + END_POINTS.convocatoria.crea_actualiza,
      entity,
    );
  }

  public listarConvocatoria$(entity: any): Observable<GeneralI> {
    return this.http.post<GeneralI>(
      environment.apiGateway + END_POINTS.convocatoria.listar,
      entity,
    );
  }

  public eliminarConvocatoria$(id: number): Observable<GeneralI> {
    return this.http.put<GeneralI>(
      environment.apiGateway + END_POINTS.convocatoria.eliminar + id,
      this.httpOptions
    );
  }

  public obtenerDetalleConvocatoria$(id: number): Observable<GeneralI> {
    return this.http.get<GeneralI>(
      environment.apiGateway + END_POINTS.convocatoria.obtener_detalle + id,
      this.httpOptions
    );
  }


}
