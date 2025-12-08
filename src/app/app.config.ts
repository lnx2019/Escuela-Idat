
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor'; // Importamos el interceptor funcional

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // 🔑 Única línea necesaria para registrar el interceptor
    provideHttpClient(withInterceptors([authInterceptor])), 
  ]
};
