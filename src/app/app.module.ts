import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CabeceraComponent } from './formularios/cabecera/cabecera.component';
import { BannerPrincipalComponent } from './formularios/banner-principal/banner-principal.component';
import { PiePaginaComponent } from './formularios/pie-pagina/pie-pagina.component';
import { BienvenidaComponent } from './formularios/bienvenida/bienvenida.component';
import { InicioSExtranetComponent } from './formularios/inicio-s-extranet/inicio-s-extranet.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenService } from './utilitarios/token.service';
import { AuthInterceptor } from './utilitarios/auth.interceptor';
import { UsuarioService } from './servicios/usuario.service';
import { CookieService } from 'ngx-cookie-service';
import { EntidadPrestadoraComponent } from './formularios/entidad-prestadora/entidad-prestadora.component';
import { EntidadPrestadoraService } from './servicios/entidad-prestadora.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { PaginationModule } from 'ngx-bootstrap/pagination';
@NgModule({
  declarations: [
    AppComponent,
    CabeceraComponent,
    BannerPrincipalComponent,
    PiePaginaComponent,
    BienvenidaComponent,
    InicioSExtranetComponent,
    EntidadPrestadoraComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    HttpClientModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    SweetAlert2Module.forRoot(),
    PaginationModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    UsuarioService,
    TokenService,
    CookieService,
    EntidadPrestadoraService,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
