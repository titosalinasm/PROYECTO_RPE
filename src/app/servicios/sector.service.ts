import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SectorFilterI } from '../interfaces/sector-filter';
import { END_POINTS } from '../utilitarios/end-point';
import { GeneralI } from '../utilitarios/GeneralI';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      // Authorization: 'my-auth-token'
    }),
  };

  constructor(
    private http: HttpClient,
  ) { }

  public listarSector$(entity: any): Observable<GeneralI> {
    return this.http.post<GeneralI>(
      environment.apiMaestroSector + END_POINTS.sector.listar,
      entity,
      this.httpOptions
    );
  }

}
