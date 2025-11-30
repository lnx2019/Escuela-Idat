// src/app/features/cursos/components/cursos-form-edit/cursos-form-edit.component.ts
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Curso, CursoUpdate } from '../../../../core/models/curso.model';
// ... otras importaciones
import { Usuario } from '../../../../core/models/usuario.model'; // 👈 Nuevo
import { UsuarioService } from '../../../../core/services/usuario.service'; // 👈 Nuevo
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-cursos-form-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cursos-form-edit.html',
  styleUrls: ['./cursos-form-edit.scss']
})
export class CursosFormEditComponent implements OnInit, OnChanges {
  @Input({ required: true }) curso!: Curso;
  @Output() cursoActualizado = new EventEmitter<CursoUpdate>();
  @Output() cancelar = new EventEmitter<void>();

  cursoForm!: FormGroup;
  // 💡 NUEVA PROPIEDAD: Para almacenar la lista de instructores
  instructores: Usuario[] = [];
  cargandoInstructores = true;

  constructor(
    private fb: FormBuilder, private usuarioService: UsuarioService, // 👈 Inyectar el servicio de usuarios
  ) { this.cursoForm = this.fb.group({}) }

  ngOnInit(): void {
    this.cargarInstructores();
    this.initForm(this.curso);
  }

  // 💡 NUEVO MÉTODO: Cargar la lista de instructores
cargarInstructores(): void {
  this.cargandoInstructores = true;
  this.usuarioService.getInstructores()
    .pipe(
      // Ya que el servicio devuelve Usuario[], la tubería lo recibe.
      // Puedes eliminar el tipado explícito 'res: Usuario[]' o mantenerlo.
      tap((res) => { 
        // ✅ Corrección: Asignamos el arreglo 'res' directamente
        this.instructores = res;
        this.cargandoInstructores = false;
      }),
      // El catchError ya devuelve un arreglo vacío compatible, por lo que está bien.
      catchError((err) => {
        console.error('Error al cargar instructores:', err);
        this.cargandoInstructores = false;
        return of([]); 
      })
    )
    .subscribe();
}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['curso'] && this.curso) {
      this.initForm(this.curso);
    }
  }

initForm(curso: Curso): void {
    // Convertimos estado ('activo'|'inactivo') a booleano 'activo' para el checkbox
    const activoFromEstado = curso.estado === 'activo'; 
    
    this.cursoForm = this.fb.group({
      id: [curso.id, [Validators.required]],
      titulo: [curso.titulo, [Validators.required, Validators.maxLength(100)]],
      descripcion: [curso.descripcion, [Validators.required, Validators.maxLength(500)]],
      
      // ⬇️ Nombre de control: instructor_id
      instructor_id: [curso.instructor_id, [Validators.required, Validators.min(1)]],
      
      // ⬇️ Nombre de control: duracion_horas
      duracion_horas: [curso.duracion_horas, [Validators.required, Validators.min(0)]],
      
      // ⬇️ Control temporal para el checkbox (activo/inactivo)
      activo: [activoFromEstado, [Validators.required]], 
      
      // ⬇️ Campo necesario para el PUT: fecha_creacion
      fecha_creacion: [curso.fecha_creacion]
    });
  }

  guardarCurso(): void {
    if (this.cursoForm.valid) {
      const formValue = this.cursoForm.value;
      
      // 1. Mapear 'activo' (booleano) a 'estado' (enum)
      const estadoValue = formValue.activo ? 'activo' : 'inactivo';

      // 2. Construir el payload con todos los campos de la DB/API, excluyendo el 'id'
      const cursoData: CursoUpdate = {
        titulo: formValue.titulo,
        descripcion: formValue.descripcion,
        instructor_id: Number(formValue.instructor_id),
        duracion_horas: Number(formValue.duracion_horas),
        estado: estadoValue as 'activo' | 'inactivo' | 'archivado', // Asegurar el tipo
        fecha_creacion: formValue.fecha_creacion // CLAVE: Necesario para el PUT
      };

      this.cursoActualizado.emit(cursoData);
    } else {
      this.cursoForm.markAllAsTouched();
    }
  }


  // guardarCurso(): void {
  //   if (this.cursoForm.valid) {
  //     // Separamos el ID para usar solo el payload de actualización
  //     const { id, ...payload } = this.cursoForm.value;
  //     const cursoData: CursoUpdate = {
  //       ...payload,
  //       duracionHoras: Number(payload.duracionHoras)
  //     };

  //     this.cursoActualizado.emit(cursoData);
  //   } else {
  //     this.cursoForm.markAllAsTouched();
  //   }
  // }

  onCancelar(): void {
    this.cancelar.emit();
  }
}