import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscripcionService, Inscripcion } from '../../../../core/services/inscripcion.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { catchError, of, tap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-mis-inscripciones-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-inscripciones-page.component.html',
  styleUrls: ['./mis-inscripciones-page.component.scss']
})
export class MisInscripcionesPage implements OnInit {
  inscripciones: Inscripcion[] = [];
  isLoading = true;
  estudianteId: number | null = null;

  constructor(
    private inscripcionService: InscripcionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    // Obtener el ID y el rol del usuario actual
    if (user && user.rol === 'estudiante') { 
      this.estudianteId = user.id;
      this.cargarInscripciones();
    } else {
      this.router.navigate(['/dashboard']); 
    }
  }

  cargarInscripciones(): void {
    if (!this.estudianteId) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.inscripcionService.getInscripcionesByEstudianteId(this.estudianteId).pipe(
      tap(data => {
        // Asumiendo que el backend proporciona 'curso_titulo'
        this.inscripciones = data; 
        this.isLoading = false;
      }),
      catchError(err => {
        console.error('Error al cargar mis inscripciones:', err);
        alert('Error al cargar tus cursos inscritos. Revisa la consola.');
        this.isLoading = false;
        return of([]);
      })
    ).subscribe();
  }

  cancelarInscripcion(inscripcion: Inscripcion): void {
    if (inscripcion.estado !== 'activo') {
      alert('Solo se pueden cancelar inscripciones activas.');
      return;
    }

    if (confirm(`¿Deseas cancelar tu inscripción al curso: ${inscripcion.curso_titulo}?`)) {
      // Usa el método de actualizar estado del servicio para cambiar a 'cancelado'
      this.inscripcionService.actualizarEstado(inscripcion.id, 'cancelado').pipe(
        tap(() => {
          alert(`Inscripción al curso ${inscripcion.curso_titulo} cancelada con éxito.`);
          this.cargarInscripciones(); // Recargar la lista
        }),
        catchError(err => {
          console.error('Error al cancelar inscripción:', err);
          alert('Error al cancelar la inscripción.');
          return of(null);
        })
      ).subscribe();
    }
  }
}