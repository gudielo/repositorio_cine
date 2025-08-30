import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';

const API_URL = 'https://movie.azurewebsites.net/api/cartelera?title=&ubication=';

export interface Pelicula {
  id?: string | number;
  titulo?: string;
  descripcion?: string;
  poster?: string;
  genero?: string;
  fechaEstreno?: string | Date;
  duracion?: string | number;
  calificacion?: number | string;
  [k: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class CarteleraService {

  private http = inject(HttpClient);

  getCartelera(): Observable<Pelicula[]> {
    return this.http.get<any>(API_URL).pipe(
      map((data: any) => {
        // Normalización básica defensiva
        const items = Array.isArray(data) ? data : data?.items ?? data ?? [];
        return items.map((x: any) => ({
          id: x.imdbID ?? x.movieId ?? x.codigo ?? undefined,
          titulo: x.Title ?? x.title ?? x.nombre ?? 'Sin título',
          descripcion: x.description ?? x.overview ?? x.sinopsis ?? '',
          poster: x.Poster ?? x.posterUrl ?? x.imagen ?? x.image ?? '',
          fechaEstreno: x.fechaEstreno ?? x.releaseDate ?? x.estreno ?? '',
          duracion: x.duracion ?? x.runtime ?? '',
          calificacion: x.calificacion ?? x.rating ?? '',
          estado: x.Estado ?? x.estado ?? '',
          ...x
        })) as Pelicula[];
      })
    );
  }

}
