import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { DynamicResponse } from '../models/dynamic-response.model';

export interface Inscripcion {
  id: number;
  estudiante_id: number;
  curso_id: number;
  fecha_inscripcion: string;
  estado: 'activo' | 'completado' | 'cancelado';
  estudiante_nombre: string;
  curso_titulo: string;
}

export interface InscripcionRegistro {
  estudiante_id: number;
  curso_id: number;
  estudiante_nombre?: string;
  curso_titulo?: string;
}

export interface InscripcionesPaginadasResponse {
  data: Inscripcion[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class InscripcionService {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  crearInscripcion(payload: InscripcionRegistro): Observable<Inscripcion> {
    return this.http.post<DynamicResponse<Inscripcion>>(
      `${this.apiUrl}/inscripciones`,
      payload,
      { headers: this.getHeaders() }
    ).pipe(map(res => res.data));
  }

  getInscripcionesPaginadas(page: number, limit: number): Observable<InscripcionesPaginadasResponse> {
    const params = { page, limit };
    return this.http.get<DynamicResponse<any>>(
      `${this.apiUrl}/inscripciones/paginado`,
      { params, headers: this.getHeaders() }
    ).pipe(map(res => ({
      data: res.data.inscripciones ?? [],
      total: res.data.total ?? 0
    })));
  }

  getInscripcionById(id: number): Observable<Inscripcion> {
    return this.http.get<DynamicResponse<Inscripcion>>(
      `${this.apiUrl}/inscripciones/${id}`,
      { headers: this.getHeaders() }
    ).pipe(map(res => res.data));
  }

  actualizarEstado(id: number, estado: 'activo' | 'completado' | 'cancelado'): Observable<Inscripcion> {
    return this.http.patch<DynamicResponse<Inscripcion>>(
      `${this.apiUrl}/inscripciones/${id}`,
      { estado },
      { headers: this.getHeaders() }
    ).pipe(map(res => res.data));
  }

  eliminarInscripcion(id: number): Observable<any> {
    return this.http.delete<DynamicResponse<any>>(
      `${this.apiUrl}/inscripciones/${id}`,
      { headers: this.getHeaders() }
    );
  }

  getInscripcionesCount(): Observable<number> {
    return this.http.get<DynamicResponse<{ count: number }>>(
      `${this.apiUrl}/inscripciones/count`,
      { headers: this.getHeaders() }
    ).pipe(map(res => res.data.count));
  }

  validarDuplicado(estudiante_id: number, curso_id: number): Observable<boolean> {
    return this.http.get<DynamicResponse<{ existe: boolean }>>(
      `${this.apiUrl}/inscripciones/validar`,
      { params: { estudiante_id, curso_id }, headers: this.getHeaders() }
    ).pipe(map(res => res.data.existe));
  }

  listar(): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(`${this.apiUrl}/inscripciones`);
  }

  fRegistro(): Observable<Inscripcion[]> {
   return this.http.get<Inscripcion[]>(`${this.apiUrl}/inscripciones/fregistro`);
 }

}
