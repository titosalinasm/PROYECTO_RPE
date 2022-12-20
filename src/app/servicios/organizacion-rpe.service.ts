import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralI } from '../utilitarios/GeneralI';
import { environment } from 'src/environments/environment';
import { END_POINTS } from '../utilitarios/end-point';
import { Observable } from 'rxjs';
import { OrgRPEFilter } from '../interfaces/organizacion-rpe -filter';
import { OrganizacioRPE } from '../interfaces/organizacion-rpe-i';

@Injectable({
  providedIn: 'root'
})
export class OrganizacionRpeService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      // Authorization: 'my-auth-token'
    }),
  };

  constructor(private http: HttpClient,
  ) { }

  public agregarActualizarEntidad$(entity: OrganizacioRPE): Observable<GeneralI> {
    return this.http.post<GeneralI>(
      environment.apiGatewayMaestro + END_POINTS.organizacion_rpe.crear,
      entity,
    );
  }

  public listarOrganizacionRPE$(entity: OrgRPEFilter): Observable<GeneralI> {
    return this.http.post<GeneralI>(
      environment.apiGatewayMaestro + END_POINTS.organizacion_rpe.listar_paginado,
      entity,
      this.httpOptions
    );
  }

  public eliminarOrgRPE$(id: number): Observable<GeneralI> {
    return this.http.put<GeneralI>(
      environment.apiGatewayMaestro + END_POINTS.organizacion_rpe.eliminar + id,
      this.httpOptions
    );
  }
}
