import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Usuario, UsuarioUpdate } from '../../../../core/models/usuario.model';
import { UserFormEditComponent } from '../../components/user-form-edit/user-form-edit.component'; // Formulario de Presentación
import { catchError, of, tap } from 'rxjs';

// Definimos el tipo de datos que esperamos del formulario de edición: 
// Datos de actualización (opcionales) + el ID requerido.
type UsuarioEditPayload = UsuarioUpdate & Pick<Usuario, 'id'>;

@Component({
  selector: 'app-user-edit-page',
  standalone: true,
  // Importamos CommonModule y el Formulario de Presentación
  imports: [CommonModule, UserFormEditComponent], 
  template: `
    <div class="container my-4">
      <h2>Editar Usuario</h2>
      <div *ngIf="isLoading" class="alert alert-info">Cargando datos del usuario...</div>
      <div *ngIf="usuarioActual; else notFound">
        <!-- 
          Conexión al Componente Dumb (Presentación):
          1. [usuario]: Pasa los datos cargados (Input).
          2. (usuarioActualizado): Escucha el evento de guardado (Output) y llama a actualizarUsuario.
        -->
        <app-user-form-edit 
          [usuario]="usuarioActual" 
          (usuarioActualizado)="actualizarUsuario($event)" (cancelar)="onCancelar()" 
        ></app-user-form-edit>
      </div>
      <ng-template #notFound>
        <div *ngIf="!isLoading" class="alert alert-danger">
          No se encontró el usuario o hubo un error de carga.
        </div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./user-edit-page.component.scss']
})
export class UserEditPageComponent implements OnInit {
  usuarioActual: Usuario | null = null;
  isLoading: boolean = true;
  userId!: number;

  constructor(
    private route: ActivatedRoute, // Para leer el parámetro 'id'
    private router: Router,
    private usuarioService: UsuarioService // Servicio de la API
  ) {}

  ngOnInit(): void {
    // 1. Obtener el ID de la URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = +id;
        this.cargarUsuario(this.userId);
      } else {
        // Si no hay ID, redirigir
        this.router.navigate(['/usuarios']);
      }
    });
  }

  /**
   * Carga los datos del usuario desde la API.
   */
  cargarUsuario(id: number): void {
    this.isLoading = true;
    this.usuarioService.getUsuarioById(id).subscribe({
      next: (data: Usuario) => {
        this.usuarioActual = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener usuario:', err);
        this.isLoading = false;
        this.usuarioActual = null;
      }
    });
  }


  actualizarUsuario(usuario: Usuario): void {
    this.usuarioService.actualizarUsuario(usuario.id, usuario)
      .pipe(
        tap(response => {
          alert(`Usuario ${response.username} actualizado con éxito.`);
          // 💡 CORRECCIÓN: Navegar de vuelta al listado después de actualizar
          this.router.navigate(['/usuarios']); 
        }),
        catchError(error => {
          console.error('Error al actualizar el usuario:', error);
          alert('Error al actualizar el usuario.');
          return of(null);
        })
      )
      .subscribe();
  }


  onCancelar(): void {
    this.router.navigate(['/usuarios']);
  }
}