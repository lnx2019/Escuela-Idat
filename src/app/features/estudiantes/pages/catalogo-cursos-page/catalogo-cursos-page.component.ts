import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursoService } from '../../../../core/services/curso.service';
import { Curso } from '../../../../core/models/curso.model';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { InscripcionService, InscripcionRegistro } from '../../../../core/services/inscripcion.service';
import { catchError, map, of, switchMap, tap } from 'rxjs';
// import { RouterLink } from '@angular/router'; // Para el enlace en el HTML

@Component({
  selector: 'app-catalogo-cursos-page',
  standalone: true,
  imports: [CommonModule],
//   imports: [CommonModule, RouterLink],
  templateUrl: './catalogo-cursos-page.component.html',
  styleUrls: ['./catalogo-cursos-page.component.scss']
})
export class CatalogoCursosPage implements OnInit {
  cursos: Curso[] = [];
  inscripcionesIds: number[] = []; // IDs de los cursos en los que ya está inscrito
  estudianteId: number | null = null;
  isLoading = true;

  constructor(
    private cursoService: CursoService,
    private inscripcionService: InscripcionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.rol === 'estudiante') {
      this.estudianteId = user.id;
      this.cargarDatos();
    } else {
      this.isLoading = false;
    }
  }

  cargarDatos(): void {
    this.isLoading = true;
    this.cursoService.getCatalogoCursos().pipe(
      tap(cursos => this.cursos = cursos),
      switchMap(() => {
        if (this.estudianteId) {
          // Cargar inscripciones del estudiante para deshabilitar el botón
          return this.inscripcionService.getInscripcionesByEstudianteId(this.estudianteId).pipe(
            map(inscripciones => inscripciones.map(i => i.curso_id)) // Solo necesitamos los IDs
          );
        }
        return of([]);
      }),
      tap(inscripcionesIds => {
        this.inscripcionesIds = inscripcionesIds;
        this.isLoading = false;
      }),
      catchError(err => {
        console.error('Error al cargar catálogo o inscripciones:', err);
        alert('Error al cargar los datos. Revisa la consola.');
        this.isLoading = false;
        return of([]);
      })
    ).subscribe();
  }

  estaInscrito(cursoId: number): boolean {
    return this.inscripcionesIds.includes(cursoId);
  }

  inscribirse(curso: Curso): void {
    if (!this.estudianteId || this.estaInscrito(curso.id)) {
      alert('Ya estás inscrito en este curso o no se pudo obtener tu ID.');
      return;
    }

    if (confirm(`¿Estás seguro de inscribirte en el curso: ${curso.titulo}?`)) {
      const payload: InscripcionRegistro = {
        estudiante_id: this.estudianteId,
        curso_id: curso.id,
      };

      this.inscripcionService.crearInscripcion(payload).pipe(
        tap(() => {
          alert(`Inscripción exitosa al curso: ${curso.titulo}`);
          this.cargarDatos(); // Recargar para actualizar el estado del botón
        }),
        catchError(err => {
          console.error('Error al inscribirse:', err);
          alert('Error al intentar inscribirse. Podría ser una inscripción duplicada.');
          return of(null);
        })
      ).subscribe();
    }
  }
}