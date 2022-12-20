import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ParametroI } from 'src/app/interfaces/parameto-i';
import { ParametroService } from 'src/app/servicios/parametro.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { OrganizacionRpeService } from 'src/app/servicios/organizacion-rpe.service';
import { constante } from 'src/app/utilitarios/constantes';
import { eTipoAccion } from 'src/app/utilitarios/data.enums';
import Swal from 'sweetalert2';
import { UsuarioI } from 'src/app/interfaces/usuario-i';
import { OrganizacioRPE } from 'src/app/interfaces/organizacion-rpe-i';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  objUsuario: any;
  nuTipo: number = eTipoAccion.Insertar; //1;
  listaTipoDocumento: ParametroI[] = [];
  listaArea: ParametroI[] = [];
  listaCargo: ParametroI[] = [];

  frmPerfil = this.formBuilder.group({
    nroruc: [{ value: '', disabled: true }, [Validators.required]],
    estadocontribuyente: [{ value: 'Activo', disabled: true }, [Validators.required]],
    idregion: [{ value: 1, disabled: true }, [Validators.required]],
    idprovincia: [{ value: 1, disabled: true }, [Validators.required]],
    iddistrito: [{ value: 1, disabled: true }, [Validators.required]],
    ubigeo: [{ value: '10253', disabled: true }, [Validators.required]],
    condicion: [{ value: 'Condición', disabled: true }, [Validators.required]],
    nombrecompleto: [{ value: 'Pérez Salcedo Juan', disabled: true }, [Validators.required]],
    idgenero: [{ value: 1, disabled: true }, [Validators.required]],
    correo: [{ value: 'correo@correo.com', disabled: true }, [Validators.required]],
    telefono: [{ value: '12345678', disabled: true }, [Validators.required]],
  });

  frmContacto = this.formBuilder.group({
    usuariosol: [{ value: '', disabled: false }, [Validators.required]],
    nombres: [{ value: 'Juan', disabled: false }, [Validators.required]],
    apellidopaterno: [{ value: 'Pérez', disabled: false }, [Validators.required]],
    apellidomaterno: [{ value: 'Salcedo', disabled: false }, [Validators.required]],
    idtipodocumento: [{ value: 2, disabled: false }, [Validators.required]],
    nrodocumento: [{ value: '12345678', disabled: false }, [Validators.required]],
    correo: [{ value: 'correo@correo.com', disabled: false }, [Validators.required]],
    telefonofijo: [{ value: '245876', disabled: false }, [Validators.required]],
    celular: [{ value: '12345678', disabled: false }, [Validators.required]],
    idcargo: [{ value: 5, disabled: false }, [Validators.required]],
    idarea: [{ value: 9, disabled: false }, [Validators.required]],
    redessociales: [{ value: 'instagram', disabled: false }, [Validators.required]],
    sitioweb: [{ value: 'juanperez.com', disabled: false }, [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private parametroService: ParametroService,
    private organizacionRpeService: OrganizacionRpeService,
    private router: Router
  ) {
    console.log('this.usuarioService.getUsuario(): ' + this.usuarioService.getUsuario());
    this.frmPerfil.controls.nroruc.setValue(this.usuarioService.getUsuario());
    this.frmContacto.controls.usuariosol.setValue(this.usuarioService.getUsuario());
  }

  ngOnInit(): void {
    console.log('>>ngoninit');
    this.objUsuario = JSON.parse(this.usuarioService.getUsuario() + '');
    this.cargarParametros();
  }

  cargarParametros() {
    let paramTipoDocumento = { parametrokey: 'ListaTipoDocumento' };
    let paramArea = { parametrokey: 'ListaArea' };
    let paramCargo = { parametrokey: 'ListaCargo' };

    forkJoin([
      this.parametroService.listarParametro$(paramTipoDocumento),
      this.parametroService.listarParametro$(paramArea),
      this.parametroService.listarParametro$(paramCargo)
    ]).subscribe(

      (resp) => {
        this.listaTipoDocumento = resp[0].data;
        this.listaArea = resp[1].data;
        this.listaCargo = resp[2].data;
      }, error => {
        console.log("Error: " + JSON.stringify(error));
        Swal.fire({
          icon: 'error',
          title: error.error.statusDetail,
          confirmButtonColor: constante.color_alert.rojo,
          confirmButtonText: 'Aceptar',
        });
      }

    );
  }

  guardarDatosContacto() {
    let paramOrganizacionRPE: OrganizacioRPE = {
      idorganizacionrpe: 0,
      ruc: this.frmContacto.value.usuariosol,
      razonsocial: 'rsocial',
      nombres: this.frmContacto.value.nombres,
      apellidopaterno: this.frmContacto.value.apellidopaterno,
      apellidomaterno: this.frmContacto.value.apellidomaterno,
      idtipodocumento: this.frmContacto.value.idtipodocumento,
      numerodocumento: this.frmContacto.value.nrodocumento,
      correoelectronico: this.frmContacto.value.correo,
      telefono: this.frmContacto.value.telefonofijo,
      celular: this.frmContacto.value.celular,
      idcargo: this.frmContacto.value.idcargo,
      idarea: this.frmContacto.value.idarea,
      sitioweb: this.frmContacto.value.sitioweb,
      redsocial: this.frmContacto.value.redessociales,
      usuariocreacion: this.objUsuario.usuario,
      fechacreacion: new Date(),
      usuariomodificacion: this.nuTipo == eTipoAccion.Insertar ? null : this.objUsuario.usuario,
      fechamodificacion: this.nuTipo == eTipoAccion.Insertar ? null : new Date(),
      estadoregistro: true
    };

    this.organizacionRpeService.agregarActualizarEntidad$(paramOrganizacionRPE).subscribe(
      resp => {
        this.agregarUsuario(resp.data);
      }, error => {
        Swal.fire({
          icon: 'error',
          title: error.error.statusDetail,
          confirmButtonColor: constante.color_alert.rojo,
          confirmButtonText: 'Aceptar',
        });
      });
  }

  agregarUsuario(data: any) {
    let paramUsuario: UsuarioI = {
      idusuario: 0,
      idpersona: data.idorganizacionrpe,
      usuario: this.frmContacto.value.usuariosol,
      password: null,
      idperfil: 1, // TODO: cambiar
      usuariocreacion: this.objUsuario.usuario,
      fechacreacion: new Date(),
      usuariomodificacion: this.nuTipo == eTipoAccion.Insertar ? null : this.objUsuario.usuario,
      fechamodificacion: this.nuTipo == eTipoAccion.Insertar ? null : new Date(),
      estadoregistro: true,
      estadousuario: true
    };

    this.usuarioService.creaActualizaUsuario$(paramUsuario).subscribe(
      resp => {
        this.router.navigate(['/extranet']);
      },
      error => {
        console.log('error:' + <any>error);
        Swal.fire({
          icon: 'error',
          title: error.error.statusDetail,
          confirmButtonColor: constante.color_alert.rojo,
          confirmButtonText: 'Aceptar',
        });
      }
    );
  }

}
