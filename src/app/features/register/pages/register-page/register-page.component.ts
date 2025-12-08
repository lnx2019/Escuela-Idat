import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Asegurar CommonModule si se usa ngIf/ngFor
import { AuthService } from '../../../../core/auth/services/auth.service';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RegisterFormComponent, RouterLink, CommonModule],
  templateUrl: './register-page.component.html', // APUNTA AL NUEVO HTML
  styleUrls: ['./register-page.component.scss']  // APUNTA AL NUEVO SCSS
})
export class RegisterPageComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister(credentials: { username: string; password: string; email: string; nombre: string; rol: string }) {
    this.authService.register(credentials).subscribe({
      next: () => {
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en registro:', err);
        // Mejorar la gestión de errores aquí si el backend devuelve un mensaje específico
        alert('Error al registrar. Revisa los datos e intenta de nuevo.');
      }
    });
  }
}
