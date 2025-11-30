// src/app/features/cursos/pages/cursos-edit-page/cursos-edit-page.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CursoService } from '../../../../core/services/curso.service';
import { Curso, CursoUpdate } from '../../../../core/models/curso.model';
import { CursosFormEditComponent } from '../../components/cursos-form-edit/cursos-form-edit';
import { catchError, of, tap } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-cursos-edit-page',
  standalone: true,
  imports: [CommonModule, CursosFormEditComponent],
  template: `
    <div class="container my-4">
      <h2>Editar Curso</h2>
      @if (isLoading) {
        <div class="alert alert-info">Cargando datos del curso...</div>
      }
      @else if (cursoActual) {
        <app-cursos-form-edit
          [curso]="cursoActual"
          (cursoActualizado)="actualizarCurso($event)"
          (cancelar)="onCancelar()"
        ></app-cursos-form-edit>
      }
      @else {
        <div class="alert alert-danger">
          No se encontró el curso o hubo un error de carga.
        </div>
      }
    </div>
  `,
  styleUrls: ['./cursos-edit-page.scss']
})
export class CursosEditPage implements OnInit {
  cursoActual: Curso | null = null;
  isLoading = true;
  cursoId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      tap(params => {
        this.cursoId = +params['id'];
        if (isNaN(this.cursoId)) {
            throw new Error('ID de curso no válido.');
        }
      }),
      switchMap(() => {
        return this.cursoService.getCursoById(this.cursoId).pipe(
          catchError(err => {
            console.error('Error al cargar el curso:', err);
            this.isLoading = false;
            return of(null);
          })
        );
      })
    ).subscribe(curso => {
      this.cursoActual = curso;
      this.isLoading = false;
    });
  }

  actualizarCurso(payload: CursoUpdate): void {
    this.cursoService.actualizarCurso(this.cursoId, payload)
      .pipe(
        tap((curso) => {
          alert(`Curso '${curso.titulo}' actualizado con éxito.`);
          this.router.navigate(['/cursos']);
        }),
        catchError((error) => {
          console.error('Error al actualizar el curso:', error);
          alert('Error al actualizar el curso.');
          return of(null);
        })
      )
      .subscribe();
  }

  onCancelar(): void {
    this.router.navigate(['/cursos']);
  }
}