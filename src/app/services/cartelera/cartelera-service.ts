import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';

const API_URL = 'https://movie.azurewebsites.net/api/cartelera?title=&ubication=';
const API_URL_GET = 'https://movie.azurewebsites.net/api/cartelera?imdbID=';
const API_URL_POST = 'https://movie.azurewebsites.net/api/cartelera';

export interface Pelicula {
  id?: string;
  titulo?: string;
  year?: string;
  tipo?: string;
  poster?: string;
  estado?: boolean;
  descripcion?: string;
  ubicacion?: string;
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
          id: x.imdbID ?? undefined,
          titulo: x.Title ?? 'Sin título',
          year: x.Year ?? '',
          tipo: x.Type ?? '',
          poster: x.Poster ?? '',
          estado: x.Estado ?? '',
          descripcion: x.description ?? '',
          ubicacion: x.Ubication ?? '',
          ...x
        })) as Pelicula[];
      })
    );
  }

  getPeliculaById(id: string): Observable<Pelicula | null> {
    return this.http.get<any>(`${API_URL_GET}${encodeURIComponent(id)}`).pipe(
      map((x: any) => {
        if (!x) return null;
        return {
          id: x.imdbID ?? x.movieId ?? x.codigo ?? x.id ?? id,
          titulo: x.Title ?? x.title ?? x.nombre ?? 'Sin título',
          descripcion: x.description ?? x.overview ?? x.sinopsis ?? '',
          poster: x.Poster ?? x.posterUrl ?? x.imagen ?? x.image ?? '',
          fechaEstreno: x.fechaEstreno ?? x.releaseDate ?? x.estreno ?? '',
          duracion: x.duracion ?? x.runtime ?? '',
          calificacion: x.calificacion ?? x.rating ?? '',
          estado: x.Estado ?? x.estado ?? '',
          ...x
        } as Pelicula;
      })
    );
  }

  createPelicula(body: Pelicula): Observable<Pelicula> {
    return this.http.post<any>(API_URL_POST, body).pipe(
      map((x: any) => ({
        id: x.imdbID ?? x.movieId ?? x.codigo ?? x.id,
        titulo: x.Title ?? x.title ?? x.nombre ?? 'Sin título',
        descripcion: x.description ?? x.overview ?? x.sinopsis ?? '',
        poster: x.Poster ?? x.posterUrl ?? x.imagen ?? x.image ?? '',
        fechaEstreno: x.fechaEstreno ?? x.releaseDate ?? x.estreno ?? '',
        duracion: x.duracion ?? x.runtime ?? '',
        calificacion: x.calificacion ?? x.rating ?? '',
        estado: x.Estado ?? x.estado ?? '',
        ...x
      }))
    );
  }

  updatePelicula(id: string, body: Pelicula): Observable<Pelicula> {
    return this.http.put<any>(`${API_URL_GET}${encodeURIComponent(id)}`, body).pipe(
      map((x: any) => ({
        id: x.imdbID ?? x.movieId ?? x.codigo ?? x.id ?? id,
        titulo: x.Title ?? x.title ?? x.nombre ?? 'Sin título',
        descripcion: x.description ?? x.overview ?? x.sinopsis ?? '',
        poster: x.Poster ?? x.posterUrl ?? x.imagen ?? x.image ?? '',
        fechaEstreno: x.fechaEstreno ?? x.releaseDate ?? x.estreno ?? '',
        duracion: x.duracion ?? x.runtime ?? '',
        calificacion: x.calificacion ?? x.rating ?? '',
        estado: x.Estado ?? x.estado ?? '',
        ...x
      }))
    );
  }

  deletePelicula(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL_GET}${encodeURIComponent(id)}`);
  }

}
