// usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { switchMap, tap, catchError, map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/usuarios';
  private sesionUrl = 'http://localhost:3000/sesion/1';

  // 👇 BehaviorSubject para mantener el estado actual del usuario
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  private sesionCargada = new BehaviorSubject<boolean>(false);
  public sesionCargada$ = this.sesionCargada.asObservable();

  constructor(private http: HttpClient) {
    // 👇 Al iniciar, carga la sesión automáticamente
    // this.cargarSesion();
  }

  login(usuario: string, password: string): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(this.apiUrl).pipe(
      switchMap(usuarios => {
        const user = usuarios.find(u => u.usuario === usuario && u.password === password);
        if (!user) return throwError(() => 'Credenciales inválidas');

        const sesionData = {
          id: 1,
          usuarioId: user.id,
          nombre: user.nombre,
          rol: user.rol
        };

        return this.http.put(this.sesionUrl, sesionData).pipe(
          tap(() => this.usuarioSubject.next(user)), // 👈 Actualiza el estado global
          map(() => user)
        );
      }),
      catchError(() => of(null))
    );
  }

  logout(): Observable<any> {
    const sesionLimpia = { id: 1, usuarioId: null, nombre: null, rol: null };
    return this.http.put(this.sesionUrl, sesionLimpia).pipe(
      tap(() => this.usuarioSubject.next(null)) // 👈 Limpia el estado
    );
  }

  // 👇 Método síncrono para obtener el valor actual (útil en guards)
  getUsuarioSincrono(): Usuario | null {
    return this.usuarioSubject.value;
  }
}

