import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { EntidadPrestadoraI } from 'src/app/interfaces/entidad-prestadora-i';
import { EntidadPrestadoraService } from 'src/app/servicios/entidad-prestadora.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-entidad-prestadora',
  templateUrl: './entidad-prestadora.component.html',
  styleUrls: ['./entidad-prestadora.component.css'],
})
export class EntidadPrestadoraComponent implements OnInit {
  @ViewChild('modal_nuevo_entidad') _modal_nuevo_entidad: TemplateRef<any>;

  contentArray = new Array(5).fill('');
  // returnedArray?: string[];

  modalRef?: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: false,
  };

  nuTipo: number = 1;
  paginaActual: number = 1;

  listaEntidadPrestadora: EntidadPrestadoraI[] = [];
  objEntidadPrestadoraActualiza: EntidadPrestadoraI;

  frmEntidadPrestadora = this.formBuilder.group({
    ruc: ['', [Validators.required]],
    razonsocial: ['', [Validators.required]],
  });

  frmFiltroEntidadPrestadora = this.formBuilder.group({
    ruc: ['', [Validators.required]],
    razonsocial: ['', [Validators.required]],
  });

  constructor(
    private modalService: BsModalService,
    private entidadPrestadoraService: EntidadPrestadoraService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {

  }

  doModalEntidad() {
    let objEntidad = {
      id: 1,
      backdrop: true,
      ignoreBackdropClick: true,
      // class: 'modal-md',
    };
    this.openModal(this._modal_nuevo_entidad, objEntidad);
  }

  crearEntidad() {
    this.spinner.show();


    let param;
    if (this.nuTipo == 1) {
      param = {
        ruc: this.frmEntidadPrestadora.value.ruc,
        razonsocial: this.frmEntidadPrestadora.value.razonsocial,
        usuariocreacion: 'tsalinas',
        fechacreacion: '2022-12-05',
        usuariomodificacion: '',
        fechamodificacion: '',
        estadoregistro: true,
      };
    } else {
      this.nuTipo = 1;
      param = {
        identidadprestadora:
          this.objEntidadPrestadoraActualiza.identidadprestadora,
        ruc: this.frmEntidadPrestadora.value.ruc,
        razonsocial: this.frmEntidadPrestadora.value.razonsocial,
        usuariocreacion: this.objEntidadPrestadoraActualiza.usuariocreacion,
        fechacreacion: this.objEntidadPrestadoraActualiza.fechacreacion,
        usuariomodificacion: 'frodas',
        fechamodificacion: '2022-12-02',
        estadoregistro: true,
      };
    }

    this.entidadPrestadoraService.agregarEntidad$(param).subscribe(
      (resp) => {
        this.spinner.hide();
        this.frmEntidadPrestadora.reset();
        this.listaEntidadPrestadora.push(resp.data);
        this.hideModal(1);
        Swal.fire('La entidad se agregó correctamente');
      },
      (error) => {
        this.hideModal(1);
        Swal.fire({
          icon: 'error',
          text: 'Ocurrio un error en el registro',
        });
        this.spinner.hide();
      }
    );
  }

  abrirModalActualizar(obj: EntidadPrestadoraI) {
    this.nuTipo = 2;
    this.objEntidadPrestadoraActualiza = obj;
    this.frmEntidadPrestadora.controls.ruc.setValue(
      this.objEntidadPrestadoraActualiza.ruc
    );
    this.frmEntidadPrestadora.controls.razonsocial.setValue(
      this.objEntidadPrestadoraActualiza.razonsocial
    );
    let objEntidad = {
      id: 1,
      backdrop: true,
      ignoreBackdropClick: true,
      // class: 'modal-md',
    };
    this.openModal(this._modal_nuevo_entidad, objEntidad);
  }

  eliminarEntidad(obj: EntidadPrestadoraI, fila: number) {
    this.spinner.show();
    let param = {
      identidadprestadora: obj.identidadprestadora,
      ruc: obj.ruc,
      razonsocial: obj.razonsocial,
      usuariocreacion: 'tsalinas',
      fechacreacion: '2022-12-05',
      usuariomodificacion: '',
      fechamodificacion: '',
      estadoregistro: false,
    };

    this.entidadPrestadoraService.agregarEntidad$(param).subscribe(
      (resp) => {
        this.spinner.hide();
        this.listaEntidadPrestadora[fila].estadoregistro = 'false';
        Swal.fire({ text: 'Se elimino correctamente',  confirmButtonColor: 'LightSeaGreen',});
      },
      (error) => {
        this.hideModal(1);
        Swal.fire({
          icon: 'error',
          text: 'Ocurrio un error al eliminar',
        });
        this.spinner.hide();
      }
    );
  }

  listarEntidadPrestadora() {
    this.spinner.show();
    let param = {
      ruc: this.frmFiltroEntidadPrestadora.value.ruc,
      razonsocial: this.frmFiltroEntidadPrestadora.value.razonsocial,
    };

    this.entidadPrestadoraService.listarEntidad$(param).subscribe(
      (resp) => {
        this.spinner.hide();
        this.listaEntidadPrestadora = resp.data;
        this.contentArray=resp.data;
      //   this.contentArray = this.contentArray.map((v: string, i: number) => {
      //     return 'Line '+ (i + 1);
      //  });
       this.listaEntidadPrestadora = this.contentArray.slice(0, 5);

      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  openModal(template: TemplateRef<any>, objClass: any) {
    this.modalRef = this.modalService.show(template, objClass);
  }
  hideModal(id: number) {
    this.modalService.hide(id);
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
      const endItem = event.page * event.itemsPerPage;
      this.listaEntidadPrestadora = this.contentArray.slice(startItem, endItem);
  }
}
