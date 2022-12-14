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
  nuTipo: number = 1;

  objUsuario: any;

  constructor(
    private organizacionRpeService: OrganizacionRpeService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.objUsuario = JSON.parse(this.usuarioService.getUsuario() + '');
  }

  crearActualizarOrganizacionPrestadora() {
    this.spinner.show();
    this.objOrganizacionRPE = {
      idorganizacionrpe:
        this.nuTipo == 1
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
      usuariomodificacion: this.nuTipo == 1 ? null : this.objUsuario.usuario,
      fechamodificacion: this.nuTipo == 1 ? null : new Date(),
      estadoregistro: true,
    };
    this.organizacionRpeService
      .agregarActualizarEntidad$(this.objOrganizacionRPE)
      .subscribe((resp) => {
        if(this.nuTipo==1){
        this.listaOrganizacionRPE.push(resp.data);
        Swal.fire({
          text: 'La organización se agregó correctamente',
          confirmButtonColor: 'LightSeaGreen',
        });

        }else{
          this.listaOrganizacionRPE[this.filaRegistroActualizar]=resp.data;


          Swal.fire({
            text: 'La organización se actualizó correctamente',
            confirmButtonColor: 'LightSeaGreen',
          });
        }
        this.hideModal(1);
        this.spinner.hide();


      });
  }

  abrirModaCrearOrganizacionRPE() {
    this.frmOrganizacionRPE.reset();
    let objEntidad = {
      id: 1,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-xl',
    };
    this.openModal(this._modal_nuevo_org_rpe, objEntidad);
  }

  abrirModaActualizarOrganizacionRPE(item: OrganizacioRPE, fila: number) {

    this.nuTipo=2;
    this.filaRegistroActualizar=fila;
    this.objOrganizacionRPEActualizar=item;
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
      class: 'modal-xl',
    };
    this.openModal(this._modal_nuevo_org_rpe, objEntidad);
  }

  listarOrganizacionRPE() {
    this.spinner.show();
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
        this.spinner.hide();
      });
  }

  eliminarOrganizacionRPE(fila: number, id: number){
    this.spinner.show();
    this.organizacionRpeService.eliminarOrgRPE$(id).subscribe(resp=>{
      this.spinner.hide();
      this.listaOrganizacionRPE.splice(fila, 1);
      Swal.fire({
        text: 'La organización se elimnó correctamente.',
        confirmButtonColor: 'LightSeaGreen',
      });
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
