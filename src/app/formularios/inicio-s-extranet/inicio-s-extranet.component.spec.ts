import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioSExtranetComponent } from './inicio-s-extranet.component';

describe('InicioSExtranetComponent', () => {
  let component: InicioSExtranetComponent;
  let fixture: ComponentFixture<InicioSExtranetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InicioSExtranetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioSExtranetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
