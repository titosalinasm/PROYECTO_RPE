import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit {

  constructor(private usuarioService: UsuarioService,
    private router: Router) { }

  ngOnInit(): void {
    if(this.usuarioService.getUsuario())
    this.router.navigate(['/extranet']);

  }

}
