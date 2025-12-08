// src/app/features/estudiantes/pages/estudiantes-page/estudiantes-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Usuario } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-estudiantes-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estudiantes-page.component.html',
  styleUrls: ['./estudiantes-page.component.scss']
})
export class ESTUDIANTES_PAGE implements OnInit {
  estudiantes: Usuario[] = [];
  cargando = true;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        // Filtrar solo los usuarios con rol 'estudiante'
        this.estudiantes = usuarios.filter(u => u.rol === 'estudiante');
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }
}