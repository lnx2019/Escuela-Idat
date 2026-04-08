// src/app/layouts/dashboard-layout/dashboard-layout.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/services/auth.service';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {
  // Rol del usuario logueado para usar en el template
  userRole: Usuario['rol'] | null = null;
  currentUser: Usuario | null = null;

  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    // Intentar obtener el usuario actual (usando el token decodificado)
    this.currentUser = this.authService.getCurrentUser();
    this.userRole = this.currentUser ? this.currentUser.rol : null;
  }

  logout(): void {
    this.authService.logout();
  }
}