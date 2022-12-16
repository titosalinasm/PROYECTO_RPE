import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralI } from '../utilitarios/GeneralI';
import { environment } from 'src/environments/environment';
import { END_POINTS } from '../utilitarios/end-point';
import { Observable } from 'rxjs';
import { OrgRPEFilter } from '../interfaces/organizacion-rpe -filter';

@Injectable({
  providedIn: 'root'
})
export class LineaProductoService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      // Authorization: 'my-auth-token'
    }),
  };

  constructor(private http: HttpClient,
    ) {}

    public listarLineaProducto$(entity: any): Observable<GeneralI> {
      return this.http.post<GeneralI>(
        environment.apiGatewayMaestro + END_POINTS.linea_producto.listar,
        entity,
        this.httpOptions
      );
    }

}
