import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { forkJoin } from 'rxjs';
import { convocatoriaI } from 'src/app/interfaces/convocatoria-i';
import { convocatoriaProductoI } from 'src/app/interfaces/convocatoria-producto-i';
import { convocatoriaProductoRequisitoI } from 'src/app/interfaces/convocatoria-producto-requisito-I';
import { convocatoriaRegionI } from 'src/app/interfaces/convocatoria-region-i';
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

  // convocatoria: convocatoriaI;
  nuTipo: number = eTipoAccion.Insertar; // 1;

  pagina: number = 1;
  tamanioPagina: number = constante.paginacion.tamanioPagina;
  totalItems: number;

  objConvocatoria: convocatoriaI;

  //
  idconvocatoria: number;
  idconvocatoriaDummy: number = 0;
  listaRequisitoDummy: RequisitoI[] = [{
    idrequisito: 1,
    nombre: 'requisito 1',
    descripcion: '',
    idproducto: 1,
    tipovalor: '',
    listavalorkey: '',
    nombresector: 'sector 1',
    nombrelineaproducto: 'linea 1',
    usuariocreacion: '',
    fechacreacion: new Date(),
    usuariomodificacion: null,
    fechamodificacion: null,
    estadoregistro: true,
    idlineaproducto: 1,
    idsector: 1,
    isChecked: false
  },
  {
    idrequisito: 2,
    nombre: 'requisito 2',
    descripcion: '',
    idproducto: 2,
    tipovalor: '',
    listavalorkey: '',
    nombresector: 'sector 1',
    nombrelineaproducto: 'linea 1',
    usuariocreacion: '',
    fechacreacion: new Date(),
    usuariomodificacion: null,
    fechamodificacion: null,
    estadoregistro: true,
    idlineaproducto: 1,
    idsector: 1,
    isChecked: false
  }];
  lstConvocatoriaDummy: convocatoriaI[] = [];
  listaRegionDummy: RegionI[] = [{
    idregion: 1,
    nombre: 'region 1',
    descripcion: '',
    usuariocreacion: '',
    fechacreacion: null,
    usuariomodificacion: null,
    fechamodificacion: null,
    estadoregistro: true
  },
  {
    idregion: 2,
    nombre: 'region 2',
    descripcion: '',
    usuariocreacion: '',
    fechacreacion: null,
    usuariomodificacion: null,
    fechamodificacion: null,
    estadoregistro: true
  }];
  listaSectorDummy: SectorI[] = [{
    idsector: 1,
    nombre: 'Sector 1',
    descripcion: '',
    usuariocreacion: '',
    fechacreacion: null,
    usuariomodificacion: null,
    fechamodificacion: null,
    estadoregistro: true
  }];
  listaLineaProductoDummy: lineaProductoI[] = [{
    idlineaproducto: 1,
    idsector: 1,
    nombre: 'linea prducto 1',
    descripcion: '',
    usuariocreacion: '',
    fechacreacion: null,
    usuariomodificacion: null,
    fechamodificacion: null,
    estadoregistro: true
  }];
  listaProductoDummy: productoI[] = [{
    idproducto: 1,
    idlineaproducto: 1,
    nombre: 'producto 1',
    descripcion: '',
    idfichatpe: 11,
    usuariocreacion: null,
    fechacreacion: null,
    usuariomodificacion: null,
    fechamodificacion: null,
    estadoregistro: true
  },
  {
    idproducto: 2,
    idlineaproducto: 1,
    nombre: 'producto 2',
    descripcion: '',
    idfichatpe: 12,
    usuariocreacion: null,
    fechacreacion: null,
    usuariomodificacion: null,
    fechamodificacion: null,
    estadoregistro: true
  }];

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
  ) {

    this.lstConvocatoriaDummy = [
      {
        idconvocatoria: 30,
        nombre: 'convocatoria 14',
        descripcion: 'descripcion 14',
        idrutapostulacionl: 1,
        fechainicioinscripcion: new Date(),
        fechafininscripcion: new Date(),
        fechainicioevaluacion: new Date(),
        fechafinevaluacion: new Date(),
        fechainicioconfirmacionep: new Date(),
        fechafinconfirmacionep: new Date(),
        fechainicioconfirmacionorg: new Date(),
        fechafinconfirmacionorg: new Date(),
        idestadoconvocatoria: 13,
        flagfinconvocatoria: true,
        regiones: [
          {
            idregion: 2,
            usuariocreacion: 'tsalinas',
            fechacreacion: new Date(),
            usuariomodificacion: null,
            fechamodificacion: null,
            estadoregistro: true
          },
          {
            idregion: 4,
            usuariocreacion: 'tsalinas',
            fechacreacion: new Date(),
            usuariomodificacion: null,
            fechamodificacion: null,
            estadoregistro: true
          }
        ],
        productos: [
          {
            idproducto: 7,
            nombreproducto: '',
            idsector: 1,
            nombresector: '',
            idlineaproducto: 2,
            nombrelineaproducto: '',
            usuariocreacion: 'tsalinas',
            fechacreacion: new Date(),
            usuariomodificacion: null,
            fechamodificacion: null,
            estadoregistro: true,
            requisitos: [
              {
                idproducto: 7,
                idrequisito: 1,
                nombre: 'Requisito 1',
                descripcion: null,
                valor: null,
                usuariocreacion: 'tsalinas',
                fechacreacion: new Date(),
                usuariomodificacion: null,
                fechamodificacion: null,
                estadoregistro: true
              },
              {
                idproducto: 7,
                idrequisito: 2,
                nombre: 'Requisito 2',
                descripcion: null,
                valor: null,
                usuariocreacion: 'tsalinas',
                fechacreacion: new Date(),
                usuariomodificacion: null,
                fechamodificacion: null,
                estadoregistro: true
              },
              {
                idproducto: 7,
                idrequisito: 12,
                nombre: 'REQUISITO',
                descripcion: 'DES REQUISITO',
                valor: null,
                usuariocreacion: 'tsalinas',
                fechacreacion: new Date(),
                usuariomodificacion: null,
                fechamodificacion: null,
                estadoregistro: true,
              }
            ]
          }
        ],
        usuariocreacion: 'tsalinas',
        fechacreacion: new Date(),
        usuariomodificacion: null,
        fechamodificacion: null,
        estadoregistro: true
      }
    ];

  }

  ngOnInit(): void {
    this.cargarMaestros();
    // this.bindEventsForm();
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
    return;
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

    Swal.fire({
      title: '¿Está seguro que desea agregar el producto?',
      text: 'Esta acción no se podrá recuperar!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: constante.color_alert.rojo,
      cancelButtonColor: constante.color_alert.plomo,
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // agregar producto
        let objProducto: convocatoriaProductoI = {
          usuariocreacion: this.objUsuario.usuario,
          fechacreacion: new Date(),
          usuariomodificacion: this.nuTipo == eTipoAccion.Insertar ? null : this.objUsuario.usuario,
          fechamodificacion: this.nuTipo == eTipoAccion.Insertar ? new Date() : null,
          estadoregistro: true,
          idproducto: this.frmProductoFiltro.value.idproducto,
          nombreproducto: this.listaProductoDummy.find((e) => e.idproducto == this.frmProductoFiltro.value.idproducto).nombre,
          idsector: this.frmProductoFiltro.value.idsector,
          nombresector: this.listaSectorDummy.find((e) => e.idsector == this.frmProductoFiltro.value.idsector).nombre,
          idlineaproducto: this.frmProductoFiltro.value.idlineaproducto,
          nombrelineaproducto: this.listaLineaProductoDummy.find((e) => e.idlineaproducto == this.frmProductoFiltro.value.idlineaproducto).nombre,
          requisitos: [],
        };
        this.listConvocatoriaProducto.push(objProducto);

        // limpiar formulario de producto
        this.frmProductoFiltro.reset();
        this.frmProductoFiltro.controls.idsector.setValue(0);
        this.frmProductoFiltro.controls.idlineaproducto.setValue(0);
        this.frmProductoFiltro.controls.idproducto.setValue(0);
        this.listaLineaProducto = [];
        this.listaProducto = [];
      }
    });



    // return;
    // let objProducto: convocatoriaProductoI = {
    //   usuariocreacion: this.objUsuario.usuario,
    //   fechacreacion: new Date(),
    //   usuariomodificacion: this.objUsuario.usuario,
    //   fechamodificacion: new Date(),
    //   estadoregistro: true,
    //   idproducto: this.frmProductoFiltro.value.idproducto,
    //   nombreproducto: this.listaProducto.filter(
    //     (e) => e.idproducto == this.frmProductoFiltro.value.idproducto
    //   )[0].nombre,
    //   idsector: this.frmProductoFiltro.value.idsector,
    //   nombresector: this.listaSector.filter(
    //     (e) => e.idsector == this.frmProductoFiltro.value.idsector
    //   )[0].nombre,
    //   idlineaproducto: this.frmProductoFiltro.value.idlineaproducto,
    //   nombrelineaproducto: this.listaLineaProducto.filter(
    //     (e) => e.idlineaproducto == this.frmProductoFiltro.value.idlineaproducto
    //   )[0].nombre,
    //   requisitos: [],
    // };
    // this.listConvocatoriaProducto.push(objProducto);
  }

  agregarRequisito() {
    console.log('this.nuTipo: ' + this.nuTipo);

    // if (this.nuTipo == eTipoAccion.Insertar) {

    let lstSeleccionados: convocatoriaProductoRequisitoI[] = [];

    for (let requisito of this.listaRequisito) {

      console.log('requisito: ' + JSON.stringify(requisito));

      if (requisito.isChecked) {
        let obj: convocatoriaProductoRequisitoI = {
          usuariocreacion: 'usuario 1',
          fechacreacion: new Date(),
          usuariomodificacion: null,
          fechamodificacion: null,
          estadoregistro: true,
          idproducto: requisito.idproducto,
          idrequisito: requisito.idrequisito,
          nombre: requisito.nombre,
          descripcion: '',
          valor: ''
        }
        lstSeleccionados.push(obj);
        // this.listConvocatoriaProducto[this.filaProducto].requisitos.push(obj);
      } /*else {
          var index = this.listConvocatoriaProducto[this.filaProducto].requisitos.findIndex(e => e.idrequisito === requisito.idrequisito);
          console.log('eliminar >> index: ' + index);

          if (index != -1)
            this.listConvocatoriaProducto[this.filaProducto].requisitos.splice(index, 1);
        }*/
    }

    this.listConvocatoriaProducto[this.filaProducto].requisitos = lstSeleccionados;


    // }

    // this.listConvocatoriaProducto[this.filaProducto].requisitos = this.listaRequisitoSeleccionado;
    this.hideModal(2);
    console.log('listConvocatoriaProducto: ' + JSON.stringify(this.listConvocatoriaProducto));
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

        let convocatoria: convocatoriaI = {
          usuariocreacion: this.objUsuario.usuario,
          fechacreacion: fecha,
          usuariomodificacion: this.nuTipo == eTipoAccion.Insertar ? null : this.objUsuario.usuario,
          fechamodificacion: this.nuTipo == eTipoAccion.Insertar ? null : fecha,
          estadoregistro: true,
          idconvocatoria: this.nuTipo == eTipoAccion.Insertar ? this.idconvocatoriaDummy++ : 0,
          nombre: this.frmConvocatoria.value.nombre,
          descripcion: this.frmConvocatoria.value.descripcion,
          // idrutapostulacion: 1,
          idrutapostulacionl: 1,
          fechainicioinscripcion: this.frmConvocatoria.value.fechainicioinscripcion,
          fechafininscripcion: this.frmConvocatoria.value.fechafininscripcion,
          fechainicioevaluacion: this.frmConvocatoria.value.fechainicioevaluacion,
          fechafinevaluacion: this.frmConvocatoria.value.fechafinevaluacion,
          fechainicioconfirmacionep: this.frmConvocatoria.value.fechainicioconfirmacionep,
          fechafinconfirmacionep: this.frmConvocatoria.value.fechafinconfirmacionep,
          fechainicioconfirmacionorg: this.frmConvocatoria.value.fechainicioconfirmacionorg,
          fechafinconfirmacionorg: this.frmConvocatoria.value.fechafinconfirmacionorg,
          idestadoconvocatoria: this.frmConvocatoria.value.idestado, //cambiar por la del combo
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
            usuariomodificacion: tipo == eTipoAccion.Insertar ? null : usuario,
            fechamodificacion: tipo == eTipoAccion.Insertar ? null : fecha,
            estadoregistro: true,
            idregion: value,
          };
          regiones.push(region);
        });

        convocatoria.regiones = regiones;
        convocatoria.productos = this.listConvocatoriaProducto;

        /*
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
        */
        // console.log('objConvocatoria: ' + JSON.stringify(this.convocatoria));

        this.lstConvocatoriaDummy.push(convocatoria);
        this.cerrarModalAgregarConvocatoria();
        return;

        this.convocatoriaService.agregarActualizarConvocatoria$(convocatoria)
          .subscribe((resp) => {
            // console.log(JSON.stringify(resp.data));
            this.listarConvocatoria();
            this.cerrarModalAgregarConvocatoria();
          });
      }
    });
  }

  modificarConvocatoria() {
    Swal.fire({
      title: '¿Está seguro que desea actualizar la convocatoria?',
      text: 'Esta acción no se podrá recuperar!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: constante.color_alert.rojo,
      cancelButtonColor: constante.color_alert.plomo,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // actualizar convocatoria
        let updateItem: convocatoriaI = this.lstConvocatoriaDummy.find((e) => e.idconvocatoria == this.idconvocatoria);
        let index = this.lstConvocatoriaDummy.indexOf(updateItem);

        let convocatoria: convocatoriaI = {
          usuariocreacion: this.objUsuario.usuario,
          fechacreacion: new Date(),
          usuariomodificacion: this.nuTipo == eTipoAccion.Insertar ? null : this.objUsuario.usuario,
          fechamodificacion: this.nuTipo == eTipoAccion.Insertar ? null : new Date(),
          estadoregistro: true,
          idconvocatoria: this.objConvocatoria.idconvocatoria,
          nombre: this.frmConvocatoria.value.nombre,
          descripcion: this.frmConvocatoria.value.descripcion,
          idrutapostulacionl: 1,
          fechainicioinscripcion: this.frmConvocatoria.value.fechainicioinscripcion,
          fechafininscripcion: this.frmConvocatoria.value.fechafininscripcion,
          fechainicioevaluacion: this.frmConvocatoria.value.fechainicioevaluacion,
          fechafinevaluacion: this.frmConvocatoria.value.fechafinevaluacion,
          fechainicioconfirmacionep: this.frmConvocatoria.value.fechainicioconfirmacionep,
          fechafinconfirmacionep: this.frmConvocatoria.value.fechafinconfirmacionep,
          fechainicioconfirmacionorg: this.frmConvocatoria.value.fechainicioconfirmacionorg,
          fechafinconfirmacionorg: this.frmConvocatoria.value.fechafinconfirmacionorg,
          idestadoconvocatoria: this.frmConvocatoria.value.idestado, //cambiar por la del combo
          flagfinconvocatoria: true,
          regiones: [],
          productos: [],
        };

        let regiones: convocatoriaRegionI[] = [];
        for (let idregion of this.frmConvocatoria.value.idregion) {
          let objRegion: convocatoriaRegionI = {
            usuariocreacion: this.objUsuario.usuario,
            fechacreacion: new Date(),
            usuariomodificacion: this.objUsuario.usuario,
            fechamodificacion: new Date(),
            estadoregistro: true,
            idregion: idregion
          };
          regiones.push(objRegion);
        }

        convocatoria.regiones = regiones;
        convocatoria.productos = this.listConvocatoriaProducto;
        this.lstConvocatoriaDummy[index] = convocatoria;

        this.cerrarModalAgregarConvocatoria();
        this.nuTipo = eTipoAccion.Insertar;
        return;

        this.convocatoriaService.agregarActualizarConvocatoria$(convocatoria)
          .subscribe((resp) => {
            // console.log(JSON.stringify(resp.data));
            this.listarConvocatoria();
            this.cerrarModalAgregarConvocatoria();
          });
      }
    });
  }

  eliminarConvocatoria(fila: number) {
    Swal.fire({
      title: '¿Está seguro que desea eliminar la convocatoria?',
      text: 'Esta acción no se podrá recuperar!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: constante.color_alert.rojo,
      cancelButtonColor: constante.color_alert.plomo,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // eliminar convocatoria
        this.lstConvocatoriaDummy.splice(fila, 1);
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
    this.idconvocatoria = idconvocatoria;

    console.log('idconvocatoria: ' + idconvocatoria);


    this.nuTipo = eTipoAccion.Actualizar;

    this.objConvocatoria = this.lstConvocatoriaDummy.find((e) => e.idconvocatoria == idconvocatoria);
    console.log('objConvocatoria: ' + JSON.stringify(this.objConvocatoria));

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

    this.listConvocatoriaProducto = this.objConvocatoria.productos;

    this.modalEditarConvocatoria();

    return;
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

  eliminarProducto(fila: number) {
    Swal.fire({
      title: '¿Está seguro que desea eliminar el producto?',
      text: 'Esta acción no se podrá recuperar!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: constante.color_alert.rojo,
      cancelButtonColor: constante.color_alert.plomo,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // eliminar producto
        this.listConvocatoriaProducto.splice(fila, 1);
      }
    });

  }

  abrirModalRequisito(id: number, fila: number) {



    this.filaProducto = fila;
    console.log('filaProducto: ' + this.filaProducto);

    this.listaRequisito = this.listaRequisitoDummy;

    // seleccionar registros si existen
    this.seleccionarRequisitos(fila);

    let config = {
      id: 2,
      backdrop: true,
      ignoreBackdropClick: false,
      class: 'modal-lg',
    };
    this.openModal(this._modal_agregar_requisito, config);
    //
    // this.listaRequisitoSeleccionado = [];

    // let param = {
    //   nombre: null,
    //   idproducto: id,
    // };
    // this.requisitoService.listarRequisitoNP$(param).subscribe((resp) => {
    //   this.listaRequisito = resp.data;

    //   if (this.nuTipo == eTipoAccion.Actualizar) {
    //     this.seleccionarRequisitos(fila);
    //   }

    //   let config = {
    //     id: 2,
    //     backdrop: true,
    //     ignoreBackdropClick: false,
    //     class: 'modal-lg',
    //   };
    //   this.openModal(this._modal_agregar_requisito, config);
    // });
  }

  seleccionarRequisitos(fila: number) {
    this.borrarSeleccionaPrevia();
    // if (this.nuTipo == eTipoAccion.Insertar) {
    console.log('listaRequisitoDummy >> antes: ' + JSON.stringify(this.listaRequisito));
    for (let requisito of this.listConvocatoriaProducto[fila].requisitos) {
      console.log('requisito seleccionado: ' + JSON.stringify(requisito));

      this.listaRequisito.find((e) => e.idrequisito == requisito.idrequisito).isChecked = true;
      // for (let req of this.listaRequisito) {
      //   if (requisito.idrequisito == req.idrequisito) {
      //     req.isChecked = true;
      //     break;
      //   }
      // }
    }
    console.log('listaRequisitoDummy >> despues: ' + JSON.stringify(this.listaRequisito));
    // }

    // console.log('this.objConvocatoria.productos[fila].requisitos: ' + JSON.stringify(this.objConvocatoria.productos[fila].requisitos));

    // for (let requisito of this.objConvocatoria.productos[fila].requisitos) {
    //   for (let req of this.listaRequisito) {
    //     if (requisito.idrequisito == req.idrequisito) {
    //       req.isChecked = true;
    //       break;
    //     }
    //   }
    // }
  }

  borrarSeleccionaPrevia() {
    for (let requisito of this.listaRequisitoDummy) {
      requisito.isChecked = false;
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

    this.listaSector = this.listaSectorDummy;
    this.listaRegion = this.listaRegionDummy;

    // const objFiltro: maestroFilterI = {
    //   nombre: null,
    //   descripcion: null,
    //   pageNumber: 1,
    //   pageSize: 100,
    // };
    // forkJoin([
    //   this.sectorService.listarSector$(objFiltro),
    //   this.regionService.listarRegion$(objFiltro),
    // ]).subscribe((resp) => {
    //   this.listaSector = resp[0].data.lista;
    //   this.listaRegion = resp[1].data.lista;
    // });
  }

  cambiarSector(sector: any) {
    console.log('cambiar sector: ' + sector.target.value);

    this.listaLineaProducto = this.listaLineaProductoDummy.filter((e) => e.idsector == sector.target.value);
  }

  cambiarLineaProducto(lineaProdcuto: any) {
    this.listaProducto = this.listaProductoDummy.filter((e) => e.idlineaproducto == lineaProdcuto.target.value);
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
