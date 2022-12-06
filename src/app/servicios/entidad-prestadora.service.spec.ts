import { TestBed } from '@angular/core/testing';

import { EntidadPrestadoraService } from './entidad-prestadora.service';

describe('EntidadPrestadoraService', () => {
  let service: EntidadPrestadoraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntidadPrestadoraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
