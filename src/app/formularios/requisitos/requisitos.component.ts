import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { lineaProductoI } from 'src/app/interfaces/linea-producto-i';
import { maestroFilterI } from 'src/app/interfaces/maestro-filter';
import { productoI } from 'src/app/interfaces/producto-i';
import { RegionI } from 'src/app/interfaces/region-i';
import { RequisitoFilterI } from 'src/app/interfaces/requisito-filter';
import { RequisitoI } from 'src/app/interfaces/requisito-i';
import { SectorFilterI } from 'src/app/interfaces/sector-filter';
import { SectorI } from 'src/app/interfaces/sector-i';
import { LineaProductoService } from 'src/app/servicios/linea-producto.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { RegionService } from 'src/app/servicios/region.service';
import { RequisitoService } from 'src/app/servicios/requisito.service';
import { SectorService } from 'src/app/servicios/sector.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { constante } from 'src/app/utilitarios/constantes';
import { eTipoAccion } from 'src/app/utilitarios/data.enums';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-requisitos',
  templateUrl: './requisitos.component.html',
  styleUrls: ['./requisitos.component.css'],
})
export class RequisitosComponent implements OnInit {
  @ViewChild('modal_nuevo_requisito') _modal_nuevo_requisito: TemplateRef<any>;

  modalRef?: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: false,
  };

  nuTipo: number = eTipoAccion.Insertar; // 1;
  filaRegistroActualizar: number;

  // PARA REGISTRO
  frmRequisito = this.formBuilder.group({
    idsector: [0, [Validators.required]],
    idlineaproducto: [0, [Validators.required]],
    idproducto: [0, [Validators.required]],
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
  });

  // PARA BUSQUEDA
  frmFiltroRequisito = this.formBuilder.group({
    idsector: [0, [Validators.required]],
    idlineaproducto: [0, [Validators.required]],
    idproducto: [0, [Validators.required]],
    nombre: ['', [Validators.required]],
  });

  objFiltroRequisitoP: RequisitoFilterI;
  objRequisito: RequisitoI;
  // objRequisitoActualizar: RequisitoI;

  //paginacion
  pagina: number = 1;
  tamanioPagina: number = constante.paginacion.tamanioPagina;
  totalItems: number;

  objUsuario: any;

  objFiltroSectorP: SectorFilterI;
  listaSector: SectorI[] = [];
  sectorSeleccionado?: SectorI;

  listaRegion: RegionI[] = [];
  listaLineaProducto: lineaProductoI[] = [];
  listarProducto: productoI[] = [];

  listaSectorModal: SectorI[] = [];
  listaRegionModal: RegionI[] = [];
  listaLineaProductoModal: lineaProductoI[] = [];
  listarProductoModal: productoI[] = [];

  listaRequisito: RequisitoI[] = [];

  objActualizarRequisito: RequisitoI;

  constructor(
    private modalService: BsModalService,
    private requisitoService: RequisitoService,

    private formBuilder: FormBuilder,
    // private spinner: NgxSpinnerService,
    private usuarioService: UsuarioService,
    private sectorService: SectorService,
    private lineaProductoService: LineaProductoService,
    private regionService: RegionService,
    private productoService: ProductoService
  ) { }

  ngOnInit(): void {
    this.cargarMaestros();
    this.bindEventsForm();
    this.objUsuario = JSON.parse(this.usuarioService.getUsuario());
  }

  bindEventsForm() {
    this.frmFiltroRequisito.get('idsector').valueChanges.subscribe((value) => {
      let param = {
        idsector: value,
        pageNumber: 1,
        pageSize: 100,
      };

      this.lineaProductoService
        .listarLineaProducto$(param)
        .subscribe((resp) => {
          this.frmFiltroRequisito.controls.idlineaproducto.setValue(0);
          this.frmFiltroRequisito.controls.idproducto.setValue(0);
          this.listarProducto = [];
          this.listaLineaProducto = resp.data.lista;
        });
    });

    this.frmFiltroRequisito
      .get('idlineaproducto')
      .valueChanges.subscribe((value) => {
        let param = {
          idlineaproducto: value,
          pageNumber: 1,
          pageSize: 100,
        };
        if (value != 0) {
          this.productoService.listarProducto$(param).subscribe((resp) => {
            this.frmFiltroRequisito.controls.idproducto.setValue(0);
            this.listarProducto = resp.data.lista;
          });
        }
      });

    this.frmRequisito.get('idsector').valueChanges.subscribe((value) => {
      let param = {
        idsector: value,
        pageNumber: 1,
        pageSize: 100,
      };

      this.lineaProductoService
        .listarLineaProducto$(param)
        .subscribe((resp) => {
          this.frmRequisito.controls.idlineaproducto.setValue(0);
          this.frmRequisito.controls.idproducto.setValue(0);
          this.listarProductoModal = [];
          this.listaLineaProductoModal = resp.data.lista;
        });
    });

    this.frmRequisito.get('idlineaproducto').valueChanges.subscribe((value) => {
      let param = {
        // nombre: null,
        // descripcion: null,
        idlineaproducto: value,
        // idfichatpe: 0,
        pageNumber: 1,
        pageSize: 100,
      };
      if (value != 0) {
        this.productoService.listarProducto$(param).subscribe((resp) => {
          this.frmRequisito.controls.idproducto.setValue(0);
          this.listarProductoModal = resp.data.lista;
        });
      }
    });
  }

  cargarMaestros() {
    const objFiltro: maestroFilterI = {
      nombre: null,
      descripcion: null,
      pageNumber: 1,
      pageSize: 100,
    };
    forkJoin([
      this.sectorService.listarSector$(objFiltro),
      this.regionService.listarRegion$(objFiltro),
    ]).subscribe((resp) => {
      this.listaSector = resp[0].data.lista;
      this.listaRegion = resp[1].data.lista;
      this.listaSectorModal = resp[0].data.lista;
    });
  }

  listarSector() {
    this.objFiltroSectorP = {
      nombre: null,
      descripcion: null,
    };

    this.sectorService
      .listarSector$(this.objFiltroSectorP)
      .subscribe((resp) => {
        this.listaSector = resp.data;
        console.log(JSON.stringify(resp.data));
      });
  }

  abrirModalCrearRequisito() {
    this.nuTipo = eTipoAccion.Insertar;
    this.frmRequisito.reset();
    this.frmRequisito.controls.idsector.setValue(0);
    this.listaLineaProductoModal = [];
    this.listarProductoModal = [];
    let objRequisito = {
      id: 1,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-lg modal-dialog-centered',
    };
    this.openModal(this._modal_nuevo_requisito, objRequisito);
  }

  crearActualizarEntidad() {
    if (this.nuTipo == eTipoAccion.Actualizar) {
      Swal.fire({
        title: 'Está seguro que desea actualizar el registro?',
        text: 'Esta acción no se podrá recuperar!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: constante.color_alert.rojo,
        cancelButtonColor: constante.color_alert.plomo,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('result.isConfirmed: ' + result.isConfirmed);
          this.crearActualizarEntidadAccion();

        }
      });
    } else {
      this.crearActualizarEntidadAccion();
    }
  }

  crearActualizarEntidadAccion() {
    let requestRequisito: RequisitoI = {
      idrequisito:
        this.nuTipo == eTipoAccion.Insertar
          ? 0
          : this.objActualizarRequisito.idrequisito,
      nombre: this.frmRequisito.value.nombre,
      descripcion:
        this.frmRequisito.value.descripcion == ''
          ? null
          : this.frmRequisito.value.descripcion,
      idproducto: this.frmRequisito.value.idproducto,
      tipovalor: '',
      listavalorkey: '',
      nombresector: this.listaSectorModal.filter(
        (e) => (e.idsector = this.frmRequisito.value.idsector)
      )[0].nombre,
      nombrelineaproducto: this.listaLineaProductoModal.filter(
        (e) => (e.idlineaproducto = this.frmRequisito.value.idlineaproducto)
      )[0].nombre,
      usuariocreacion: this.objUsuario.usuario,
      fechacreacion: new Date(),
      usuariomodificacion:
        this.nuTipo == eTipoAccion.Insertar ? null : this.objUsuario.usuario,
      fechamodificacion: new Date(),
      estadoregistro: true,
      idlineaproducto: this.frmRequisito.value.idlineaproducto,
      idsector: this.frmRequisito.value.idsector,
      isChecked: true
    };

    this.requisitoService
      .agregarActualizarRequisito$(requestRequisito)
      .subscribe(
        (resp) => {
          if (this.nuTipo == eTipoAccion.Insertar) {
            this.listaRequisito.push(resp.data);
            this.hideModal(1);
            Swal.fire({
              text: 'La entidad se agregó correctamente',
              confirmButtonColor: constante.color_alert.verde,
            });
          } else {
            this.listaRequisito[this.filaRegistroActualizar] = resp.data;
            this.hideModal(1);
            Swal.fire({ title: 'Se actualizó correctamente', confirmButtonColor: constante.color_alert.verde, confirmButtonText: 'Aceptar' });
          }
          this.listarRequisito();
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

  abrirModalActualizar(objRequisito: RequisitoI, fila: number) {
    this.nuTipo = eTipoAccion.Actualizar;

    this.requisitoService.obtenerDeatlle$(objRequisito.idrequisito).subscribe(resp => {
      this.filaRegistroActualizar = fila;
      this.objActualizarRequisito = resp.data;
      this.frmRequisito.controls.nombre.setValue(
        this.objActualizarRequisito.nombre
      );
      this.frmRequisito.controls.descripcion.setValue(
        this.objActualizarRequisito.descripcion
      );
      this.frmRequisito.controls.idsector.setValue(
        this.objActualizarRequisito.idsector
      );

      let paramLineaProducto = {
        idsector: this.objActualizarRequisito.idsector,
        pageNumber: 1,
        pageSize: 100,
      };

      let paramProducto = {
        // nombre: null,
        // descripcion: null,
        idlineaproducto: this.objActualizarRequisito.idlineaproducto,
        // idfichatpe: 0,
        pageNumber: 1,
        pageSize: 100,
      };
      forkJoin([
        this.lineaProductoService.listarLineaProducto$(paramLineaProducto),
        this.productoService.listarProducto$(paramProducto),
      ]).subscribe((resp) => {
        this.listaLineaProductoModal = resp[0].data.lista;
        this.listarProductoModal = resp[1].data.lista;
        let objEntidad = {
          id: 1,
          backdrop: true,
          ignoreBackdropClick: true,
          class: 'modal-lg modal-dialog-centered',
        };
        this.openModal(this._modal_nuevo_requisito, objEntidad);

        this.frmRequisito.controls.idlineaproducto.setValue(
          this.objActualizarRequisito.idlineaproducto
        );
        this.frmRequisito.controls.idproducto.setValue(
          this.objActualizarRequisito.idproducto
        );
      });
    });



  }

  eliminarRequisito(idRequisito: number, row: number) {
    Swal.fire({
      title: 'Está seguro que desea eliminar el registro?',
      text: 'Esta acción no se podrá recuperar!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: constante.color_alert.rojo,
      cancelButtonColor: constante.color_alert.plomo,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.requisitoService.eliminarRequisito$(idRequisito).subscribe(
          (resp) => {
            this.listaRequisito.splice(row, 1);
            Swal.fire({
              title: 'Se elimino correctamente',
              confirmButtonColor: constante.color_alert.verde,
              confirmButtonText: 'Aceptar'
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

  listarRequisito() {
    this.objFiltroRequisitoP = {
      idsector: this.frmFiltroRequisito.value.idsector,
      idlineaproducto: this.frmFiltroRequisito.value.idlineaproducto,
      idproducto: this.frmFiltroRequisito.value.idproducto,
      nombre:
        this.frmFiltroRequisito.value.nombre == ''
          ? null
          : this.frmFiltroRequisito.value.nombre,
      pageNumber: this.pagina,
      pageSize: this.tamanioPagina,
    };

    this.requisitoService
      .listarRequisito$(this.objFiltroRequisitoP)
      .subscribe((resp) => {
        this.listaRequisito = resp.data.lista;
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
    this.listarRequisito();
  }
}
