import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistroMascotaComponent } from './components/registro-mascota/registro-mascota';
import { CitasComponent } from './components/citas/citas';
import { LoginComponent } from './auth/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'registrar-mascota', component: RegistroMascotaComponent },
  { path: 'agendar-cita', component: CitasComponent },

  { path: 'consultas', loadComponent: () => import('./components/consultas/consultas.component').then((m) => m.ConsultasComponent),},
  { path: 'citas/editar/:id', component: CitasComponent}
];
