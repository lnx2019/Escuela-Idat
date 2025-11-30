// src/app/features/estudiantes/estudiantes.routes.ts
import { Routes } from '@angular/router';
import { ESTUDIANTES_PAGE } from './pages/estudiantes-page/estudiantes-page.component';

export const ESTUDIANTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => ESTUDIANTES_PAGE,
    pathMatch: 'full'
  }
];