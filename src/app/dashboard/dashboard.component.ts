import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavegacionService } from '../services/navegacion.service';
import { UsuarioService } from '../services/usuarios.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  tarjetas = [
    {
      titulo: 'Agendar Cita',
      descripcion: 'Programa citas para consultas o vacunaciones.',
      icono: '🗓️',
      ruta: '/agendar-cita',
    },
    {
      titulo: 'Consultas',
      descripcion: 'Accede al historial de consultas veterinarias.',
      icono: '⚕️',
      ruta: '/consultas',
    },
  ];

  usuarioNombre: string | null = null;
  usuarioNombreInicial: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private navegacionService: NavegacionService,
    private nav: NavegacionService,
  ) {}

  ngOnInit(): void {
    const usuario = this.usuarioService.getUsuarioSincrono();
    if (usuario) {
      this.usuarioNombre = usuario.nombre;
      this.usuarioNombreInicial = usuario.nombre.charAt(0).toUpperCase();
    } else {
      // Opcional: redirigir si no hay sesión (el AuthGuard ya debería hacerlo)
    }
  }

  logout(): void {
    this.usuarioService.logout().subscribe(() => {
      this.navegacionService.logout('/login'); // navega a /login
    });
  }
}
