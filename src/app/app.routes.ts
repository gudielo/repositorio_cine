import { Routes } from '@angular/router';
import {CarteleraComponente} from './pages/cartelera-componente/cartelera-componente';
import {MovieDetailsComponent} from './pages/movie-details-component/movie-details-component';
import {
  PeliculasMantenimientoComponent
} from './pages/peliculas-mantenimiento-component/peliculas-mantenimiento-component';

export const routes: Routes = [
  { path: '', component: CarteleraComponente },
  { path: 'peliculas/:id', component: MovieDetailsComponent },
  { path: 'peliculas', component: PeliculasMantenimientoComponent }
];
