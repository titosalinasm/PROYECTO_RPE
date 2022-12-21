import { Component, OnInit, Inject  } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { DOCUMENT } from '@angular/common';
import { MenuService } from 'src/app/servicios/menu.service';
import { menuI } from 'src/app/interfaces/menu-i';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent implements OnInit {

  objUsuario: any;

  lstMenu : menuI[]=[];

  constructor(private usuarioService: UsuarioService,
    @Inject(DOCUMENT) private document: Document,
    private menuService: MenuService
    ) {

  }

  ngOnInit(): void {
    if(this.usuarioService.getUsuario()){
    this.objUsuario=JSON.parse(this.usuarioService.getUsuario()+'');
    this.cargarMenu();
    }


  }

  cargarMenu(){
    let idPerfil=1;
    this.menuService.listarPerfil$(idPerfil).subscribe(resp=>{
      this.lstMenu=resp.data;

    });
  }

  cerrarSesion(){
   this.usuarioService.logout();
   this.document.location.reload();
  }
}
