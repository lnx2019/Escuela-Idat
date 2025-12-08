//  * Interceptor global de autenticación: 
//  * 1. Adjunta el token JWT a las cabeceras.
//  * 2. Captura el error 401 (Unauthorized) y fuerza el cierre de sesión/redirección.
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = authService.getToken();
  let request = req;
// 1. Adjuntar el token si existe
  if (token) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
// 2. Manejar la respuesta (Capturar errores 401)
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
// Si el error es 401 y no estamos en la página de login (para evitar loops)
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        
        console.error('ERROR 401 DETECTADO: Token expirado o inválido. Redirigiendo a login.');
        
// Ejecutar el cierre de sesión (limpia localStorage)
        authService.logout(); 
        
        // Redirigir al login
        router.navigate(['/login']); 
      }
// Re-lanzar el error para que sea manejado localmente por los servicios
      return throwError(() => error);
    })
  );
};