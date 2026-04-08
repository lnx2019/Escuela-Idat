// src/app/features/cursos/cursos.routes.ts

import { Routes } from '@angular/router';

export const CURSOS_ROUTES: Routes = [
  // LISTADO DE CURSOS (/dashboard/cursos)
  {
    path: '',
    loadComponent: () =>
      import('./pages/cursos-page/cursos-page').then(
        (m) => m.CursosPage
      ),
    pathMatch: 'full',
  },

  // CREAR CURSO (/dashboard/cursos/crear)
  {
    path: 'crear',
    loadComponent: () =>
      import('./pages/cursos-create-page/cursos-create-page').then( // Se asume el sufijo .component
        (m) => m.CursosCreatePage
      ),
  },

  // EDITAR CURSO (/dashboard/cursos/editar/:id)
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./pages/cursos-edit-page/cursos-edit-page').then( // Se asume el sufijo .component
        (m) => m.CursosEditPage
      ),
  },
];