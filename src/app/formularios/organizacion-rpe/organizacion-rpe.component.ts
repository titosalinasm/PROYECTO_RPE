import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrgRPEFilter } from 'src/app/interfaces/organizacion-rpe -filter';
import { OrganizacioRPE } from 'src/app/interfaces/organizacion-rpe-i';
import { EntidadPrestadoraService } from 'src/app/servicios/entidad-prestadora.service';
import { OrganizacionRpeService } from 'src/app/servicios/organizacion-rpe.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { constante } from 'src/app/utilitarios/constantes';
import { eTipoAccion } from 'src/app/utilitarios/data.enums';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-organizacion-rpe',
  templateUrl: './organizacion-rpe.component.html',
  styleUrls: ['./organizacion-rpe.component.css'],
})
export class OrganizacionRpeComponent implements OnInit {
  modalRef?: BsModalRef;
  @ViewChild('modal_nuevo_org_rpe') _modal_nuevo_org_rpe: TemplateRef<any>;

  frmFilterOrganizacionRPE = this.formBuilder.group({
    ruc: ['', [Validators.required]],
    razonsocial: ['', [Validators.required]],
  });

  frmOrganizacionRPE = this.formBuilder.group({
    idorganizacionrpe: ['', [Validators.required]],
    ruc: ['', [Validators.required]],
    razonsocial: ['', [Validators.required]],
    nombres: ['', [Validators.required]],
    apellidopaterno: ['', [Validators.required]],
    apellidomaterno: ['', [Validators.required]],
    idtipodocumento: [1, [Validators.required]],
    numerodocumento: ['', [Validators.required]],
    correoelectronico: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
    celular: ['', [Validators.required]],
    idcargo: [1, [Validators.required]],
    idarea: [1, [Validators.required]],
    sitioweb: ['', [Validators.required]],
    redsocial: ['', [Validators.required]],
    usuariocreacion: ['', [Validators.required]],
    fechacreacion: ['', [Validators.required]],
    usuariomodificacion: ['', [Validators.required]],
    fechamodificacion: Date,
    estadoregistro: [true, [Validators.required]],
  });

  objFiltroOrgRPE: OrgRPEFilter;
  listaOrganizacionRPE: OrganizacioRPE[] = [];

  objOrganizacionRPE: OrganizacioRPE;
  objOrganizacionRPEActualizar: OrganizacioRPE;
  filaRegistroActualizar: number;

  pagina: number = 1;
  tamanioPagina: number = constante.paginacion.tamanioPagina;
  totalItems: number;
  nuTipo: number = eTipoAccion.Insertar; //1;

  objUsuario: any;

  constructor(
    private organizacionRpeService: OrganizacionRpeService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    // private spinner: NgxSpinnerService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.objUsuario = JSON.parse(this.usuarioService.getUsuario() + '');
  }

  crearActualizarOrganizacionPrestadora() {
    if (this.nuTipo == eTipoAccion.Actualizar) {
      Swal.fire({
        title: 'Está seguro que desea actualizar el registro?',
        text: "Esta acción no se podrá recuperar!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: constante.color_alert.rojo,
      cancelButtonColor: constante.color_alert.plomo,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
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
    this.objOrganizacionRPE = {
      idorganizacionrpe:
        this.nuTipo == eTipoAccion.Insertar
          ? 0
          : this.objOrganizacionRPEActualizar.idorganizacionrpe,
      ruc: this.frmOrganizacionRPE.value.ruc,
      razonsocial: this.frmOrganizacionRPE.value.razonsocial,
      nombres: this.frmOrganizacionRPE.value.nombres,
      apellidopaterno: this.frmOrganizacionRPE.value.apellidopaterno,
      apellidomaterno: this.frmOrganizacionRPE.value.apellidomaterno,
      idtipodocumento: 1,
      numerodocumento: this.frmOrganizacionRPE.value.numerodocumento,
      correoelectronico: this.frmOrganizacionRPE.value.correoelectronico,
      telefono: this.frmOrganizacionRPE.value.telefono,
      celular: this.frmOrganizacionRPE.value.celular,
      idcargo: 1,
      idarea: 1,
      sitioweb: this.frmOrganizacionRPE.value.sitioweb,
      redsocial: this.frmOrganizacionRPE.value.redsocial,
      usuariocreacion: this.objUsuario.usuario,
      fechacreacion: new Date(),
      usuariomodificacion: this.nuTipo == eTipoAccion.Insertar ? null : this.objUsuario.usuario,
      fechamodificacion: this.nuTipo == eTipoAccion.Insertar ? null : new Date(),
      estadoregistro: true,
    };
    this.organizacionRpeService
      .agregarActualizarEntidad$(this.objOrganizacionRPE)
      .subscribe((resp) => {
        if (this.nuTipo == eTipoAccion.Insertar) {
          this.listaOrganizacionRPE.push(resp.data);
          Swal.fire({
            text: 'Se agregó correctamente',
            confirmButtonColor: constante.color_alert.verde,
          });
        } else {
          this.listaOrganizacionRPE[this.filaRegistroActualizar] = resp.data;
          Swal.fire({ title: 'Se actualizó correctamente', confirmButtonColor: constante.color_alert.verde, confirmButtonText: 'Aceptar' });
        }
        this.hideModal(1);
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!'
        });
      });
  }

  abrirModaCrearOrganizacionRPE() {
    this.frmOrganizacionRPE.reset();
    let objEntidad = {
      id: 1,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-xl modal-dialog-centered',
    };
    this.openModal(this._modal_nuevo_org_rpe, objEntidad);
  }

  abrirModaActualizarOrganizacionRPE(item: OrganizacioRPE, fila: number) {

    this.nuTipo = eTipoAccion.Actualizar;
    this.filaRegistroActualizar = fila;
    this.objOrganizacionRPEActualizar = item;
    this.frmOrganizacionRPE.controls.nombres.setValue(item.nombres);
    this.frmOrganizacionRPE.controls.apellidopaterno.setValue(item.apellidopaterno);
    this.frmOrganizacionRPE.controls.apellidomaterno.setValue(item.apellidomaterno);
    this.frmOrganizacionRPE.controls.idtipodocumento.setValue(1);
    this.frmOrganizacionRPE.controls.numerodocumento.setValue(item.numerodocumento);
    this.frmOrganizacionRPE.controls.correoelectronico.setValue(item.correoelectronico);
    this.frmOrganizacionRPE.controls.telefono.setValue(item.telefono);
    this.frmOrganizacionRPE.controls.celular.setValue(item.celular);
    this.frmOrganizacionRPE.controls.idcargo.setValue(1);
    this.frmOrganizacionRPE.controls.idarea.setValue(1);
    this.frmOrganizacionRPE.controls.sitioweb.setValue(item.sitioweb);
    this.frmOrganizacionRPE.controls.redsocial.setValue(item.redsocial);

    let objEntidad = {
      id: 1,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-xl modal-dialog-centered',
    };
    this.openModal(this._modal_nuevo_org_rpe, objEntidad);
  }

  listarOrganizacionRPE() {
    this.objFiltroOrgRPE = {
      razonsocial:
        this.frmFilterOrganizacionRPE.value.razonsocial == ''
          ? null
          : this.frmFilterOrganizacionRPE.value.razonsocial,
      ruc:
        this.frmFilterOrganizacionRPE.value.ruc == ''
          ? null
          : this.frmFilterOrganizacionRPE.value.ruc,
      pageNumber: this.pagina,
      pageSize: this.tamanioPagina,
    };

    this.organizacionRpeService
      .listarOrganizacionRPE$(this.objFiltroOrgRPE)
      .subscribe((resp) => {
        this.listaOrganizacionRPE = resp.data.lista;
      });
  }

  eliminarOrganizacionRPE(fila: number, id: number) {
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
        this.organizacionRpeService.eliminarOrgRPE$(id).subscribe(resp => {
          this.listaOrganizacionRPE.splice(fila, 1);
          Swal.fire({
            text: 'La organización se elimnó correctamente.',
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
  hideModal(id: number) {
    this.modalService.hide(id);
  }

  pageChanged(event: PageChangedEvent): void {
    this.pagina = event.page;
    this.listarOrganizacionRPE();
  }
}
