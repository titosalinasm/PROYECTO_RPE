import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


export class DataService<T> {
    constructor(
        protected httpClient: HttpClient,
        protected endPoint: string,
    ) { }

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
        })
    };


    public postAll$(entity : any) : Observable<T>{
      return this.httpClient.post<T>(this.endPoint, this.httpOptions);
    }

    public iniciarSesion$(entity : any) : Observable<T>{
      return this.httpClient.post<T>(this.endPoint, this.httpOptions);
    }

    public add$(entity: any): Observable<T> {
        return this.httpClient.post<T>(this.endPoint, entity);
    }

    public patch$(id: string, partialEntity: T): Observable<T> {
        return this.httpClient.patch<T>(`${this.endPoint}/${id}/`, partialEntity);
    }

    public update$(id: string, entity: T): Observable<T> {
        return this.httpClient.put<T>(`${this.endPoint}/${id}/`, entity);
    }

    public delete$(id: string): Observable<any> {
        return this.httpClient.delete<any>(`${this.endPoint}/${id}/`);
    }

    public obtenerToken$(): Observable<any> {
      const httpOptions = {
          headers: new HttpHeaders({
              "Content-Type": "application/x-www-form-urlencoded"
          })
      };

      const httpBoody = new URLSearchParams();
      return this.httpClient.post<T>(this.endPoint, httpBoody.toString(), httpOptions);
  }
}
