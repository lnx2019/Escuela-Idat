// src/app/features/login/components/login-form/login-form.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
// import { RouterModule } from '@angular/router'; // ← Añade esta línea

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.scss']
})
export class LoginFormComponent {
  @Output()
  login = new EventEmitter<{ username: string; password: string }>();

  credentials = {
    username: '',
    password: ''
  };

  submit() {
    this.login.emit(this.credentials);
  }
}