// src/app/features/usuarios/pages/user-create/user-create.page.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para directivas básicas si son necesarias
import { Router } from '@angular/router'; // Para la navegación
import { catchError, of, tap } from 'rxjs';

// ⬅️ Importar el componente de formulario (dumb component)
import { UserFormCreateComponent } from '../../components/user-form-create/user-form-create.component'; 

// ⬅️ Importar el servicio y los modelos
import { UsuarioService } from '../../../../core/services/usuario.service'; // Asumiendo esta ruta
import { UsuarioRegistro } from '../../../../core/models/usuario.model'; 

@Component({
  selector: 'app-user-create-page',
  standalone: true,
  // 💡 CORRECCIÓN: Incluir UserFormCreateComponent en imports
  imports: [
    CommonModule, 
    UserFormCreateComponent // El formulario que acabamos de corregir
  ], 
  template: `
    <div class="user-create-container p-4">
      <h2>Crear Nuevo Usuario</h2>
      <app-user-form-create 
        (usuarioRegistrado)="registrarUsuario($event)">
      </app-user-form-create>
    </div>
  `,
  styleUrls: ['./user-create-page.scss']
})
export class UserCreatePage {

  // 💡 Inyección del servicio y el enrutador
  constructor(
    private usuarioService: UsuarioService, 
    private router: Router
  ) {}

  /**
   * Maneja el evento emitido por el UserFormCreateComponent.
   * Llama al servicio para registrar el usuario, incluyendo la contraseña.
   * @param usuario El objeto UsuarioRegistro con los datos del formulario.
   */
  registrarUsuario(usuario: UsuarioRegistro): void {
    console.log('Datos a registrar:', usuario);
    
    // 💡 Llamada al servicio con manejo de éxito y error
    this.usuarioService.crearUsuario(usuario)
      .pipe(
        // Si tiene éxito: navega y muestra un mensaje
        tap(response => {
          alert(`Usuario ${response.username} creado con éxito.`);
          this.router.navigate(['/usuarios']); // Redirigir al listado
        }),
        // Si hay un error en la API: muestra un mensaje de error (o maneja el estado)
        catchError(error => {
          console.error('Error al registrar el usuario:', error);
          alert('Error al crear el usuario. Revise la consola para más detalles.');
          // Retorna un observable vacío para que la suscripción no falle
          return of(null); 
        })
      )
      .subscribe();
  }
}