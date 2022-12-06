import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let tokenItem: string = 'access_token';
    request=this.addToken(this.getToken(tokenItem), request);


    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 400 || error.status === 403) {
            return this.refreshToken(tokenItem)
              .pipe(
                switchMap((resp: any) => {
                  sessionStorage.removeItem(tokenItem);
                  sessionStorage.setItem(tokenItem, resp.access_token);
                  return next.handle(this.addToken(this.getToken(tokenItem), request));
                })
              );
          }
          return throwError(error);
        }),
        finalize(() => ''
        )
      );
  }

  addToken(token: any, request: HttpRequest<any>): any {
    let autRque = request;
    if (token != null) {
      autRque = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    }
    return autRque;
  }

  addTokenAuth(request: HttpRequest<any>): any {
    return request.clone({
      setHeaders: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  getToken(key: string): any {
    return sessionStorage.getItem(key);
  }

  refreshToken(tokenItem: string): Observable<any> {
    let rptaHttp: Observable<any>;
    rptaHttp=this.tokenService.obtenerToken$();
    return rptaHttp;
  }

  obtenerToken() {


}

}
