// src/app/features/usuarios/components/user-form-create/user-form-create.component.ts

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // ⬅️ Importar ReactiveFormsModule
import { CommonModule } from '@angular/common'; // ⬅️ Importar CommonModule
import { UsuarioRegistro } from '../../../../core/models/usuario.model';
import { CancelButtonComponent } from "../../../../shared/components/cancel-button/cancel-button.component"; // Asumiendo que esta ruta es correcta [cite: 742]

@Component({
  selector: 'app-user-form-create',
  standalone: true,
  // 💡 CORRECCIÓN: Incluir los módulos necesarios para formularios y directivas
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CancelButtonComponent
], 
  templateUrl: './user-form-create.component.html', 
  styleUrls: ['./user-form-create.component.scss']
})
export class UserFormCreateComponent implements OnInit {
  // Inicializar userForm con el tipo correcto
  userForm!: FormGroup; 
  
  // Emite el usuario con la contraseña (UsuarioRegistro) [cite: 921]
  @Output() usuarioRegistrado = new EventEmitter<UsuarioRegistro>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Inicialización del formulario con campos y validadores
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required]],
      // Valor por defecto 'estudiante' [cite: 920]
      rol: ['estudiante', [Validators.required]],
      // Campo PASSWORD OBLIGATORIO para la creación [cite: 920]
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  guardarUsuario(): void {
    if (this.userForm.valid) {
      // Se emiten los valores del formulario como UsuarioRegistro [cite: 921]
      this.usuarioRegistrado.emit(this.userForm.value as UsuarioRegistro);
    } else {
      // Marcar todos los campos como tocados para mostrar los mensajes de error
      this.userForm.markAllAsTouched();
    }
  }
}