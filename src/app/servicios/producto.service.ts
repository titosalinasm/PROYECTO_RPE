import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralI } from '../utilitarios/GeneralI';
import { environment } from 'src/environments/environment';
import { END_POINTS } from '../utilitarios/end-point';
import { Observable } from 'rxjs';
import { OrgRPEFilter } from '../interfaces/organizacion-rpe -filter';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: 'my-auth-token'
    }),
  };

  constructor(private http: HttpClient) {}

  public listarProducto$(entity: any): Observable<GeneralI> {
    return this.http.post<GeneralI>(
      environment.apiMaestroProducto +
        END_POINTS.producto.listar,
      entity,
      this.httpOptions
    );
  }
}
