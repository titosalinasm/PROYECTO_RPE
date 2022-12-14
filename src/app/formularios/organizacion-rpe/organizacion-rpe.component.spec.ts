import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizacionRpeComponent } from './organizacion-rpe.component';

describe('OrganizacionRpeComponent', () => {
  let component: OrganizacionRpeComponent;
  let fixture: ComponentFixture<OrganizacionRpeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizacionRpeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizacionRpeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
