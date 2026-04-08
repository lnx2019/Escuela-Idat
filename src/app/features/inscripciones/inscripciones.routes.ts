import { Routes } from '@angular/router';

export const INSCRIPCIONES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/inscripciones-page/inscripciones-page')
        .then(m => m.InscripcionesPage)
  },
  {
    path: 'crear',
    loadComponent: () =>
      import('./pages/inscripciones-create-page/inscripciones-create-page')
        .then(m => m.InscripcionesCreatePage)
  }
];
