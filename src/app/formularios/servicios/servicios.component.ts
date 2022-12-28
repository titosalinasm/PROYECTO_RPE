import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { lineaProductoI } from 'src/app/interfaces/linea-producto-i';
import { NuevoServicioI } from 'src/app/interfaces/nuevo-servicio-i';
import { ParametroI } from 'src/app/interfaces/parameto-i';
import { productoI } from 'src/app/interfaces/producto-i';
import { RegionI } from 'src/app/interfaces/region-i';
import { SectorI } from 'src/app/interfaces/sector-i';
import { ServicioI } from 'src/app/interfaces/servicio-i';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { constante } from 'src/app/utilitarios/constantes';
import { eTipoAccion } from 'src/app/utilitarios/data.enums';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit {
  modalRef?: BsModalRef;
  @ViewChild('modal_nuevo_servicio') _modal_nuevo_servicio: TemplateRef<any>;
  objUsuario: any;
  nuTipo: number = eTipoAccion.Insertar;

  // Dummys
  idservicioDummy: number = 0;

  // maestros
  listaTipoServicio: ParametroI[] = [];
  listaRegion: RegionI[] = [];
  listaSector: SectorI[] = [];
  listaLineaProducto: lineaProductoI[] = [];
  listaProducto: productoI[] = [];
  listaEntidadPrestadora: any[] = []; // TODO: definir estructura de entidad-prestadora
  listaNroConvocatoria: any[] = []; // TODO: definir estructura de nro-convocatoria
  listaEvaluacionDeudaSancion: any[] = []; // TODO: definir estructura de evaluacion-deuda-sancion
  listaModalidad: any[] = []; // TODO: definir estructura de modalidad

  // lista principal
  listaServicio: ServicioI[] = [];

  // formularios
  frmNuevoServicio = this.formBuilder.group({
    identidadprestadora: [1, [Validators.required]],
    idconvocatoria: [1, [Validators.required]],
    idregion: [1, [Validators.required]],
    idsector: [1, [Validators.required]],
    idlineaproducto: [1, [Validators.required]],
    idproducto: [1, [Validators.required]],
    nombreservicio: ['servicio 2', [Validators.required]],
    idtiposervicio: [1, [Validators.required]],
    fechainicio: [new Date(), [Validators.required]],
    fechafin: [new Date(), [Validators.required]],
    idevaluacion: [1, [Validators.required]],
    descripcionservicio: ['descripcion 1', [Validators.required]],
    objetivoservicio: ['objectivo 1', [Validators.required]],
    nombrecapacitador: ['capacitador 1', [Validators.required]],
    idmodalidad: [1, [Validators.required]],
    numerototalsesiones: [10, [Validators.required]],
    numerototalhoras: [11, [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    this.cargarMaestros();
    if (this.usuarioService.getUsuario())
      this.objUsuario = JSON.parse(this.usuarioService.getUsuario());
  }

  cargarMaestros() {
    this.listaTipoServicio.push({
      idparametro: 1,
      nombre: 'tipo servicio 1',
      descripcion: '',
      idpadre: 0,
      parametrokey: ''
    });

    this.listaRegion.push({
      idregion: 1,
      nombre: 'region 1',
      descripcion: '',
      usuariocreacion: '',
      fechacreacion: new Date(),
      usuariomodificacion: '',
      fechamodificacion: new Date(),
      estadoregistro: true
    });

    this.listaSector.push({
      idsector: 1,
      nombre: 'sector 1',
      descripcion: '',
      usuariocreacion: '',
      fechacreacion: new Date(),
      usuariomodificacion: '',
      fechamodificacion: new Date(),
      estadoregistro: true
    });

    this.listaLineaProducto.push({
      idlineaproducto: 1,
      idsector: 1,
      nombre: 'linea producto 1',
      descripcion: '',
      usuariocreacion: '',
      fechacreacion: new Date(),
      usuariomodificacion: '',
      fechamodificacion: new Date(),
      estadoregistro: true
    });

    this.listaProducto.push({
      idproducto: 1,
      idlineaproducto: 1,
      nombre: 'producto 1',
      descripcion: '',
      idfichatpe: 1,
      usuariocreacion: '',
      fechacreacion: new Date(),
      usuariomodificacion: '',
      fechamodificacion: new Date(),
      estadoregistro: true
    });
  }

  buscarServicios() {
    this.listaServicio.push({
      idservicio: 0,
      nombreservicio: 'servicio 1',
      idtiposervicio: 1,
      nombretiposervicio: 'tipo servicio 1',
      idsector: 1,
      nombresector: 'sector 1',
      idproducto: 1,
      nombreproducto: 'producto 1',
      idestadoservicio: 1,
      nombreestadoservicio: 'estado servicio 1',
      flagenviarservicio: true,
      usuariocreacion: 'usuario 1',
      fechacreacion: new Date(),
      usuariomodificacion: null,
      fechamodificacion: new Date(),
      estadoregistro: true
    });
  }

  agregarServicio() {
    Swal.fire({
      title: '¿Está seguro que desea agregar el servicio?',
      text: 'Esta acción no se podrá recuperar!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: constante.color_alert.rojo,
      cancelButtonColor: constante.color_alert.plomo,
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // agregar servicio
        let objServicio: NuevoServicioI = {
          idservicio: this.idservicioDummy++,
          identidadprestadora: this.frmNuevoServicio.value.identidadprestadora,
          idconvocatoria: this.frmNuevoServicio.value.idconvocatoria,
          idsector: this.frmNuevoServicio.value.idsector,
          idlineaproducto: this.frmNuevoServicio.value.idlineaproducto,
          idproducto: this.frmNuevoServicio.value.idproducto,
          flagreqevaluaciondeuda: true,
          idtiposervicio: this.frmNuevoServicio.value.idtiposervicio,
          nombreservicio: this.frmNuevoServicio.value.nombreservicio,
          descripcionservicio: this.frmNuevoServicio.value.descripcionservicio,
          objetivoservicio: this.frmNuevoServicio.value.objetivoservicio,
          fechainicio: this.frmNuevoServicio.value.fechainicio,
          fechafin: this.frmNuevoServicio.value.fechafin,
          nombrecapacitador: this.frmNuevoServicio.value.nombrecapacitador,
          idmodalidad: this.frmNuevoServicio.value.idmodalidad,
          numerototalsesiones: this.frmNuevoServicio.value.numerototalsesiones,
          numerototalhoras: this.frmNuevoServicio.value.numerototalhoras,
          idestadoservicio: 1, //TODO: cambiar por dinamico
          usuariocreacion: this.objUsuario.usuario,
          fechacreacion: new Date(),
          usuariomodificacion: this.nuTipo == eTipoAccion.Insertar ? null : this.objUsuario.usuario,
          fechamodificacion: this.nuTipo == eTipoAccion.Insertar ? null : new Date(),
          estadoregistro: true
        };

        let objServicioLista: ServicioI = {
          idservicio: objServicio.idservicio,
          nombreservicio: objServicio.nombreservicio,
          idtiposervicio: objServicio.idtiposervicio,
          nombretiposervicio: this.listaTipoServicio.find((e) => e.idparametro == this.frmNuevoServicio.value.idtiposervicio).nombre,
          idsector: objServicio.idsector,
          nombresector: this.listaSector.find((e) => e.idsector == this.frmNuevoServicio.value.idsector).nombre,
          idproducto: objServicio.idproducto,
          nombreproducto: this.listaProducto.find((e) => e.idproducto == this.frmNuevoServicio.value.idproducto).nombre,
          idestadoservicio: objServicio.idestadoservicio,
          nombreestadoservicio: 'Estado 1', //TODO: falta origen
          flagenviarservicio: true,
          usuariocreacion: this.objUsuario.usuario,
          fechacreacion: new Date(),
          usuariomodificacion: this.nuTipo == eTipoAccion.Insertar ? null : this.objUsuario.usuario,
          fechamodificacion: this.nuTipo == eTipoAccion.Insertar ? null : new Date(),
          estadoregistro: true
        };

        this.listaServicio.push(objServicioLista);

        this.cerrarModalNuevoActualizarServicio();
      }
    });
  }

  eliminarServicio(fila: number) {
    Swal.fire({
      title: '¿Está seguro que desea eliminar el servicio?',
      text: 'Esta acción no se podrá recuperar!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: constante.color_alert.rojo,
      cancelButtonColor: constante.color_alert.plomo,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // eliminar servicio
        this.listaServicio.splice(fila, 1);
      }
    });

  }

  abrirModalNuevoActualizarServicio() {

    this.cargarMaestrosNuevoActualizar();

    let config = {
      id: 1,
      backdrop: true,
      ignoreBackdropClick: false,
      class: 'modal-lg',
    };
    this.openModal(this._modal_nuevo_servicio, config);
  }

  cargarMaestrosNuevoActualizar() {
    if (this.listaEntidadPrestadora.length == 0)
      this.listaEntidadPrestadora.push({
        identidadprestadora: 1,
        nombre: 'entidad prestadora 1'
      });

    if (this.listaNroConvocatoria.length == 0)
      this.listaNroConvocatoria.push({
        idnroconvocatoria: 1,
        nombre: '123456'
      }, {
        idnroconvocatoria: 2,
        nombre: '147258'
      });

    if (this.listaEvaluacionDeudaSancion.length == 0)
      this.listaEvaluacionDeudaSancion.push({
        id: 1,
        nombre: 'registro 1'
      });

    if (this.listaModalidad.length == 0)
      this.listaModalidad.push({
        id: 1,
        nombre: 'modalidad 1'
      });
  }

  cerrarModalNuevoActualizarServicio() {
    this.hideModal(1);
  }

  cambiarSector($event: any) {
    console.log('cambiar sector: ' + $event.target.value);

    this.listaLineaProducto = this.listaLineaProducto.filter((e) => e.idsector == $event.target.value);
  }

  cambiarLineaProducto($event: any) {
    this.listaProducto = this.listaProducto.filter((e) => e.idlineaproducto == $event.target.value);
  }

  // utilitarios
  openModal(template: TemplateRef<any>, config: any) {
    this.modalRef = this.modalService.show(template, config);
  }

  hideModal(id: number) {
    this.modalService.hide(id);
  }


}
