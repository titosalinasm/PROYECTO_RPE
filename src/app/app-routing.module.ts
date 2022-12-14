import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './formularios/bienvenida/bienvenida.component';
import { CabeceraComponent } from './formularios/cabecera/cabecera.component';
import { EntidadPrestadoraComponent } from './formularios/entidad-prestadora/entidad-prestadora.component';
import { InicioSExtranetComponent } from './formularios/inicio-s-extranet/inicio-s-extranet.component';
import { OrganizacionRpeComponent } from './formularios/organizacion-rpe/organizacion-rpe.component';
import { RequisitosComponent } from './formularios/requisitos/requisitos.component';
import { SesionIniciadaGuard } from './guards/sesion-iniciada.guard';

const routes: Routes = [
  {path: '', redirectTo: '/bienvenida', pathMatch: 'full' },
  {path: 'bienvenida', component: BienvenidaComponent,},
  {path: 'extranet', component: InicioSExtranetComponent,},
  {path: 'cabecera', component: CabeceraComponent, canActivate: [SesionIniciadaGuard],},
  {path: 'entidad-prestadora', component: EntidadPrestadoraComponent, canActivate: [SesionIniciadaGuard],},
  {path: 'organizacion-rpe', component: OrganizacionRpeComponent, canActivate: [SesionIniciadaGuard],},
  {path: 'requisitos', component: RequisitosComponent, canActivate: [SesionIniciadaGuard],},

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
