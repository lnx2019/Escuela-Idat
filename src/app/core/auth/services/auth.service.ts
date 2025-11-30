// src/app/core/services/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from  'jwt-decode';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';

export interface LoginResponse {
  token: string;
  user: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private isBrowser: boolean;

  private readonly TOKEN_KEY = 'token';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.isAuthenticatedSubject.next(this.hasValidToken());
    }
  }

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (this.isBrowser) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
        }
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  register(userData: { username: string; password: string; email: string; nombre: string; rol: string }) {
    return this.http.post(`${this.apiUrl}/usuarios`, userData).pipe(
      tap(response => console.log('Usuario registrado:', response))
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.isAuthenticatedSubject.next(false);
    // Redirige al login inmediatamente al cerrar sesión
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  // Hago pública la comprobación de token para que los guards la utilicen sin hacks.
    public hasValidToken(): boolean {
      const token = this.getToken();
      if (!token) return false;

      try {
        const decoded: any = jwtDecode(token);
        return decoded.exp > Date.now() / 1000;
      } catch {
        return false;
      }
    }

  getCurrentUser(): Usuario | null {
    if (!this.isBrowser) return null;

    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      const currentUser: Usuario = {
        id: decoded.sub || decoded.id,
        username: decoded.username,
        email: decoded.email,
        nombre: decoded.nombre || 'Nombre no disponible',
        rol: decoded.rol,
        activo: decoded.activo,
      };
      return currentUser;
    } catch (error) {
      return null;
    }
  }
}
