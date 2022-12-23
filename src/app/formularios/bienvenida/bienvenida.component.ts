import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { validarUsuarioFilterI } from 'src/app/interfaces/validar-usuario-filter';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.usuarioService.getUsuario())
      this.router.navigate(['/extranet']);

  }

  validarUsuario() {
    console.log('>>validarUsuario');
    let param: validarUsuarioFilterI = {
      usuario: '10436678245' //'20504774288'
    }
    this.usuarioService.validarUsuario$(param).subscribe(
      resp => {
        this.usuarioService.setUsuario(param.usuario);
        console.log('resp.data: ' + JSON.stringify(resp.data));
        console.log('resp.data: ' + (resp.data == ''));
        console.log('resp.data: ' + resp.data.length);
        if (resp.data.length > 0) {
          this.router.navigate(['/extranet']);
        } else {
          this.router.navigate(['/perfil']);
        }
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      });
  }

}
