import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteleraComponente } from './cartelera-componente';

describe('CarteleraComponente', () => {
  let component: CarteleraComponente;
  let fixture: ComponentFixture<CarteleraComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteleraComponente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteleraComponente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
