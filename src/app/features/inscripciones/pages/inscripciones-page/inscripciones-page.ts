import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// 🔑 IMPORTACIÓN CLAVE AÑADIDA
import { FormsModule } from '@angular/forms'; 
import { InscripcionService, Inscripcion } from '../../../../core/services/inscripcion.service';

@Component({
  selector: 'app-inscripciones-page',
  standalone: true,
  // 🔑 AGREGADO: FormsModule para que ngModel funcione en el select
  imports: [CommonModule, FormsModule], 
  templateUrl: './inscripciones-page.html',
  styleUrls: ['./inscripciones-page.scss']
})
export class InscripcionesPage implements OnInit {

  inscripciones: Inscripcion[] = [];
  total = 0;

  page = 1;
  limit = 10;
  cargando = false;
  
  // PROPIEDAD: Define los estados posibles para usar en el HTML
  readonly estadosPosibles: Inscripcion['estado'][] = ['activo', 'completado', 'cancelado'];

  constructor(
    private inscripcionService: InscripcionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarInscripciones();
  }

  cargarInscripciones() {
    this.cargando = true;
    this.inscripcionService.getInscripcionesPaginadas(this.page, this.limit)
      .subscribe({
        next: res => {
          this.inscripciones = res.data;
          this.total = res.total;
          this.cargando = false;
        },
        error: () => this.cargando = false
      });
  }

  crear() {
    this.router.navigate(['/inscripciones/crear']);
  }

  editar(id: number) {
    this.router.navigate(['/inscripciones/editar', id]); 
  }
  
  onEstadoChange(id: number, nuevoEstado: Inscripcion['estado']) {
    this.cargando = true;

    this.inscripcionService.actualizarEstado(id, nuevoEstado)
      .subscribe({
        next: () => {
          this.cargarInscripciones(); 
        },
        error: (err) => {
          console.error('Error al actualizar estado:', err);
          this.cargarInscripciones(); 
        }
      });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta inscripción?')) return;

    this.inscripcionService.eliminarInscripcion(id)
      .subscribe(() => this.cargarInscripciones());
  }
}