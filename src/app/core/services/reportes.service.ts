// src/app/services/reportes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = 'http://localhost:3000/reportes'; // Base URL para tus endpoints de reportes

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el reporte de los cursos más populares (con más inscripciones).
   * GET /api/reportes/cursos-populares
   */
  getCursosPopulares(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cursos-populares`);
  }

  /**
   * Obtiene el conteo de usuarios agrupados por rol.
   * GET /api/reportes/usuarios-por-rol
   */
  getUsuariosPorRol(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios-por-rol`);
  }

  /**
   * Obtiene el listado de instructores y el número de cursos que imparten.
   * GET /api/reportes/instructores-cursos
   */
  getInstructoresYCursos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/instructores-cursos`);
  }
}