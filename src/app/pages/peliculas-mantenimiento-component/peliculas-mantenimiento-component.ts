import {Component, computed, inject, signal} from '@angular/core';
import {CarteleraService, Pelicula} from "../../services/cartelera/cartelera-service";
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {finalize} from 'rxjs';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-peliculas-mantenimiento-component',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './peliculas-mantenimiento-component.html',
  styleUrl: './peliculas-mantenimiento-component.scss'
})
export class PeliculasMantenimientoComponent {

  private srv = inject(CarteleraService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  cargando = signal<boolean>(true);
  guardando = signal<boolean>(false);
  error = signal<string | null>(null);
  peliculas = signal<Pelicula[]>([]);
  editandoId = signal<string | null>(null);
  modoNuevo = signal<boolean>(false);
  mostrarModal = signal<boolean>(false);

  form = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(2)]],
    id: ['', [Validators.required, Validators.minLength(2)]],
    year: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('[0-9]{4}')]],
    tipo: ['', [Validators.required, Validators.minLength(2)]],
    poster: ['', [Validators.required, Validators.minLength(2)]],
    estado: ['', [Validators.required, Validators.minLength(1)]],
    descripcion: ['', [Validators.required, Validators.minLength(2)]],
    ubicacion: ['', [Validators.required, Validators.minLength(2)]],
  });

  tituloForm = computed(() =>
    this.modoNuevo() ? 'Agregar nueva película' :
      this.editandoId() ? 'Editar película' : 'Agregar/Editar'
  );

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.error.set(null);
    this.srv.getCartelera().pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: data => this.peliculas.set(data),
        error: err => this.error.set(err?.message ?? 'Error al cargar películas')
      });
  }

  abrirNuevo() {
    this.modoNuevo.set(true);
    this.editandoId.set(null);
    this.form.reset();
    this.mostrarModal.set(true);
  }

  abrirEditar(p: Pelicula) {
    this.modoNuevo.set(false);
    this.editandoId.set(p.id ? String(p.id) : null);
    this.form.reset({
      id: p.id ?? '',
      titulo: p.titulo ?? '',
      year: p.year ?? '',
      tipo: p.tipo ?? '',
      poster: p.poster ?? '',
      estado: p.estado != null ? String(p.estado) : '',
      descripcion: p.descripcion ?? '',
      ubicacion: p.ubicacion ?? '',
    });
    this.mostrarModal.set(true);
  }

  cancelarEdicion() {
    this.modoNuevo.set(false);
    this.editandoId.set(null);
    this.form.reset();
    this.mostrarModal.set(false);
  }

  ver(p: Pelicula) {
    const id = p.id ? String(p.id) : '';
    this.router.navigate(['/peliculas', id], { state: { pelicula: p } });
  }

  eliminar(p: Pelicula) {
    const id = p.id ? String(p.id) : '';
    if (!id) return;
    const ok = confirm(`¿Eliminar la película "${p.titulo}"?`);
    if (!ok) return;
    this.guardando.set(true);
    this.srv.deletePelicula(id).pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: () => this.cargar(),
        error: err => this.error.set(err?.message ?? 'Error al eliminar')
      });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const estadoBool: boolean | undefined =
      raw.estado === '' || raw.estado == null
        ? undefined
        : typeof raw.estado === 'boolean'
          ? raw.estado
          : ['true', '1', 'si', 'sí', 'activo', 'activa'].includes(
            String(raw.estado).trim().toLowerCase()
          );

    const bodyApi: any = {
      imdbID: raw.id,                         // requerido por el ejemplo
      Title: raw.titulo,
      Year: raw.year,
      Type: raw.tipo,
      Poster: raw.poster,
      Estado: estadoBool ?? false,            // boolean
      description: raw.descripcion,
      Ubication: raw.ubicacion,
    };

    this.guardando.set(true);
    const id = this.editandoId();

    // Para crear, enviamos el body mapeado con las llaves del backend
    const obs = id
      ? this.srv.updatePelicula(id, bodyApi)  // si tu API de update también espera estas llaves
      : this.srv.createPelicula(bodyApi);

    obs.pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: () => {
          this.cancelarEdicion();
          this.cargar();
        },
        error: err => this.error.set(err?.message ?? 'Error al guardar')
      });

  }

  posterDe(p: Pelicula): string {
    return p.poster && String(p.poster).length > 4
      ? String(p.poster)
      : 'assets/vuexy/app-assets/images/portrait/small/avatar-s-1.jpg';
  }

}
