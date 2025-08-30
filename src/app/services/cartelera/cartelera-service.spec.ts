import { TestBed } from '@angular/core/testing';

import { CarteleraService } from './cartelera-service';

describe('CarteleraService', () => {
  let service: CarteleraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarteleraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
