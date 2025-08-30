import {Component, inject, signal} from '@angular/core';
import {CarteleraService, Pelicula} from '../../services/cartelera/cartelera-service';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cartelera-componente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cartelera-componente.html',
  styleUrl: './cartelera-componente.scss'
})
export class CarteleraComponente {

  private srv = inject(CarteleraService);
  private router = inject(Router);

  cargando = signal(true);
  error = signal<string | null>(null);
  peliculas = signal<Pelicula[]>([]);

  ngOnInit() {
    this.srv.getCartelera().subscribe({
      next: (data) => {
        this.peliculas.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.cargando.set(false);
      }
    })
  }

  posterDe(p: Pelicula): string {
    return p.poster && String(p.poster).length > 4
      ? String(p.poster)
      : 'assets/vuexy/app-assets/images/portrait/small/avatar-s-1.jpg'; // placeholder de Vuexy
  }

  verDetalles(pelicula: Pelicula) {
    const id = pelicula.id != null ? String(pelicula.id) : '';
    this.router.navigate(['/peliculas', id], {
      state: { pelicula } // enviamos la película para evitar otra llamada
    });
  }

}
