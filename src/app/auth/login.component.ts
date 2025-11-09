import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuarios.service';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  usuario = '';
  password = '';
  error = '';

  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    // ✅ Verifica si ya hay un usuario autenticado en memoria
    const sesionActual = this.usuarioService.getUsuarioSincrono();
    if (sesionActual) {
      this.router.navigate(['/dashboard']);
    }
  }  
  
onLogin(): void {
    this.usuarioService.login(this.usuario, this.password).subscribe({
      next: (user) => {
        if (user) {
          console.log(`✅ Bienvenido ${user.nombre} (${user.rol})`);
          this.router.navigate(['/dashboard']); // o '/home'
        } else {
          this.error = 'Usuario o contraseña incorrectos';
        }
      },
      error: () => (this.error = 'Error al conectar con el servidor'),
    });
  }
}
