import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PerfilI } from 'src/app/interfaces/perfil-i';
import { ParametroService } from 'src/app/servicios/parametro.service';
import { PerfilService } from 'src/app/servicios/perfil.service';
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
    idorganizacionrpe: ['', [Validators.required]],
    ruc: ['', [Validators.required]],
  });

  listaPerfil: PerfilI[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private perfilService: PerfilService
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

  abrirModalCrearUsuario() {
    // this.frmOrganizacionRPE.reset();
    let objEntidad = {
      id: 1,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-xl modal-dialog-centered',
    };
    this.openModal(this._modal_nuevo_usuario, objEntidad);
  }

  abrirModaActualizarUsuario(
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

  openModal(template: TemplateRef<any>, objClass: any) {
    this.modalRef = this.modalService.show(template, objClass);
  }
}
