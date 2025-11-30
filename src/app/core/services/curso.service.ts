// src/app/core/services/curso.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Curso, CursoRegistro, CursoUpdate } from '../models/curso.model';
import { AuthService } from '../auth/services/auth.service'; // Asegúrate de importar tu AuthService

interface CursosPaginadosResponse {
  data: Curso[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class CursoService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * ⬇️ CORRECCIÓN CLAVE: La petición GET ahora usa el token de autenticación.
   */
  getCursosPaginados(page: number, limit: number): Observable<CursosPaginadosResponse> {
    const url = `${this.apiUrl}/cursos?_page=${page}&_limit=${limit}`;
    
    return this.http.get<Curso[]>(url, { 
      observe: 'response', 
      headers: this.getAuthHeaders() // 🔑 Incluir los headers aquí
    }).pipe(
      map((response: HttpResponse<Curso[]>) => {
        const data = response.body ?? [];
        const totalHeader = response.headers.get('X-Total-Count');
        const total = totalHeader ? parseInt(totalHeader, 10) : data.length;
        return { data, total };
      })
    );
  }

  getCursoById(id: number): Observable<Curso> {
    // Es buena práctica incluir el token aquí también, si la ruta es protegida
    return this.http.get<Curso>(`${this.apiUrl}/cursos/${id}`, { headers: this.getAuthHeaders() });
  }

  crearCurso(curso: CursoRegistro): Observable<Curso> {
    return this.http.post<Curso>(`${this.apiUrl}/cursos`, curso, { headers: this.getAuthHeaders() });
  }

  actualizarCurso(id: number, curso: CursoUpdate): Observable<Curso> {
    return this.http.put<Curso>(`${this.apiUrl}/cursos/${id}`, curso, { headers: this.getAuthHeaders() });
  }

  deleteCurso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cursos/${id}`, { headers: this.getAuthHeaders() });
  }
  
  // Asumimos que esta ruta también es protegida
  getCursosTotalCount(): Observable<number> {
    return this.http.get<Curso[]>(`${this.apiUrl}/cursos`, { headers: this.getAuthHeaders() }).pipe(
      map(cursos => cursos.length)
    );
  }

  listar() {
  return this.http.get<Curso[]>(`${this.apiUrl}/cursos`);
}

}