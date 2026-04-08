import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { LoginFormComponent } from '../../components/login-form/login-form';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginFormComponent, RouterModule, CommonModule],
  // 🔑 Cambios: Referencias a archivos externos
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss']
})
export class LoginPageComponent { 
  @ViewChild('loginForm') loginForm: any; // Asumiendo que esta referencia se usa

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(credentials: { username: string; password: string }) {
    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Mejor usar un Toast o un mensaje en la UI en lugar de alert()
        console.error('Error de login:', err);
        // Podrías actualizar el formulario para mostrar el error.
        // Ejemplo simple de manejo de error (si tienes un mensaje en el componente del form)
        // this.loginForm.setError('Credenciales incorrectas o error de servidor.'); 
      },
    });
  }
}


// import { Component, ViewChild } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { AuthService } from '../../../../core/auth/services/auth.service';
// import { LoginFormComponent } from '../../components/login-form/login-form';

// @Component({
//   selector: 'app-login-page',
//   standalone: true,
//   imports: [LoginFormComponent, RouterModule],
//   template: `
//     <div class="login-container">
//       <app-login-form (login)="onLogin($event)" #loginForm></app-login-form>
//     </div>
//   `,
//   styles: [`
//     .login-container {
//       min-height: 100vh;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       background: linear-gradient(135deg, #d6d6d6ff 0%, #67696dff 100%);
//     }
//   `]
// })
// export class LoginPageComponent {
//   @ViewChild('loginForm') loginForm!: LoginFormComponent;

//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   onLogin(credentials: { username: string; password: string }) {
//     this.authService.login(credentials).subscribe({
//       next: () => {
//         // ✅ Redirección al dashboard tras login exitoso
//         this.router.navigate(['/dashboard']);
//       },
//       error: () => {
//         // Opcional: muestra error visual
//         // this.loginForm.setError('Credenciales inválidas');
//       }
//     });
//   }
// }