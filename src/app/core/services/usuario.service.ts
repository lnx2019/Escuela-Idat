import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// ⬇️ Necesario para las cabeceras HTTP y el token
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { isPlatformBrowser } from '@angular/common';
import { map } from 'rxjs/operators';
import { DynamicResponse } from '../models/dynamic-response.model';
// ⬇️ CLAVE: Importamos el servicio de autenticación
import { AuthService } from '../auth/services/auth.service'; 


//--------------------------------------------------------------//
interface UsuariosPaginadosResponse {
    data: Usuario[];
    total: number;
}
//--------------------------------------------------------------//

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000';
  // ⚠️ Eliminamos la variable isBrowser, el AuthService se encarga de esto.

  private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
  usuarios$ = this.usuariosSubject.asObservable();

  constructor(
    private http: HttpClient,
    // ⬇️ CLAVE: Inyectamos el AuthService
    private authService: AuthService,
    // ⚠️ Mantenemos PLATFORM_ID solo si es estrictamente necesario, pero lo quitamos del constructor si no se usa.
    @Inject(PLATFORM_ID) platformId: Object 
  ) {}


  // ⬇️ CLAVE: Método auxiliar para obtener las cabeceras con el JWT Token
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      // Formato estándar para enviar el token
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
  // ⬆️ FIN CLAVE

  //--------------------------------------------------------------//
  // 🔑 Aplicamos las cabeceras a todas las peticiones protegidas (CRUD y Listados)

  getInstructores(): Observable<Usuario[]> {
    const url = `${this.apiUrl}/usuarios?rol=instructor&activo=1`;
    return this.http.get<Usuario[]>(url, { headers: this.getAuthHeaders() });
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`, { headers: this.getAuthHeaders() });
  }

  getUsuarioActivoCount(): Observable<number> {
    return this.http
      .get<DynamicResponse<{ count: number }>>(
        `${this.apiUrl}/usuarios/activos/count`, 
        { headers: this.getAuthHeaders() } // Aplicado
      )
      .pipe(map(response => response.data.count));
  }

  getUsuariosPaginados(page: number, limit: number): Observable<UsuariosPaginadosResponse> {
    const params = { page: page.toString(), limit: limit.toString() };

    return this.http
      .get<any>(`${this.apiUrl}/usuarios/paginado`, { params, headers: this.getAuthHeaders() }) // Aplicado
      .pipe(
        map(res => ({
          data: res?.data ?? [],
          total: res?.total ?? 0
        }))
      );
  }

  getUsuarioById(id: number): Observable<Usuario> {
    return this.http
      .get<Usuario>(`${this.apiUrl}/usuarios/${id}`, { headers: this.getAuthHeaders() }) // Aplicado
      .pipe(map((res: any) => res.data ?? res));
  }

  crearUsuario(usuario: any) {
    return this.http.post<any>(`${this.apiUrl}/usuarios`, usuario, { headers: this.getAuthHeaders() }).pipe( // Aplicado
      map(res => res.data ?? res.usuario ?? res.user ?? res[0] ?? res)
    );
  }

  actualizarUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http
      .put(`${this.apiUrl}/usuarios/${id}`, usuario, { headers: this.getAuthHeaders() }) // Aplicado
      .pipe(map((res: any) => res.data ?? res));
  }

  deleteUsuario(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/usuarios/${id}`,
      { headers: this.getAuthHeaders() } // Aplicado
    );
  }

  getUsuariosTotalCount(): Observable<number> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`, { headers: this.getAuthHeaders() }).pipe( // Aplicado
      map(usuarios => usuarios.length)
    );
  }

  getEstudiantes() {
      return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios?rol=estudiante`);
  }

  listar() {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
  }

}