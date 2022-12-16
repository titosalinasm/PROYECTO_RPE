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
import { OrganizacionRpeComponent } from './formularios/organizacion-rpe/organizacion-rpe.component';
import { RequisitosComponent } from './formularios/requisitos/requisitos.component';
import { OrganizacionRpeService } from './servicios/organizacion-rpe.service';
import { SectorService } from './servicios/sector.service';
import { RequisitoService } from './servicios/requisito.service';
import { LineaProductoService } from './servicios/linea-producto.service';
import { RegionService } from './servicios/region.service';
import { ProductoService } from './servicios/producto.service';
import { UsuarioComponent } from './formularios/usuario/usuario.component';
@NgModule({
  declarations: [
    AppComponent,
    CabeceraComponent,
    BannerPrincipalComponent,
    PiePaginaComponent,
    BienvenidaComponent,
    InicioSExtranetComponent,
    EntidadPrestadoraComponent,
    OrganizacionRpeComponent,
    RequisitosComponent,
    UsuarioComponent,

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
    OrganizacionRpeService,
    SectorService,
    RequisitoService,
    LineaProductoService,
    RegionService,
    ProductoService,
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
