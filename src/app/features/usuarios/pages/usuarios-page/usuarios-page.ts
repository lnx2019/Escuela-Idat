import { Component, OnInit, OnDestroy } from '@angular/core';
import { catchError, of, Subject, switchMap, tap, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Router } from '@angular/router';
import { Usuario } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-usuarios-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios-page.html',
  styleUrls: ['./usuarios-page.scss']
})
export class UsuariosPageComponent implements OnInit, OnDestroy {
  usuarios: Usuario[] = [];
  cargando = false;
  error: string | null = null;

  currentPage = 1;
  totalPages = 1;
  limit = 10;

  private destroy$ = new Subject<void>();
  private cargarTrigger$ = new Subject<void>(); // 🚀 NUEVO disparador de recargas

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // 🚀 Sistema reactivo de carga seguro
    this.cargarTrigger$
      .pipe(
        tap(() => {
          this.cargando = true;
          this.error = null;
        }),
        switchMap(() =>
          this.usuarioService.getUsuariosPaginados(this.currentPage, this.limit)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          this.usuarios = res.data;
          this.totalPages = Math.ceil(res.total / this.limit);
          this.cargando = false;
        },
        error: () => {
          this.error = "Error al cargar los usuarios";
          this.cargando = false;
        }
      });

    // Primera carga
    this.cargarTrigger$.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 🔥 Ahora esta función solo dispara el evento
  cargarUsuarios(): void {
    this.cargarTrigger$.next();
  }

  eliminarUsuario(id: number): void {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    this.usuarioService.deleteUsuario(id)
      .pipe(
        tap(() => {
          alert("Usuario eliminado correctamente.");
          this.cargarTrigger$.next(); // 🚀 recarga con flujo seguro
        }),
        catchError(err => {
          console.error("Error al eliminar usuario:", err);
          alert("No se pudo eliminar el usuario.");
          return of(null);
        })
      )
      .subscribe();
  }

  nuevoUsuario(): void {
    this.router.navigate(['/usuarios/crear']);
  }

  editarUsuario(usuario: Usuario): void {
    this.router.navigate(['/usuarios/editar', usuario.id]);
  }

  irAPagina(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cargarTrigger$.next(); // 🚀 recarga reactiva
    }
  }

  generarRangoPaginas(): number[] {
    const delta = 2;
    const range: number[] = [];
    for (
      let i = Math.max(1, this.currentPage - delta);
      i <= Math.min(this.totalPages, this.currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  }
}
