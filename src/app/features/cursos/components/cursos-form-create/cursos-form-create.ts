import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core'; // 💡 Añadir Input
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CursoRegistro } from '../../../../core/models/curso.model';
import { Usuario } from '../../../../core/models/usuario.model';
import { CancelButtonComponent } from "../../../../shared/components/cancel-button/cancel-button.component"; // 💡 Nuevo: Importar Usuario

@Component({
  selector: 'app-cursos-form-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CancelButtonComponent],
  templateUrl: './cursos-form-create.html', // Asumo que el HTML sigue existiendo
  styleUrls: ['./cursos-form-create.scss']
})

export class CursosFormCreateComponent implements OnInit {
  cursoForm!: FormGroup;
  @Output() cursoRegistrado = new EventEmitter<CursoRegistro>();
  @Input() instructores: Usuario[] = []; 
  @Input() cargandoInstructores = true;

  constructor(private fb: FormBuilder) {}

ngOnInit(): void {
    this.cursoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      
      // ✅ Inicializamos con 'null' para forzar la selección
      instructor_id: [null, [Validators.required, Validators.min(1)]],
      
      duracion_horas: [0, [Validators.required, Validators.min(1)]], 
      
      activo: [true, [Validators.required]],
    });
  }

  guardarCurso(): void {
    if (this.cursoForm.valid) {
      const formValue = this.cursoForm.value;
      
      // Mapear 'activo' (booleano) a 'estado' (enum)
      const estadoValue = formValue.activo ? 'activo' : 'inactivo';

      // Construir el payload final con snake_case
      const cursoData: CursoRegistro = {
        titulo: formValue.titulo,
        descripcion: formValue.descripcion,
        instructor_id: Number(formValue.instructor_id), // Asegurar tipo number
        duracion_horas: Number(formValue.duracion_horas), // Asegurar tipo number
        estado: estadoValue as 'activo' | 'inactivo' | 'archivado'
        // 'fecha_creacion' e 'id' son generados por el backend (json-server)
      };

      this.cursoRegistrado.emit(cursoData);
    } else {
      this.cursoForm.markAllAsTouched();
    }
  }
}