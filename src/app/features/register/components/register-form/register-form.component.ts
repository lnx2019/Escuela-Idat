import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register-form.component.html', // <--- APUNTA AL NUEVO HTML
  styleUrls: ['./register-form.component.scss']  // <--- APUNTA AL NUEVO SCSS
})
export class RegisterFormComponent {
  @Output() register = new EventEmitter<{ 
    username: string; 
    password: string; 
    email: string; 
    nombre: string; 
    rol: string 
  }>();

  credentials = {
    username: '',
    password: '',
    email: '',
    nombre: '',
    rol: ''
  };

  submit() {
    if (this.credentials.rol) {
      this.register.emit(this.credentials);
    }
  }
}
