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
export class MenuService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
  };

  constructor(private http: HttpClient,
  ) { }

  public listarPerfil$(id: number): Observable<GeneralI> {
    return this.http.get<GeneralI>(
      // environment.apiGateway +
      environment.apiGateway+
       END_POINTS.menu.listar+id,
      this.httpOptions
    );
  }

}
