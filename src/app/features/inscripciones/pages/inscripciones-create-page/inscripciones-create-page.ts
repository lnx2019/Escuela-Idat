import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { CursoService } from '../../../../core/services/curso.service';
import { InscripcionService } from '../../../../core/services/inscripcion.service';
import { CancelButtonComponent } from "../../../../shared/components/cancel-button/cancel-button.component";

@Component({
  selector: 'app-inscripciones-create-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CancelButtonComponent],
  templateUrl: './inscripciones-create-page.html'
})
export class InscripcionesCreatePage implements OnInit {

  form!: FormGroup; // se inicializa en el constructor
  estudiantes: any[] = [];
  cursos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private cursoService: CursoService,
    private inscripcionService: InscripcionService,
    private router: Router
  ) {
    // Inicializamos el form aquí, después de inyectar fb
    this.form = this.fb.group({
      estudiante_id: [null, Validators.required],
      curso_id: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.usuarioService.getUsuarios().subscribe(res => {
      this.estudiantes = res.filter(x => x.rol === 'estudiante');
    });

    this.cursoService.getCursosPaginados(1, 500).subscribe(res => this.cursos = res.data);
  }

  guardar() {
    if (this.form.invalid) return;

    this.inscripcionService.crearInscripcion(this.form.value)
      .subscribe({
        next: () => this.router.navigate(['/inscripciones']),
        error: err => alert('Error: ' + (err.error?.message ?? 'Error inesperado'))
      });
  }
}
