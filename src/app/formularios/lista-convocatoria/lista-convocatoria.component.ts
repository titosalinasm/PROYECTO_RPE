import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { forkJoin } from 'rxjs';
import { convocatoriaI } from 'src/app/interfaces/convocatoria-i';
import { convocatoriaProductoI } from 'src/app/interfaces/convocatoria-producto-i';
import { convocatoriaRespuestaI } from 'src/app/interfaces/convocatoria-resp-i';
import { lineaProductoI } from 'src/app/interfaces/linea-producto-i';
import { maestroFilterI } from 'src/app/interfaces/maestro-filter';
import { productoI } from 'src/app/interfaces/producto-i';
import { RegionI } from 'src/app/interfaces/region-i';
import { RequisitoFilterI } from 'src/app/interfaces/requisito-filter';
import { RequisitoI } from 'src/app/interfaces/requisito-i';
import { SectorI } from 'src/app/interfaces/sector-i';
import { ConvocatoriaService } from 'src/app/servicios/convocatoria.service';
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
  selector: 'app-lista-convocatoria',
  templateUrl: './lista-convocatoria.component.html',
  styleUrls: ['./lista-convocatoria.component.css'],
})
export class ListaConvocatoriaComponent implements OnInit {
  modalRef?: BsModalRef;
  @ViewChild('modal_nueva_convocatoria') _modal_nueva_convocatoria: TemplateRef<any>;
  @ViewChild('modal_editar_convocatoria') _modal_editar_convocatoria: TemplateRef<any>;

  @ViewChild('modal_agregar_requisito') _modal_agregar_requisito: TemplateRef<any>;

  frmFiltroConvocatoria = this.formBuilder.group({
    idconvocatoria: ['', [Validators.required]],
    nombreconvocatoria: ['', [Validators.required]],
  });

  frmConvocatoria = this.formBuilder.group({
    nombre: ['convocatoria 1', [Validators.required]],
    idestado: [1, [Validators.required]],
    descripcion: ['descripcion 1', [Validators.required]],
    fechainicioinscripcion: [new Date(), [Validators.required]],
    fechafininscripcion: [new Date(), [Validators.required]],
    fechainicioevaluacion: [new Date(), [Validators.required]],
    fechafinevaluacion: [new Date(), [Validators.required]],
    fechainicioconfirmacionep: [new Date(), [Validators.required]],
    fechafinconfirmacionep: [new Date(), [Validators.required]],
    fechainicioconfirmacionorg: [new Date(), [Validators.required]],
    fechafinconfirmacionorg: [new Date(), [Validators.required]],
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
  listaRequisito: RequisitoI[] = [];
  listaRequisitoSeleccionado: any[] = [];
  listaConvocatoriaResult: convocatoriaRespuestaI[] = [];

  listConvocatoriaProducto: convocatoriaProductoI[] = [];
  filaProducto: number;

  convocatoria: any;
  nuTipo: number = eTipoAccion.Insertar; // 1;

  pagina: number = 1;
  tamanioPagina: number = constante.paginacion.tamanioPagina;
  totalItems: number;

  objConvocatoria: convocatoriaI;

  constructor(
    private modalService: BsModalService,
    private usuarioService: UsuarioService,
    private sectorService: SectorService,
    private lineaProductoService: LineaProductoService,
    private regionService: RegionService,
    private productoService: ProductoService,
    private formBuilder: FormBuilder,
    private requisitoService: RequisitoService,
    private convocatoriaService: ConvocatoriaService
  ) { }

  ngOnInit(): void {
    this.cargarMaestros();
    this.bindEventsForm();
    if (this.usuarioService.getUsuario())
      this.objUsuario = JSON.parse(this.usuarioService.getUsuario());
  }
  bindEventsForm() {
    this.frmProductoFiltro.get('idsector').valueChanges.subscribe((value) => {
      // console.log('bindEventsForm:idlineaproducto');

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

  listarConvocatoria() {
    let param = {
      idconvocatoria: this.frmFiltroConvocatoria.value.idconvocatoria,
      nombreconvocatoria: this.frmFiltroConvocatoria.value.nombreconvocatoria,
      pageNumber: this.pagina,
      pageSize: this.tamanioPagina,
    };
    this.convocatoriaService.listarConvocatoria$(param).subscribe((resp) => {
      this.listaConvocatoriaResult = resp.data.lista;
      this.totalItems = resp.data.totalItems;
    });
  }

  duplicarConvocatoria(idConvocatoria: number) {

    Swal.fire({
      title: '¿Está seguro que desea duplicar la convocatoria?',
      text: 'Esta acción no se podrá recuperar!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: constante.color_alert.rojo,
      cancelButtonColor: constante.color_alert.plomo,
      confirmButtonText: 'Sí, duplicar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // obtener el detalle convocatoria
        this.convocatoriaService.obtenerDetalleConvocatoria$(idConvocatoria).subscribe(
          resp => {
            let objConvocatoria: convocatoriaI = resp.data;
            objConvocatoria.idconvocatoria = 0;
            objConvocatoria.usuariomodificacion = null;
            objConvocatoria.fechamodificacion = null;

            for (let region of objConvocatoria.regiones) {
              region.usuariomodificacion = null;
              region.fechamodificacion = null;
            }

            for (let producto of objConvocatoria.productos) {
              producto.usuariomodificacion = null;
              producto.fechamodificacion = null;

              for (let requisito of producto.requisitos) {
                requisito.usuariomodificacion = null;
                requisito.fechamodificacion = null;
              }
            }

            // crear convocatoria - duplicar
            this.convocatoriaService.agregarActualizarConvocatoria$(objConvocatoria).subscribe(
              resp => {
                this.listarConvocatoria();
                Swal.fire({
                  title: 'Se duplicó correctamente',
                  confirmButtonColor: constante.color_alert.verde,
                  confirmButtonText: 'Aceptar',
                });
              }
            );

          }
        );
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

  agregarRequisito() {
    // this.listConvocatoriaProducto[this.filaProducto].requisitos = this.listaRequisitoSeleccionado;
    this.hideModal(2);
    // console.log(JSON.stringify(this.listConvocatoriaProducto));
  }

  agregarConvocatoria() {

    Swal.fire({
      title: '¿Está seguro que desea agregar la convocatoria?',
      text: 'Esta acción no se podrá recuperar!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: constante.color_alert.rojo,
      cancelButtonColor: constante.color_alert.plomo,
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // agregar convocatoria
        this.nuTipo = eTipoAccion.Insertar;
        let fecha = new Date();

        this.convocatoria = {
          usuariocreacion: this.objUsuario.usuario,
          fechacreacion: fecha,
          usuariomodificacion: this.nuTipo == eTipoAccion.Insertar ? null : this.objUsuario.usuario,
          fechamodificacion: this.nuTipo == eTipoAccion.Insertar ? null : fecha,
          estadoregistro: 1,
          idconvocatoria: this.nuTipo == eTipoAccion.Insertar ? 0 : 0,
          nombre: this.frmConvocatoria.value.nombre,
          descripcion: this.frmConvocatoria.value.descripcion,
          idrutapostulacion: 1,
          fechainicioinscripcion: this.frmConvocatoria.value.fechainicioinscripcion,
          fechafininscripcion: this.frmConvocatoria.value.fechafininscripcion,
          fechainicioevaluacion: this.frmConvocatoria.value.fechainicioevaluacion,
          fechafinevaluacion: this.frmConvocatoria.value.fechafinevaluacion,
          fechainicioconfirmacionep:
            this.frmConvocatoria.value.fechainicioconfirmacionep,
          fechafinconfirmacionep: this.frmConvocatoria.value.fechafinconfirmacionep,
          fechainicioconfirmacionorg:
            this.frmConvocatoria.value.fechainicioconfirmacionorg,
          fechafinconfirmacionorg:
            this.frmConvocatoria.value.fechafinconfirmacionorg,
          idestadoconvocatoria: 1, //cambiar por la del combo
          flagfinconvocatoria: true,
          regiones: [],
          productos: [],
        };

        //cargar regiones
        let usuario = this.objUsuario.usuario;
        let tipo = this.nuTipo;
        let regiones: any[] = [];
        this.frmConvocatoria.value.idregion.forEach(function (value) {
          let region = {
            usuariocreacion: usuario,
            fechacreacion: fecha,
            usuariomodificacion: tipo == 1 ? null : usuario,
            fechamodificacion: tipo == 1 ? null : fecha,
            estadoregistro: true,
            idregion: value,
          };
          regiones.push(region);
        });

        this.convocatoria.regiones = regiones;

        let productos = [];
        for (let n in this.listConvocatoriaProducto) {
          let objProducto = {
            usuariocreacion: this.objUsuario.usuario,
            fechacreacion: this.nuTipo == 1 ? fecha : fecha,
            usuariomodificacion: this.nuTipo == 1 ? null : this.objUsuario.usuario,
            fechamodificacion: this.nuTipo == 1 ? fecha : fecha,
            estadoregistro: true,
            idproducto: this.listConvocatoriaProducto[n].idproducto,
            idsector: this.listConvocatoriaProducto[n].idsector,
            idlineaproducto: this.listConvocatoriaProducto[n].idlineaproducto,
            requisitos: [],
          };
          let requisitoAux: RequisitoI[] = [];

          for (let requisito of this.listConvocatoriaProducto[n].requisitos) {
            let objRequisito: RequisitoI = {
              usuariocreacion: this.objUsuario.usuario,
              fechacreacion: this.nuTipo == eTipoAccion.Insertar ? fecha : fecha,
              usuariomodificacion: this.nuTipo == eTipoAccion.Insertar ? null : this.objUsuario.usuario,
              fechamodificacion: this.nuTipo == eTipoAccion.Insertar ? fecha : fecha,
              estadoregistro: true,
              idproducto: requisito.idproducto,
              idrequisito: requisito.idrequisito,
              nombre: requisito.nombre,
              descripcion: requisito.descripcion,
              // valor: 'valor',
              isChecked: true,
              tipovalor: '',
              listavalorkey: '',
              nombresector: '',
              nombrelineaproducto: '',
              idlineaproducto: 0,
              idsector: 0
            };
            requisitoAux.push(objRequisito);
          }

          // for (let x in this.listConvocatoriaProducto[n].requisitos) {
          //   let objRequisito = {
          //     usuariocreacion: this.objUsuario.usuario,
          //     fechacreacion: this.nuTipo == 1 ? fecha : fecha,
          //     usuariomodificacion:
          //       this.nuTipo == 1 ? null : this.objUsuario.usuario,
          //     fechamodificacion: this.nuTipo == 1 ? fecha : fecha,
          //     estadoregistro: true,
          //     idproducto: this.listConvocatoriaProducto[n].requisitos[x].idproducto,
          //     idrequisito:
          //       this.listConvocatoriaProducto[n].requisitos[x].idrequisito,
          //     nombre: this.listConvocatoriaProducto[n].requisitos[x].nombre,
          //     descripcion:
          //       this.listConvocatoriaProducto[n].requisitos[x].descripcion,
          //     valor: 'valor',
          //   };
          //   requisitoAux.push(objRequisito);
          // }
          objProducto.requisitos = requisitoAux;
          productos.push(objProducto);
        }
        this.convocatoria.productos = productos;

        console.log('objConvocatoria: ' + JSON.stringify(this.convocatoria));

        this.convocatoriaService.agregarActualizarConvocatoria$(this.convocatoria)
          .subscribe((resp) => {
            // console.log(JSON.stringify(resp.data));
            this.listarConvocatoria();
            this.cerrarModalAgregarConvocatoria();
          });
      }
    });
  }

  abrirModalNuevaConvocatoria() {
    this.frmProductoFiltro.reset();
    this.frmProductoFiltro.controls.idsector.setValue(0);
    this.frmProductoFiltro.controls.idlineaproducto.setValue(0);
    this.frmProductoFiltro.controls.idproducto.setValue(0);
    this.listConvocatoriaProducto = [];
    this.listaLineaProducto = [];
    this.listaProducto = [];
    //
    let config = {
      id: 1,
      backdrop: true,
      ignoreBackdropClick: false,
      class: 'modal-xl',
    };
    this.openModal(this._modal_nueva_convocatoria, config);
  }

  abrirModalEditarConvocatoria(idconvocatoria: number) {
    idconvocatoria = 30;
    this.nuTipo = eTipoAccion.Actualizar;
    // obtener detalle de la convocatoria
    this.convocatoriaService.obtenerDetalleConvocatoria$(idconvocatoria).subscribe(
      resp => {
        // let objConvocatoria: convocatoriaI = 
        this.objConvocatoria = resp.data;
        // console.log('objConvocatoria: ' + JSON.stringify(objConvocatoria));

        // asignar datos de convocatoria
        // datos de la convocatoria
        this.frmConvocatoria.controls.nombre.setValue(this.objConvocatoria.nombre);
        this.frmConvocatoria.controls.idestado.setValue(this.objConvocatoria.idestadoconvocatoria);
        this.frmConvocatoria.controls.descripcion.setValue(this.objConvocatoria.descripcion);
        this.frmConvocatoria.controls.fechainicioinscripcion.setValue(this.objConvocatoria.fechainicioinscripcion);
        this.frmConvocatoria.controls.fechafininscripcion.setValue(this.objConvocatoria.fechafininscripcion);
        this.frmConvocatoria.controls.fechainicioevaluacion.setValue(this.objConvocatoria.fechainicioevaluacion);
        this.frmConvocatoria.controls.fechafinevaluacion.setValue(this.objConvocatoria.fechafinevaluacion);
        this.frmConvocatoria.controls.fechainicioconfirmacionep.setValue(this.objConvocatoria.fechainicioconfirmacionep);
        this.frmConvocatoria.controls.fechafinconfirmacionep.setValue(this.objConvocatoria.fechafinconfirmacionep);
        this.frmConvocatoria.controls.fechainicioconfirmacionorg.setValue(this.objConvocatoria.fechainicioconfirmacionorg);
        this.frmConvocatoria.controls.fechafinconfirmacionorg.setValue(this.objConvocatoria.fechafinconfirmacionorg);
        // this.frmConvocatoria.controls.idregion.setValue(objConvocatoria.regiones);

        // datos de productos
        console.log('this.listaProducto: ' + JSON.stringify(this.listaProducto));
        // for (let producto of objConvocatoria.productos) {
        //   producto.nombreproducto = this.listaProducto.filter((e) => e.idproducto == producto.idproducto)[0].nombre;
        //   producto.nombresector = this.listaSector.filter((e) => e.idsector == producto.idsector)[0].nombre;
        //   producto.nombrelineaproducto = this.listaLineaProducto.filter((e) => e.idlineaproducto == producto.idlineaproducto)[0].nombre;
        // }

        this.listConvocatoriaProducto = this.objConvocatoria.productos;

        console.log('listConvocatoriaProducto: ' + JSON.stringify(this.listConvocatoriaProducto));

        // datos de requisitos
        // this.listaRequisito

        // abrir modal editar convocatoria
        this.modalEditarConvocatoria();
      }
    );
  }

  modalEditarConvocatoria() {
    let config = {
      id: 1,
      backdrop: true,
      ignoreBackdropClick: false,
      class: 'modal-xl',
    };
    this.openModal(this._modal_editar_convocatoria, config);
  }

  abrirModalRequisito(id: number, fila: number) {
    this.listaRequisitoSeleccionado = [];
    this.filaProducto = fila;
    let param = {
      nombre: null,
      idproducto: id,
    };
    this.requisitoService.listarRequisitoNP$(param).subscribe((resp) => {
      this.listaRequisito = resp.data;

      if (this.nuTipo == eTipoAccion.Actualizar) {
        this.seleccionarRequisitos(fila);
      }

      let config = {
        id: 2,
        backdrop: true,
        ignoreBackdropClick: false,
        class: 'modal-lg',
      };
      this.openModal(this._modal_agregar_requisito, config);
    });
  }

  seleccionarRequisitos(fila: number) {
    console.log('this.objConvocatoria.productos[fila].requisitos: ' + JSON.stringify(this.objConvocatoria.productos[fila].requisitos));
    // console.log('this.listaRequisito: ' + JSON.stringify(this.listaRequisito.));


    for (let requisito of this.objConvocatoria.productos[fila].requisitos) {
      for (let req of this.listaRequisito) {
        if (requisito.idrequisito == req.idrequisito) {
          req.isChecked = true;
          break;
        }
      }
      // this.listaRequisito[requisito.idrequisito].isChecked;
    }
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

  selecionRequisito(item: RequisitoI) {
    if (this.listaRequisitoSeleccionado.find((x) => x == item)) {
      this.listaRequisitoSeleccionado.splice(
        this.listaRequisitoSeleccionado.indexOf(item),
        1
      );
    } else {
      this.listaRequisitoSeleccionado.push(item);
    }
  }

  pageChanged(event: PageChangedEvent): void {
    this.pagina = event.page;
    this.listarConvocatoria();
  }
}
