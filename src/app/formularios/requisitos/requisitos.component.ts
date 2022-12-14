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

  nuTipo: number = 1;
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
  objRequisitoActualizar: RequisitoI;

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

  listaRequisito: RequisitoI[]=[];

  objActualizarRequisito: RequisitoI;


  constructor(
    private modalService: BsModalService,
    private requisitoService: RequisitoService,

    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private usuarioService: UsuarioService,
    private sectorService: SectorService,
    private lineaProductoService: LineaProductoService,
    private regionService: RegionService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.cargarMaestros();
    this.bindEventsForm();
    this.objUsuario=JSON.parse(this.usuarioService.getUsuario());
  }

  bindEventsForm() {
    this.frmFiltroRequisito.get('idsector').valueChanges.subscribe((value) => {
      let param = {
        idsector: value,
        pageNumber: 1,
        pageSize: 100,
      };

      this.spinner.show();
      this.lineaProductoService
        .listarLineaProducto$(param)
        .subscribe((resp) => {
          this.spinner.hide();
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
          nombre: null,
          descripcion: null,
          idlineaproducto: value,
          idfichatpe: 0,
          pageNumber: 1,
          pageSize: 100,
        };
        if (value != 0) {
          this.spinner.show();
          this.productoService.listarProducto$(param).subscribe((resp) => {
            this.spinner.hide();
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

      this.spinner.show();
      this.lineaProductoService
        .listarLineaProducto$(param)
        .subscribe((resp) => {
          this.spinner.hide();
          this.frmRequisito.controls.idlineaproducto.setValue(0);
          this.frmRequisito.controls.idproducto.setValue(0);
          this.listarProductoModal = [];
          this.listaLineaProductoModal = resp.data.lista;
        });
    });

    this.frmRequisito.get('idlineaproducto').valueChanges.subscribe((value) => {
      let param = {
        nombre: null,
        descripcion: null,
        idlineaproducto: value,
        idfichatpe: 0,
        pageNumber: 1,
        pageSize: 100,
      };
      if (value != 0) {
        this.spinner.show();
        this.productoService.listarProducto$(param).subscribe((resp) => {
          this.spinner.hide();
          this.frmRequisito.controls.idproducto.setValue(0);
          this.listarProductoModal = resp.data.lista;
        });
      }
    });
  }

  cargarMaestros() {
    this.spinner.show();
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
      this.spinner.hide();
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
    this.nuTipo=1;
    this.frmRequisito.reset();
    this.frmRequisito.controls.idsector.setValue(0);
    this.listaLineaProductoModal=[];
    this.listarProductoModal=[];
    let objRequisito = {
      id: 1,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-lg',
    };
    this.openModal(this._modal_nuevo_requisito, objRequisito);
  }

  crearActualizarEntidad() {
    this.spinner.show();

    let requestRequisito: RequisitoI={
      idrequisito: this.nuTipo==1?0:this.objActualizarRequisito.idrequisito,
      nombre:  this.frmRequisito.value.nombre,
      descripcion: this.frmRequisito.value.descripcion==''?null:this.frmRequisito.value.descripcion,
      idproducto:  this.frmRequisito.value.idproducto,
      tipovalor: '',
      listavalorkey: '',
      nombresector: this.listaSectorModal.filter(e=>e.idsector=this.frmRequisito.value.idsector)[0].nombre,
      nombrelineaproducto: this.listaLineaProductoModal.filter(e=>e.idlineaproducto=this.frmRequisito.value.idlineaproducto)[0].nombre,
      usuariocreacion: this.objUsuario.usuario,
      fechacreacion: new Date(),
      usuariomodificacion:this.nuTipo==1?null: this.objUsuario.usuario,
      fechamodificacion:new  Date(),
      estadoregistro: true,
      idlineaproducto: this.frmRequisito.value.idlineaproducto,
      idsector: this.frmRequisito.value.idsector
    }

    this.requisitoService.agregarActualizarRequisito$(requestRequisito).subscribe(resp=>{
        this.spinner.hide();
        if(this.nuTipo==1){
          this.listaRequisito.push(resp.data);
        }else{

        }
    });

  }

  cerrarModalCrearActualizar() {
    this.hideModal(1);
  }

  abrirModalActualizar(objRequisito: RequisitoI, fila: number) {
    this.nuTipo = 2;
    this.filaRegistroActualizar = fila;
    this.objRequisitoActualizar = objRequisito;
    this.frmRequisito.controls.nombre.setValue(this.objRequisitoActualizar.nombre);
    this.frmRequisito.controls.descripcion.setValue(this.objRequisitoActualizar.descripcion);
    this.frmRequisito.controls.idsector.setValue(this.objRequisitoActualizar.idsector);


    let objEntidad = {
      id: 1,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-lg'
    };
    this.openModal(this._modal_nuevo_requisito, objEntidad);
  }

  cargarCombosSeleccionados(){
    let requestLineaProducto = {
      // idsector: this.objActualizarRequisito.,
      pageNumber: 1,
      pageSize: 100,
    };

    // forkJoin([
    //   this.lineaProductoService.listarLineaProducto$(requestLineaProducto),
    //   this.regionService.listarRegion$(objFiltro),
    // ]).subscribe((resp) => {
    //   this.spinner.hide();
    //   this.listaSector = resp[0].data.lista;
    //   this.listaRegion = resp[1].data.lista;
    //   this.listaSectorModal = resp[0].data.lista;
    // });
  }

  eliminarRequisito(idRequisito: number, row: number) {
    this.spinner.show();
    this.requisitoService.eliminarRequisito$(idRequisito).subscribe((resp) => {
      this.spinner.hide();
      this.listaRequisito.splice(row, 1);
      Swal.fire({
        text: 'Se elimino correctamente',
        confirmButtonColor: 'LightSeaGreen',
      });
    });
  }

  listarRequisito() {
    this.spinner.show();
    this.objFiltroRequisitoP = {
      idsector: this.frmFiltroRequisito.value.idsector,
      idlineaproducto: this.frmFiltroRequisito.value.idlineaproducto,
      idproducto:this.frmFiltroRequisito.value.idproducto,
      nombre: this.frmFiltroRequisito.value.nombre==''?null:this.frmFiltroRequisito.value.nombre,
      pageNumber: this.pagina,
      pageSize: this.tamanioPagina,
    };

    this.requisitoService
      .listarRequisito$(this.objFiltroRequisitoP)
      .subscribe((resp) => {
        this.spinner.hide();
        this.listaRequisito=resp.data.lista
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
