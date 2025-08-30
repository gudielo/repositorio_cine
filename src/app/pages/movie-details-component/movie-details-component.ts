import {Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

type Pelicula = {
  id: string;
  titulo?: string;
  descripcion?: string;
  genero?: string;
  calificacion?: number | string;
  fechaEstreno?: string | Date;
  poster?: string;
  duracionMinutos?: number;
  director?: string;
  reparto?: string[];
};

@Component({
  selector: 'app-movie-details-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details-component.html',
  styleUrl: './movie-details-component.scss'
})
export class MovieDetailsComponent {

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Intentamos obtener la película desde el estado de navegación
  private statePelicula = (history?.state?.pelicula ?? null) as Pelicula | null;

  id = signal<number | null>(null);
  pelicula = signal<Pelicula | null>(this.statePelicula);

  titulo = computed(() => this.pelicula()?.titulo ?? `Película #${this.id() ?? ''}`);

  ngOnInit(): void {
    const idParam = Number(this.route.snapshot.paramMap.get('id'));
    this.id.set(Number.isFinite(idParam) ? idParam : null);

    // Si no vino en el state, podrías aquí cargarla desde un servicio si lo prefieres.
    // Por ahora, si no hay datos, mostramos un mensaje y opción de volver.
  }

  volver(): void {
    this.router.navigate(['/']);
  }

  posterDe(p: Pelicula | null): string {
    return p?.poster && String(p.poster).length > 4
      ? String(p.poster)
      : 'assets/vuexy/app-assets/images/portrait/small/avatar-s-1.jpg';
  }

}
