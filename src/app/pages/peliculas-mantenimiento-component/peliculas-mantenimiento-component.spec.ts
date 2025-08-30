import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeliculasMantenimientoComponent } from './peliculas-mantenimiento-component';

describe('PeliculasMantenimientoComponent', () => {
  let component: PeliculasMantenimientoComponent;
  let fixture: ComponentFixture<PeliculasMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeliculasMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeliculasMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
