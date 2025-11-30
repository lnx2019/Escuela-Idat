import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario, UsuarioUpdate } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-user-form-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-form-edit.component.html', // Nuevo HTML
  styleUrls: ['./user-form-edit.component.scss']
})
export class UserFormEditComponent implements OnInit {
  
  // Recibe el usuario completo existente
  @Input({ required: true }) usuario!: Usuario; 
  @Output() usuarioActualizado = new EventEmitter<Usuario>();
  // @Output() usuarioActualizado = new EventEmitter<UsuarioUpdate>();
  @Output() cancelar = new EventEmitter<void>();
  
  userForm!: FormGroup;
  roles = ['administrador', 'instructor', 'estudiante'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
      // 💡 CORRECCIÓN 3: Inicialización del formulario con TODOS los campos
      this.userForm = this.fb.group({
        // ID es necesario para la actualización en el servicio
        id: [this.usuario.id, [Validators.required]], 
        username: [this.usuario.username, [Validators.required]],
        email: [this.usuario.email, [Validators.required, Validators.email]],
        nombre: [this.usuario.nombre, [Validators.required]],
        rol: [this.usuario.rol, [Validators.required]],
        // Campo Activo/Inactivo (Booleano)
        activo: [this.usuario.activo, [Validators.required]], 
      });
    }

  guardarUsuario(): void {
    if (this.userForm.valid) {
      // Emitimos el valor completo (incluyendo el ID para el servicio padre)
      this.usuarioActualizado.emit(this.userForm.value as Usuario);
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}