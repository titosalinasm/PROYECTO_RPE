import { TestBed } from '@angular/core/testing';

import { SesionIniciadaGuard } from './sesion-iniciada.guard';

describe('SesionIniciadaGuard', () => {
  let guard: SesionIniciadaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SesionIniciadaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
