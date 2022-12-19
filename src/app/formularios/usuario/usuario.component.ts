import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PerfilI } from 'src/app/interfaces/perfil-i';
import { UsuarioOrquestadorFilterI } from 'src/app/interfaces/usuario-orquestador-filter';
import { UsuarioOrquestadorI } from 'src/app/interfaces/usuario-orquestador-i';
import { PerfilService } from 'src/app/servicios/perfil.service';
import { UsuarioOrquestadorService } from 'src/app/servicios/usuario-orquestador.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { constante } from 'src/app/utilitarios/constantes';
import Swal from 'sweetalert2';

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

  pagina: number = 1;
  tamanioPagina: number = constante.paginacion.tamanioPagina;
  listaPerfil: PerfilI[] = [];
  listaUsuario: UsuarioOrquestadorI[] = [];


  frmFilterUsuario = this.formBuilder.group({
    idperfil: [0, [Validators.required]]
  });


  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private perfilService: PerfilService,
    private usuarioService: UsuarioService,
    private usuarioOrquestadorService: UsuarioOrquestadorService
  ) { }

  ngOnInit(): void {
    this.cargarListaPerfil();
  }

  cargarListaPerfil() {
    this.perfilService.listarPerfil$().subscribe(
      resp => {
        this.listaPerfil = resp.data;
      }, error => {
        console.log("Error: " + JSON.stringify(error))
        Swal.fire({
          icon: 'error',
          title: error.error.statusDetail,
          confirmButtonColor: constante.color_alert.rojo,
          confirmButtonText: 'Aceptar',
        });
      });
  }

  listarUsuario() {
    let objFiltroUsuario: UsuarioOrquestadorFilterI = {
      idperfil: this.frmFilterUsuario.value.idperfil,
      identidadprestadora: 0, // TODO: cambiar
      flagvalidarentidad: true,
      pageNumber: this.pagina,
      pageSize: this.tamanioPagina,
    };

    this.usuarioOrquestadorService
      .listarUsuario$(objFiltroUsuario)
      .subscribe((resp) => {
        this.listaUsuario = resp.data.lista;
        console.log('this.listaUsuario: ' + JSON.stringify(this.listaUsuario));
      });
  }

  abrirModalCrearUsuario() {
    this.frmUsuario.reset();
    let objEntidad = {
      id: 1,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-xl modal-dialog-centered',
    };
    this.openModal(this._modal_nuevo_usuario, objEntidad);
  }

  abrirModaCrearActualizarUsuario(
    // item: OrganizacioRPE, fila: number
  ) {
    let objEntidad = {
      id: 1,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-xl modal-dialog-centered',
    };
    this.openModal(this._modal_editar_usuario, objEntidad);

  }

  eliminarUsuario(row: number, idusario: number) {
    Swal.fire({
      title: 'Está seguro que desea eliminar el registro?',
      text: "Esta acción no se podrá recuperar!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: constante.color_alert.rojo,
      cancelButtonColor: constante.color_alert.plomo,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario$(idusario).subscribe(resp => {
          this.listaUsuario.splice(row, 1);
          Swal.fire({
            text: 'El usuario se elimnó correctamente.',
            confirmButtonColor: constante.color_alert.verde,
          });
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
          });
        });
      }
    });
  }

  openModal(template: TemplateRef<any>, objClass: any) {
    this.modalRef = this.modalService.show(template, objClass);
  }
}
