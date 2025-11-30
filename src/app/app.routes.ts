// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginPageComponent } from './features/login/pages/login-page/login-page';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Rutas públicas
  { path: 'login', component: LoginPageComponent },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/pages/register-page/register-page.component')
        .then(m => m.RegisterPageComponent)
  },

  // RUTA PRINCIPAL PROTEGIDA: layout + children
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/dashboard-layout/dashboard-layout.component')
        .then(m => m.DashboardLayoutComponent),
    children: [
      { 
        path: 'dashboard',
        canActivate: [roleGuard],
        data: { roles: ['administrador', 'instructor', 'estudiante'] },
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard-page/dashboard-page.component')
            .then(m => m.DashboardPage)
      },

      {
        path: 'usuarios',
        canActivate: [roleGuard],
        data: { roles: ['administrador'] },
        loadChildren: () =>
          import('./features/usuarios/usuarios.routes').then(m => m.USUARIOS_ROUTES)
      },
      {
        path: 'estudiantes',
        canActivate: [roleGuard],
        data: { roles: ['instructor'] }, // Solo accesible para instructores
        loadChildren: () =>
          import('./features/estudiantes/estudiantes.routes').then(m => m.ESTUDIANTES_ROUTES)
      },
      {
        path: 'cursos',
        canActivate: [roleGuard],
        data: { roles: ['administrador', 'instructor'] },
        loadChildren: () =>
          import('./features/cursos/cursos.routes').then(m => m.CURSOS_ROUTES)
      },
      {
        path: 'inscripciones',
        canActivate: [roleGuard],
        data: { roles: ['administrador', 'instructor'] },
        loadChildren: () =>
          import('./features/inscripciones/inscripciones.routes')
            .then(m => m.INSCRIPCIONES_ROUTES)
      },
      // DESPUÉS (usando 'default' para la exportación por defecto)
      {
        path: 'reportes',
        canActivate: [roleGuard],
        data: { roles: ['administrador', 'instructor'] },
        loadComponent: () =>
          import('./features/reportes/pages/reportes-page/reportes-page')
            .then(m => m.default) // <--- Cambia 'm.ReportesPage' por 'm.default'
      },
      // Default dentro del layout -> dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Si ninguna ruta coincide -> llevar al login (solo una vez, al final)
  { path: '**', redirectTo: '/login' }
];
