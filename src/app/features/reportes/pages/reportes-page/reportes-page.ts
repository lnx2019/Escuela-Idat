// src/app/features/reportes/pages/reportes-page/reportes-page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesService } from '../../../../core/services/reportes.service'; // Ajusta la ruta a tu servicio

@Component({
  selector: 'app-reportes-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes-page.html', // Usaremos un archivo .html
  styleUrls: ['./reportes-page.scss']
})
export default class ReportesPage implements OnInit { // Usamos 'export default class' para el lazy loading
// Nota: La ruta pide 'ReportesPage', si el archivo usa 'export default', 
// Angular lo maneja correctamente.

  // Variables para almacenar los datos de los reportes
  cursosPopulares: any[] = [];
  usuariosPorRol: any[] = [];
  instructoresYCursos: any[] = [];
  
  loading: boolean = true;

  // Inyectamos el servicio
  constructor(private reportesService: ReportesService) { }

  ngOnInit(): void {
    this.cargarReportes();
  }

cargarReportes(): void {
    this.loading = true;
    
    // 1. Cargar Cursos Populares
    this.reportesService.getCursosPopulares().subscribe({
        next: (res: any) => { // Agregamos :any para mejor tipado
            // INTENTO 1: Usar res.data (como está ahora)
            // this.cursosPopulares = res.data; 

            // INTENTO 2: Si el backend retorna el array directamente
            // Si res.data es undefined, usa res. Esto es más seguro.
            this.cursosPopulares = res.data || res; 
        },
        error: (err) => console.error('Error al cargar cursos populares:', err)
    });

    // Repetir el patrón para las otras dos peticiones
    this.reportesService.getUsuariosPorRol().subscribe({
        next: (res: any) => {
            this.usuariosPorRol = res.data || res;
        },
        error: (err) => console.error('Error al cargar usuarios por rol:', err)
    });

    this.reportesService.getInstructoresYCursos().subscribe({
        next: (res: any) => {
            this.instructoresYCursos = res.data || res;
            this.loading = false;
        },
        error: (err) => {
            console.error('Error al cargar instructores:', err);
            this.loading = false;
        }
    });
}
}