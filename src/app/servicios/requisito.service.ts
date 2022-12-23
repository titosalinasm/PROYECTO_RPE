import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RequisitoFilterI } from '../interfaces/requisito-filter';
import { END_POINTS } from '../utilitarios/end-point';
import { GeneralI } from '../utilitarios/GeneralI';

@Injectable({
  providedIn: 'root',
})
export class RequisitoService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: 'my-auth-token'
    }),
  };

  constructor(private http: HttpClient) { }

  public agregarActualizarRequisito$(entity: any): Observable<GeneralI> {
    return this.http.post<GeneralI>(
      environment.apiGateway + END_POINTS.requisito.crear,
      entity
    );
  }

  public listarRequisito$(entity: RequisitoFilterI): Observable<GeneralI> {
    return this.http.post<GeneralI>(
      environment.apiGateway + END_POINTS.requisito.listar_paginado,
      entity,
      this.httpOptions
    );
  }

  public listarRequisitoNP$(entity: any): Observable<GeneralI> {
    return this.http.post<GeneralI>(
      environment.apiGateway + END_POINTS.requisito.listar,
      entity,
      this.httpOptions
    );
  }

  public eliminarRequisito$(id: number): Observable<GeneralI> {
    return this.http.put<GeneralI>(
      environment.apiGateway + END_POINTS.requisito.eliminar + id,
      this.httpOptions
    );
  }

  public obtenerDeatlle$(id: number): Observable<GeneralI> {
    return this.http.get<GeneralI>(
      // environment.apiGateway + END_POINTS.requisito.obtener_detalle + id,
      'http://20.236.129.139:8020/api/v1/requisito/requisito/'+id,
      this.httpOptions
    );
  }

}
