// src/app/features/cursos/pages/cursos-page/cursos-page.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Curso } from '../../../../core/models/curso.model';
import { CursoService } from '../../../../core/services/curso.service';
import { Subject, switchMap, catchError, of, merge } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-cursos-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cursos-page.html',
  styleUrls: ['./cursos-page.scss']
})
export class CursosPage implements OnInit, OnDestroy {
  cursos: Curso[] = [];
  cargando = true;
  error: string | null = null;

  // Paginación (basado en el patrón de usuarios [cite: 1093])
  currentPage = 1;
  limit = 10;
  totalPages = 1;

  private cargarTrigger$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(
    private cursoService: CursoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initPaginacionListener();
    this.cargarTrigger$.next();
  }

  initPaginacionListener(): void {
    this.cargarTrigger$.pipe(
      tap(() => this.cargando = true),
      switchMap(() =>
        this.cursoService.getCursosPaginados(this.currentPage, this.limit).pipe(
          catchError(() => {
            this.error = 'Error al cargar los cursos';
            this.cargando = false;
            return of({ data: [], total: 0 });
          })
        )
      ),
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (res) => {
        this.cursos = res.data;
        this.totalPages = Math.ceil(res.total / this.limit);
        this.cargando = false;
        this.error = null;
      },
      error: () => {
        this.error = "Error al cargar los cursos";
        this.cargando = false;
      }
    });
  }

  cargarCursos(): void {
    this.cargarTrigger$.next(); // Dispara la recarga
  }

  nuevoCurso(): void {
    this.router.navigate(['/cursos/crear']);
  }

  editarCurso(curso: Curso): void {
    this.router.navigate(['/cursos/editar', curso.id]);
  }

  eliminarCurso(id: number, titulo: string): void {
    if (confirm(`¿Está seguro de que desea eliminar el curso "${titulo}" (ID: ${id})?`)) {
      this.cursoService.deleteCurso(id)
        .pipe(
          tap(() => {
            alert('Curso eliminado con éxito.');
            this.cargarCursos();
          }),
          catchError((error) => {
            console.error('Error al eliminar el curso:', error);
            alert('Error al eliminar el curso.');
            return of(null);
          })
        )
        .subscribe();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cargarCursos();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}