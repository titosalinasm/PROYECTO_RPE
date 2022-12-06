import { Component, OnInit, Inject  } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent implements OnInit {

  objUsuario: any;

  constructor(private usuarioService: UsuarioService,
    @Inject(DOCUMENT) private document: Document) {

  }

  ngOnInit(): void {
    if(this.usuarioService.getUsuario())
    this.objUsuario=JSON.parse(this.usuarioService.getUsuario()+'');

  }

  cerrarSesion(){
   this.usuarioService.logout();
   this.document.location.reload();
  }
}
