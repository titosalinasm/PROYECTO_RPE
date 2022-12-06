import { Component, Inject  } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RPE';

  blSessionIniciada : boolean=false;

  constructor(private usuarioService: UsuarioService,
    @Inject(DOCUMENT) private document: Document) {
      if(usuarioService.getUsuario())
      this.blSessionIniciada=true;
  }

}
