import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaConvocatoriaComponent } from './lista-convocatoria.component';

describe('ListaConvocatoriaComponent', () => {
  let component: ListaConvocatoriaComponent;
  let fixture: ComponentFixture<ListaConvocatoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaConvocatoriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaConvocatoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
