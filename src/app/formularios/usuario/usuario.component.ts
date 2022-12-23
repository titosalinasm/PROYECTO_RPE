import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { EntidadPrestadoraI } from 'src/app/interfaces/entidad-prestadora-i';
import { ParametroI } from 'src/app/interfaces/parameto-i';
import { PerfilI } from 'src/app/interfaces/perfil-i';
import { UsuarioOrquestadorFilterI } from 'src/app/interfaces/usuario-orquestador-filter';
import { UsuarioOrquestadorI } from 'src/app/interfaces/usuario-orquestador-i';
import { EntidadPrestadoraService } from 'src/app/servicios/entidad-prestadora.service';
import { ParametroService } from 'src/app/servicios/parametro.service';
import { PerfilService } from 'src/app/servicios/perfil.service';
import { UsuarioOrquestadorService } from 'src/app/servicios/usuario-orquestador.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { constante } from 'src/app/utilitarios/constantes';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { UsuarioOrquestadorReqI } from 'src/app/interfaces/usuario-orquestador-resp-i';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
})
export class UsuarioComponent implements OnInit {
  modalRef?: BsModalRef;

  @ViewChild('modal_editar_usuario') _modal_editar_usuario: TemplateRef<any>;
  @ViewChild('modal_nuevo_usuario') _modal_nuevo_usuario: TemplateRef<any>;

  config = {
    backdrop: true,
    ignoreBackdropClick: false,
  };

  frmUsuario = this.formBuilder.group({
    idusuario: [0, [Validators.required]],
    idpersona: [0, [Validators.required]],
    usuario: ['', [Validators.required]],
    password: ['', [Validators.required]],
    idperfil: [0, [Validators.required]],
    usuariocreacion: ['', [Validators.required]],
    fechacreacion: ['', [Validators.required]],
    usuariomodificacion: ['', [Validators.required]],
    fechamodificacion: ['', [Validators.required]],
    estadoregistro: ['', [Validators.required]],
    estadousuario: ['', [Validators.required]],
  });

  frmUsuarioCreaActualiza = this.formBuilder.group({
    idusuario: [0, [Validators.required]],
    usuario: ['', [Validators.required]],
    password: ['', [Validators.required]],
    idperfil: [0, [Validators.required]],
    idpersona: [0, [Validators.required]],
    identidadprestadora: [0, [Validators.required]],
    idtipodocumento: [0, [Validators.required]],
    numerodocumento: ['', [Validators.required]],
    nombresapellidos: ['', [Validators.required]],
    correoelectronico: ['', [Validators.required]],
    celular: ['', [Validators.required]],
    idcargo: [0, [Validators.required]],
    idarea: [0, [Validators.required]],
  });

  pagina: number = 1;
  tamanioPagina: number = constante.paginacion.tamanioPagina;
  listaPerfil: PerfilI[] = [];
  listaUsuario: UsuarioOrquestadorI[] = [];

  frmFilterUsuario = this.formBuilder.group({
    idperfil: [0, [Validators.required]],
    identidadprestadora : [0, [Validators.required]],
  });

  validarEntidad: boolean = false;

  lstEntidadPrestadora: EntidadPrestadoraI[] = [];
  listaTipoDocumento: ParametroI[] = [];
  listaArea: ParametroI[] = [];
  listaCargo: ParametroI[] = [];

  nuTipo: number = 1;
  objUsuario: any;

  objUsuarioT: UsuarioOrquestadorReqI;

  totalItems: number;

  nuValidaVisible: boolean = false;

  nuValidaVisibleFiltro: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private perfilService: PerfilService,
    private usuarioService: UsuarioService,
    private usuarioOrquestadorService: UsuarioOrquestadorService,
    private entidadPrestadoraService: EntidadPrestadoraService,
    private parametroService: ParametroService
  ) {}

  ngOnInit(): void {
    this.bindEventsForm();
    this.cargarListaPerfil();
    this.objUsuario = JSON.parse(this.usuarioService.getUsuario() + '');
  }

  bindEventsForm() {
    this.frmUsuarioCreaActualiza.get('idperfil').valueChanges.subscribe((value) => {
        this.nuValidaVisible = this.listaPerfil.filter(
          (e) => e.idperfil == value
        )[0].flagvalidarentidad;

      });

   this.frmFilterUsuario.get('idperfil').valueChanges.subscribe((value) => {
    this.nuValidaVisibleFiltro = this.listaPerfil.filter(
      (e) => e.idperfil == value
    )[0].flagvalidarentidad;
    this.frmFilterUsuario.controls.identidadprestadora.setValue(0);
   });
  }

  cargarListaPerfil() {
    this.perfilService.listarPerfil$().subscribe(
      (resp) => {
        this.listaPerfil = resp.data;
      },
      (error) => {
        console.log('Error: ' + JSON.stringify(error));
        Swal.fire({
          icon: 'error',
          title: error.error.statusDetail,
          confirmButtonColor: constante.color_alert.rojo,
          confirmButtonText: 'Aceptar',
        });
      }
    );

    let param: any = {
      ruc: null,
      razonsocial: null,
      pageNumber: this.pagina,
      pageSize: 100,
    };
    this.entidadPrestadoraService.listarEntidad$(param).subscribe((resp) => {
      this.lstEntidadPrestadora = resp.data.lista;
    });

    let paramTipoDocumento = { parametrokey: 'ListaTipoDocumento' };
    let paramArea = { parametrokey: 'ListaArea' };
    let paramCargo = { parametrokey: 'ListaCargo' };

    forkJoin([
      this.parametroService.listarParametro$(paramTipoDocumento),
      this.parametroService.listarParametro$(paramArea),
      this.parametroService.listarParametro$(paramCargo),
    ]).subscribe(
      (resp) => {
        this.listaTipoDocumento = resp[0].data;
        this.listaArea = resp[1].data;
        this.listaCargo = resp[2].data;
      },
      (error) => {
        console.log('Error: ' + JSON.stringify(error));
        Swal.fire({
          icon: 'error',
          title: error.error.statusDetail,
          confirmButtonColor: constante.color_alert.rojo,
          confirmButtonText: 'Aceptar',
        });
      }
    );
  }

  listarUsuario() {
    let objFiltroUsuario: UsuarioOrquestadorFilterI = {
      idperfil: this.frmFilterUsuario.value.idperfil==0?null:this.frmFilterUsuario.value.idperfil,
      identidadprestadora: !this.nuValidaVisibleFiltro?null:this.frmFilterUsuario.value.identidadprestadora, // TODO: cambiar
      flagvalidarentidad: this.nuValidaVisibleFiltro,
      pageNumber: this.pagina,
      pageSize: this.tamanioPagina,
    };

    this.usuarioOrquestadorService
      .listarUsuario$(objFiltroUsuario)
      .subscribe((resp) => {
        this.listaUsuario = resp.data.lista;
        this.totalItems = resp.data.totalItems;
        console.log('this.listaUsuario: ' + JSON.stringify(this.listaUsuario));
      });
  }

  abrirModalCrearUsuario() {
    this.nuTipo = 1;
    this.frmUsuarioCreaActualiza.controls.usuario.enable();
    this.frmUsuarioCreaActualiza.reset();
    let objEntidad = {
      id: 1,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-lg modal-dialog-centered',
    };
    this.openModal(this._modal_nuevo_usuario, objEntidad);
  }

  abrirModaCrearActualizarUsuario(id: number) {
    this.nuTipo = 2;

    this.usuarioOrquestadorService
      .obtenerDetalleUsuario$(id)
      .subscribe((resp) => {
        this.objUsuarioT = resp.data;
        this.frmUsuarioCreaActualiza.controls.idusuario.setValue(
          this.objUsuarioT.idusuario
        );
        this.frmUsuarioCreaActualiza.controls.usuario.setValue(
          this.objUsuarioT.usuario
        );
        this.frmUsuarioCreaActualiza.controls.password.setValue(
          this.objUsuarioT.password
        );
        this.frmUsuarioCreaActualiza.controls.idperfil.setValue(
          this.objUsuarioT.idperfil
        );
        this.frmUsuarioCreaActualiza.controls.idpersona.setValue(
          this.objUsuarioT.idpersona
        );
        this.frmUsuarioCreaActualiza.controls.identidadprestadora.setValue(
          this.objUsuarioT.identidadprestadora
        );
        this.frmUsuarioCreaActualiza.controls.idtipodocumento.setValue(
          this.objUsuarioT.idtipodocumento
        );
        this.frmUsuarioCreaActualiza.controls.numerodocumento.setValue(
          this.objUsuarioT.numerodocumento
        );
        this.frmUsuarioCreaActualiza.controls.nombresapellidos.setValue(
          this.objUsuarioT.nombresapellidos
        );
        this.frmUsuarioCreaActualiza.controls.correoelectronico.setValue(
          this.objUsuarioT.correoelectronico
        );
        this.frmUsuarioCreaActualiza.controls.celular.setValue(
          this.objUsuarioT.celular
        );
        this.frmUsuarioCreaActualiza.controls.idcargo.setValue(
          this.objUsuarioT.idcargo
        );
        this.frmUsuarioCreaActualiza.controls.idarea.setValue(
          this.objUsuarioT.idarea
        );

        this.frmUsuarioCreaActualiza.controls.usuario.disable();

        let objEntidad = {
          id: 1,
          backdrop: true,
          ignoreBackdropClick: true,
          class: 'modal-lg modal-dialog-centered',
        };
        this.openModal(this._modal_nuevo_usuario, objEntidad);
      });
  }

  crearActualiaUsuario() {
    let request: UsuarioOrquestadorReqI = {
      idusuario: this.nuTipo == 1 ? 0 : this.objUsuarioT.idusuario,
      usuario: this.nuTipo==1?this.frmUsuarioCreaActualiza.value.usuario:this.objUsuarioT.usuario,
      password: this.frmUsuarioCreaActualiza.value.password,
      idperfil: this.frmUsuarioCreaActualiza.value.idperfil,
      idpersona: this.nuTipo == 1 ? null : this.objUsuarioT.idpersona,
      identidadprestadora:
        this.frmUsuarioCreaActualiza.value.identidadprestadora,
      idtipodocumento: this.frmUsuarioCreaActualiza.value.idtipodocumento,
      numerodocumento: this.frmUsuarioCreaActualiza.value.numerodocumento,
      nombresapellidos: this.frmUsuarioCreaActualiza.value.nombresapellidos,
      correoelectronico: this.frmUsuarioCreaActualiza.value.correoelectronico,
      celular: this.frmUsuarioCreaActualiza.value.celular,
      idcargo: this.frmUsuarioCreaActualiza.value.idcargo,
      idarea: this.frmUsuarioCreaActualiza.value.idarea,
      estadousuario: true,
      usuariocreacion: this.objUsuario.usuario,
      fechacreacion: new Date(),
      usuariomodificacion: this.nuTipo == 1 ? null : this.objUsuario.usuario,
      fechamodificacion: this.nuTipo == 1 ? null : new Date(),
      estadoregistro: true,
    };

    this.usuarioOrquestadorService
      .creaActualizaUsuario$(request)
      .subscribe((resp) => {
        Swal.fire({
          text: 'El usuario se actualizó correctamente.',
          confirmButtonColor: constante.color_alert.verde,
        });
        this.hideModal(1);
        this.frmUsuarioCreaActualiza.reset();
        this.listarUsuario();
      });
  }

  eliminarUsuario(row: number, idusario: number) {
    Swal.fire({
      title: 'Está seguro que desea eliminar el registro?',
      text: 'Esta acción no se podrá recuperar!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: constante.color_alert.rojo,
      cancelButtonColor: constante.color_alert.plomo,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioOrquestadorService.eliminarUsuario$(idusario).subscribe(
          (resp) => {
            // this.listaUsuario.splice(row, 1);
            this.listarUsuario();
            Swal.fire({
              text: 'El usuario se elimnó correctamente.',
              confirmButtonColor: constante.color_alert.verde,
            });
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Ocurrio un error al eliminar',
            });
          }
        );
      }
    });
  }

  openModal(template: TemplateRef<any>, objClass: any) {
    this.modalRef = this.modalService.show(template, objClass);
  }

  hideModal(id: number) {
    this.modalService.hide(id);
  }

  pageChanged(event: PageChangedEvent): void {
    this.pagina = event.page;
    this.listarUsuario();
  }
}
