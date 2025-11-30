// src/app/features/usuarios/usuarios.routes.ts

import { Routes } from '@angular/router';

export const USUARIOS_ROUTES: Routes = [
  // LISTADO DE USUARIOS (/dashboard/usuarios)
  {
    path: '',
    loadComponent: () =>
      import('./pages/usuarios-page/usuarios-page').then(
        (m) => m.UsuariosPageComponent
      ),
    pathMatch: 'full',
  },

  // CREAR USUARIO (/dashboard/usuarios/crear)
  {
    path: 'crear',
    loadComponent: () =>
      import('./pages/user-create-page/user-create-page').then( // Se asume el sufijo .component
        (m) => m.UserCreatePage
      ),
  },

  // EDITAR USUARIO (/dashboard/usuarios/editar/:id)
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./pages/user-edit-page/user-edit-page.component').then(
        (m) => m.UserEditPageComponent
      ),
  },
];