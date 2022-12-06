import { Component, OnInit, Inject  } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { DOCUMENT } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-inicio-s-extranet',
  templateUrl: './inicio-s-extranet.component.html',
  styleUrls: ['./inicio-s-extranet.component.css'],
})
export class InicioSExtranetComponent implements OnInit {
  objUsuario: any;
  token: string|undefined;

  blSessionIniciada : boolean=false;

  constructor(private usuarioService: UsuarioService,
    @Inject(DOCUMENT) private document: Document) {
      this.token = undefined;
  }

  ngOnInit(): void {
    if(this.usuarioService.getUsuario())
    this.blSessionIniciada=true;
    // this.usuarioService.getUserLogged();
  }

  iniciarSesion() {
    this.usuarioService.getValidaUsuario().subscribe((resp) => {
    this.usuarioService.setUsuario(JSON.stringify(resp.data[0]));
    this.objUsuario=resp.data[0];
    setInterval(() => {
      this.document.location.reload();
    }, 1000)

    });
  }

  public send(form: NgForm): void {
    if (form.invalid) {
      for (const control of Object.keys(form.controls)) {
        form.controls[control].markAsTouched();
      }
      return;
    }

    console.debug(`Token [${this.token}] generated`);
  }


}
