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
export class RegionService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      // Authorization: 'my-auth-token'
    }),
  };

  constructor(
    private http: HttpClient,
  ) { }

  public listarRegion$(entity: any): Observable<GeneralI> {
    return this.http.post<GeneralI>(
      environment.apiGateway + END_POINTS.region.listar,
      entity,
      this.httpOptions
    );
  }

}
