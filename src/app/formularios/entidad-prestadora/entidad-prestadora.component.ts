import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { EntidadPrestadoraI } from 'src/app/interfaces/entidad-prestadora-i';
import { EntidadPrestadoraService } from 'src/app/servicios/entidad-prestadora.service';
import Swal from 'sweetalert2';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { EntidadPrestadoraFilterI } from 'src/app/interfaces/entidad-prestadora-filter';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { constante } from 'src/app/utilitarios/constantes';
import { eTipoAccion } from 'src/app/utilitarios/data.enums';

@Component({
  selector: 'app-entidad-prestadora',
  templateUrl: './entidad-prestadora.component.html',
  styleUrls: ['./entidad-prestadora.component.css'],
})
export class EntidadPrestadoraComponent implements OnInit {
  @ViewChild('modal_nuevo_entidad') _modal_nuevo_entidad: TemplateRef<any>;
  modalRef?: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: false,
  };

  nuTipo: number = eTipoAccion.Insertar; // 1;
  filaRegistroActualizar: number;

  listaEntidadPrestadora: EntidadPrestadoraI[] = [];

  frmEntidadPrestadora = this.formBuilder.group({
    ruc: ['', [Validators.required]],
    razonsocial: ['', [Validators.required]],
  });

  frmFiltroEntidadPrestadora = this.formBuilder.group({
    ruc: ['', [Validators.required]],
    razonsocial: ['', [Validators.required]],
  });

  objFiltroEntidadP: EntidadPrestadoraFilterI;
  objEntidadPrestadora: EntidadPrestadoraI;
  objEntidadPrestadoraActualizar: EntidadPrestadoraI;
  pagina: number = 1;
  tamanioPagina: number = constante.paginacion.tamanioPagina;
  totalItems: number;

  objUsuario: any;

  constructor(
    private modalService: BsModalService,
    private entidadPrestadoraService: EntidadPrestadoraService,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.objUsuario = JSON.parse(this.usuarioService.getUsuario() + '');
  }

  doModalEntidad() {
    this.nuTipo = eTipoAccion.Insertar;
    this.frmEntidadPrestadora.reset();
    let objEntidad = {
      id: 1,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered',
    };
    this.openModal(this._modal_nuevo_entidad, objEntidad);
  }

  crearActualizarEntidad() {
    if (this.nuTipo == eTipoAccion.Actualizar) {
      Swal.fire({
        title: '¿Está seguro que desea actualizar el registro?',
        text: 'Esta acción no se podrá recuperar!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: constante.color_alert.rojo,
        cancelButtonColor: constante.color_alert.plomo,
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.crearActualizarRegistroAccion();
        }
      });
    } else {
      this.crearActualizarRegistroAccion();
    }
  }

  crearActualizarRegistroAccion() {
    this.objEntidadPrestadora = {
      identidadprestadora:
        this.nuTipo == 1
          ? 0
          : this.objEntidadPrestadoraActualizar.identidadprestadora,
      ruc: this.frmEntidadPrestadora.value.ruc,
      razonsocial: this.frmEntidadPrestadora.value.razonsocial,
      usuariocreacion: this.objUsuario.usuario,
      fechacreacion: new Date(),
      usuariomodificacion:
        this.nuTipo == eTipoAccion.Insertar ? null : this.objUsuario.usuario,
      fechamodificacion:
        this.nuTipo == eTipoAccion.Insertar ? null : new Date(),
      estadoregistro: true,
    };

    this.entidadPrestadoraService
      .agregarEntidad$(this.objEntidadPrestadora)
      .subscribe(
        (resp) => {
          this.frmEntidadPrestadora.reset();
          if (this.nuTipo == eTipoAccion.Insertar) {
            this.listaEntidadPrestadora.push(resp.data);
            this.hideModal(1);
            Swal.fire({
              title: 'Se agregó correctamente',
              confirmButtonColor: constante.color_alert.verde,
              confirmButtonText: 'Aceptar',
            });
          } else {
            this.listaEntidadPrestadora[this.filaRegistroActualizar] =
              resp.data;
            this.hideModal(1);
            Swal.fire({
              title: 'Se actualizó correctamente',
              confirmButtonColor: constante.color_alert.verde,
              confirmButtonText: 'Aceptar',
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
        }
      );
  }

  cerrarModalCrearActualizar() {
    this.hideModal(1);
  }

  abrirModalActualizar(objEntidadPrestadora: EntidadPrestadoraI, fila: number) {
    this.nuTipo = eTipoAccion.Actualizar;
    this.filaRegistroActualizar = fila;
    this.objEntidadPrestadoraActualizar = objEntidadPrestadora;
    this.frmEntidadPrestadora.controls.razonsocial.setValue(
      objEntidadPrestadora.razonsocial
    );
    this.frmEntidadPrestadora.controls.ruc.setValue(objEntidadPrestadora.ruc);

    let objEntidad = {
      id: 1,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered',
    };
    this.openModal(this._modal_nuevo_entidad, objEntidad);
  }

  eliminarEntidad(idEntidadPrestadora: number, row: number) {
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
        this.entidadPrestadoraService
          .eliminarEntidad$(idEntidadPrestadora)
          .subscribe(
            (resp) => {
              this.listaEntidadPrestadora.splice(row, 1);
              Swal.fire({
                title: 'Se elimino correctamente',
                confirmButtonColor: constante.color_alert.verde,
                confirmButtonText: 'Aceptar',
              });
            },
            (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
              });
            }
          );
      }
    });
  }

  listarEntidadPrestadora() {
    this.objFiltroEntidadP = {
      razonsocial:
        this.frmFiltroEntidadPrestadora.value.razonsocial == ''
          ? null
          : this.frmFiltroEntidadPrestadora.value.razonsocial,
      ruc:
        this.frmFiltroEntidadPrestadora.value.ruc == ''
          ? null
          : this.frmFiltroEntidadPrestadora.value.ruc,
      pageNumber: this.pagina,
      pageSize: this.tamanioPagina,
    };

    this.entidadPrestadoraService
      .listarEntidad$(this.objFiltroEntidadP)
      .subscribe((resp) => {
        this.listaEntidadPrestadora = resp.data.lista;
        this.totalItems = resp.data.totalItems;
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
    this.listarEntidadPrestadora();
  }
}
