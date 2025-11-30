// src/app/features/cursos/pages/cursos-create-page/cursos-create-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { CursoService } from '../../../../core/services/curso.service';
import { CursoRegistro } from '../../../../core/models/curso.model';
import { CursosFormCreateComponent } from '../../components/cursos-form-create/cursos-form-create'; // Asegúrate de la extensión .component
import { Usuario } from '../../../../core/models/usuario.model';
import { UsuarioService } from '../../../../core/services/usuario.service';

@Component({
  selector: 'app-cursos-create-page',
  standalone: true,
  imports: [CommonModule, CursosFormCreateComponent],
  template: `
    <div class="container my-4">
      <h2>Crear Nuevo Curso</h2>
            <app-cursos-form-create
        [instructores]="instructores"
        [cargandoInstructores]="cargandoInstructores"
        (cursoRegistrado)="crearCurso($event)">
      </app-cursos-form-create>
    </div>
  `,
  styleUrls: ['./cursos-create-page.scss']
})
export class CursosCreatePage implements OnInit {
  
  instructores: Usuario[] = []; 
  cargandoInstructores = true;

  constructor( 
    // private fb: FormBuilder, // ❌ Ya no es necesario, el formulario está en el hijo
    private cursoService: CursoService, 
    private router: Router,
    private usuarioService: UsuarioService){}

    ngOnInit(): void {
        // this.initForm(); // ❌ Ya no es necesario, el formulario se inicializa en el hijo
        this.cargarInstructores(); 
    }

  // ❌ El método initForm ya no pertenece a este componente
  // initForm(): void { ... }

  cargarInstructores(): void {
  this.cargandoInstructores = true;
  this.usuarioService.getInstructores()
    .pipe(
      tap((res: Usuario[]) => { 
        this.instructores = res;
        this.cargandoInstructores = false;
      }),
      catchError((err) => {
        console.error('Error al cargar instructores:', err);
        this.cargandoInstructores = false;
        return of([]); 
      })
    )
    .subscribe();
}

  crearCurso(cursoData: CursoRegistro): void {
    this.cursoService.crearCurso(cursoData).subscribe({
      next: (cursoCreado) => {
        alert(`Curso ${cursoCreado.titulo} creado correctamente.`); 
        // Asumiendo que /cursos es la ruta al listado, ajusta si es necesario
        this.router.navigate(['/cursos']); 
      },
      error: (err) => {
        console.error('Error durante la creación:', err);
        alert('Error al crear el curso. Revisa la consola.');
      }
    });
  }
}