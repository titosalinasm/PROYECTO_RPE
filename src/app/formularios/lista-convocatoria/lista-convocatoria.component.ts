import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { convocatoriaI } from 'src/app/interfaces/convocatoria-i';
import { convocatoriaProductoI } from 'src/app/interfaces/convocatoria-producto-i';
import { lineaProductoI } from 'src/app/interfaces/linea-producto-i';
import { maestroFilterI } from 'src/app/interfaces/maestro-filter';
import { productoI } from 'src/app/interfaces/producto-i';
import { RegionI } from 'src/app/interfaces/region-i';
import { RequisitoFilterI } from 'src/app/interfaces/requisito-filter';
import { RequisitoI } from 'src/app/interfaces/requisito-i';
import { SectorI } from 'src/app/interfaces/sector-i';
import { LineaProductoService } from 'src/app/servicios/linea-producto.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { RegionService } from 'src/app/servicios/region.service';
import { RequisitoService } from 'src/app/servicios/requisito.service';
import { SectorService } from 'src/app/servicios/sector.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-lista-convocatoria',
  templateUrl: './lista-convocatoria.component.html',
  styleUrls: ['./lista-convocatoria.component.css'],
})
export class ListaConvocatoriaComponent implements OnInit {
  modalRef?: BsModalRef;
  @ViewChild('modal_nueva_convocatoria')
  _modal_nueva_convocatoria: TemplateRef<any>;

  @ViewChild('modal_agregar_requisito')
  _modal_agregar_requisito: TemplateRef<any>;

  frmConvocatoria = this.formBuilder.group({
    nombre: ['convocatoria 1', [Validators.required]],
    idestado: [1, [Validators.required]],
    descripcion: ['descripcion 1', [Validators.required]],
    plazoinscripcioninicio: [new Date(), [Validators.required]],
    plazoinscripcionfin: [new Date(), [Validators.required]],
    plazoevaluacioninicio: [new Date(), [Validators.required]],
    plazoevaluacionfin: [new Date(), [Validators.required]],
    plazoconfirmacionrpeinicio: [new Date(), [Validators.required]],
    plazoconfirmacionrpefin: [new Date(), [Validators.required]],
    plazoconfirmacionentidadinicio: [new Date(), [Validators.required]],
    plazoconfirmacionentidadfin: [new Date(), [Validators.required]],
    idregion: [[1, 2, 3], [Validators.required]],
  });

  frmProductoFiltro = this.formBuilder.group({
    idsector: [0, [Validators.required]],
    idlineaproducto: [0, [Validators.required]],
    idproducto: [0, [Validators.required]],
  });

  objUsuario: any;
  listaRegion: RegionI[] = [];
  listaSector: SectorI[] = [];
  listaLineaProducto: lineaProductoI[] = [];
  listaProducto: productoI[] = [];
  listaRequisito: RequisitoI[]=[];

  listConvocatoriaProducto: convocatoriaProductoI[] = [];

  constructor(
    private modalService: BsModalService,
    private usuarioService: UsuarioService,
    private sectorService: SectorService,
    private lineaProductoService: LineaProductoService,
    private regionService: RegionService,
    private productoService: ProductoService,
    private formBuilder: FormBuilder,
    private requisitoService: RequisitoService
  ) {}

  ngOnInit(): void {
    this.cargarMaestros();
    this.bindEventsForm();
    this.objUsuario = JSON.parse(this.usuarioService.getUsuario());
  }
  bindEventsForm() {
    this.frmProductoFiltro.get('idsector').valueChanges.subscribe((value) => {
      let param = {
        idsector: value,
        pageNumber: 1,
        pageSize: 100,
      };

      this.lineaProductoService
        .listarLineaProducto$(param)
        .subscribe((resp) => {
          this.listaLineaProducto = resp.data.lista;
        });
    });

    this.frmProductoFiltro
      .get('idlineaproducto')
      .valueChanges.subscribe((value) => {
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
            this.listaProducto = resp.data.lista;
          });
        }
      });
  }

  agregarProducto() {
    let objProducto: convocatoriaProductoI = {
      usuariocreacion: this.objUsuario.usuario,
      fechacreacion: new Date(),
      usuariomodificacion: this.objUsuario.usuario,
      fechamodificacion: new Date(),
      estadoregistro: true,
      idproducto: this.frmProductoFiltro.value.idproducto,
      nombreproducto: this.listaProducto.filter(
        (e) => e.idproducto == this.frmProductoFiltro.value.idproducto
      )[0].nombre,
      idsector: this.frmProductoFiltro.value.idsector,
      nombresector: this.listaSector.filter(
        (e) => e.idsector == this.frmProductoFiltro.value.idsector
      )[0].nombre,
      idlineaproducto: this.frmProductoFiltro.value.idlineaproducto,
      nombrelineaproducto: this.listaLineaProducto.filter(
        (e) => e.idlineaproducto == this.frmProductoFiltro.value.idlineaproducto
      )[0].nombre,
      requisitos: [],
    };
    this.listConvocatoriaProducto.push(objProducto);
  }

  agregarConvocatoria() {
    let convocatoria: convocatoriaI = {
      usuariocreacion: 'usuario',
      fechacreacion: new Date(),
      usuariomodificacion: 'usuario',
      fechamodificacion: new Date(),
      estadoregistro: true,
      idconvocatoria: 0,
      nombre: this.frmConvocatoria.value.nombre,
      descripcion: this.frmConvocatoria.value.nombre,
      idrutapostulacionl: 0,
      fechainicioinscripcion: this.frmConvocatoria.value.plazoinscripcioninicio,
      fechafininscripcion: this.frmConvocatoria.value.plazoinscripcionfin,
      fechainicioevaluacion: this.frmConvocatoria.value.plazoevaluacioninicio,
      fechafinevaluacion: this.frmConvocatoria.value.plazoevaluacionfin,
      fechainicioconfirmacionep:
        this.frmConvocatoria.value.plazoconfirmacionrpeinicio,
      fechafinconfirmacionep:
        this.frmConvocatoria.value.plazoconfirmacionrpefin,
      fechainicioconfirmacionorg:
        this.frmConvocatoria.value.plazoconfirmacionentidadinicio,
      fechafinconfirmacionorg:
        this.frmConvocatoria.value.plazoconfirmacionentidadfin,
      idestadoconvocatoria: this.frmConvocatoria.value.idestado,
      flagfinconvocatoria: true,
      regiones: [],
      productos: [],
    };

    //cargar regiones
    let regiones: any[] = [];
    this.frmConvocatoria.value.idregion.forEach(function (value) {
      let region = {
        usuariocreacion: 'usuario',
        fechacreacion: new Date(),
        usuariomodificacion: 'usuario',
        fechamodificacion: new Date(),
        estadoregistro: true,
        idregion: value,
      };
      regiones.push(region);
    });

    convocatoria.regiones = regiones;

    // productos
    let lstRequisitosTmp = [
      {
        idproducto: 1,
        idrequisito: 1,
        nombre: 'requisito 1',
        descripcion: '',
        valor: '1',
      },
      {
        idproducto: 2,
        idrequisito: 2,
        nombre: 'requisito 2',
        descripcion: '',
        valor: '2',
      },
    ];

    let productos: any[] = [];

    this.listConvocatoriaProducto.forEach(function (value) {
      let lstRequisitos: any[] = [];
      lstRequisitosTmp.forEach(function (value) {
        let requisito = {
          usuariocreacion: 'usuario',
          fechacreacion: new Date(),
          usuariomodificacion: 'usuario',
          fechamodificacion: new Date(),
          estadoregistro: true,
          idproducto: value.idproducto,
          idrequisito: value.idrequisito,
          nombre: value.nombre,
          descripcion: value.descripcion,
          valor: value.valor,
        };
        lstRequisitos.push(requisito);
      });
      value.requisitos = lstRequisitos;

      productos.push(value);
    });

    convocatoria.productos = productos;

    console.log('objConvocatoria: ' + JSON.stringify(convocatoria));
  }

  abrirModalNuevaConvocatoria() {
    let config = {
      backdrop: true,
      ignoreBackdropClick: false,
      class: 'modal-xl',
    };
    this.openModal(this._modal_nueva_convocatoria, config);
  }

  abrirModalRequisito(id: number) {
    let param= {
      nombre: null,
      idproducto: id
    };
    this.requisitoService.listarRequisitoNP$(param).subscribe((resp) => {
      this.listaRequisito=resp.data;
      let config = {
        backdrop: true,
        ignoreBackdropClick: false,
        class: 'modal-lg',
      };
      this.openModal(this._modal_agregar_requisito, config);
    });

  }

  openModal(template: TemplateRef<any>, config: any) {
    this.modalRef = this.modalService.show(template, config);
  }

  cerrarModalAgregarConvocatoria() {
    this.hideModal(1);
  }

  cerrarModalAgregarRequisito() {
    this.hideModal(2);
  }

  hideModal(id: number) {
    this.modalService.hide(id);
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
    });
  }

  selectedItemsList = [];
  checkedIDs = [];

  changeSelection() {
    this.fetchSelectedItems()
  }

  fetchSelectedItems() {
    this.selectedItemsList = this.listaRequisito.filter((value, index) => {
      // return value.isChecked
    });
  }

  fetchCheckedIDs() {
    this.checkedIDs = []
    this.listaRequisito.forEach((value, index) => {
      // if (value.isChecked) {
      //   this.checkedIDs.push(value.idrequisito);
      // }
    });
  }
}
