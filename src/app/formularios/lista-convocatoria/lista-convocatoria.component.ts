import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { maestroFilterI } from 'src/app/interfaces/maestro-filter';
import { RegionI } from 'src/app/interfaces/region-i';
import { SectorI } from 'src/app/interfaces/sector-i';
import { LineaProductoService } from 'src/app/servicios/linea-producto.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { RegionService } from 'src/app/servicios/region.service';
import { SectorService } from 'src/app/servicios/sector.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-lista-convocatoria',
  templateUrl: './lista-convocatoria.component.html',
  styleUrls: ['./lista-convocatoria.component.css'],
})
export class ListaConvocatoriaComponent implements OnInit {
  modalRef?: BsModalRef;
  @ViewChild('modal_nueva_convocatoria') _modal_nueva_convocatoria: TemplateRef<any>;

  @ViewChild('modal_agregar_requisito') _modal_agregar_requisito: TemplateRef<any>;


  frmConvocatoria = this.formBuilder.group({

  });

  listaSector : SectorI[]=[];
  listaRegion : RegionI[]=[];

  constructor(private modalService: BsModalService,
    private usuarioService: UsuarioService,
    private sectorService: SectorService,
    private lineaProductoService: LineaProductoService,
    private regionService: RegionService,
    private productoService: ProductoService,
    private formBuilder: FormBuilder,
    ) {}

  ngOnInit(): void {
    this.cargarMaestros();
  }
  bindEventsForm() {
  this.frmConvocatoria.get('idsector').valueChanges.subscribe((value) => {
    let param = {
      idsector: value,
      pageNumber: 1,
      pageSize: 100,
    };

    this.lineaProductoService
      .listarLineaProducto$(param)
      .subscribe((resp) => {

      });
  });
}

  abrirModalNuevaConvocatoria(){
    let config = {
      backdrop: true,
      ignoreBackdropClick: false,
      class: 'modal-xl'
    };
    this.openModal(this._modal_nueva_convocatoria, config)
  }

  abrirModalRequisito(id : number){

    let config = {
      backdrop: true,
      ignoreBackdropClick: false,
      class: 'modal-lg'
    };
    this.openModal(this._modal_agregar_requisito, config)
  }

  openModal(template: TemplateRef<any>, config: any) {
    this.modalRef = this.modalService.show(template, config);
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
}
