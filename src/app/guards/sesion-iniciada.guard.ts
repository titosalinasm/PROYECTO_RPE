import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../servicios/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class SesionIniciadaGuard implements CanActivate {
  constructor(private router: Router, private usuarioService: UsuarioService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.usuarioService.getUsuario()) {
      // this.router.navigate(['/bienvenido']);
      return true;
    } else {
      return false;
    }
  }
}
