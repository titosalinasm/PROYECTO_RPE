import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntidadPrestadoraComponent } from './entidad-prestadora.component';

describe('EntidadPrestadoraComponent', () => {
  let component: EntidadPrestadoraComponent;
  let fixture: ComponentFixture<EntidadPrestadoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntidadPrestadoraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntidadPrestadoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
