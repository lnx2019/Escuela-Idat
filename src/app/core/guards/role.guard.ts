import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  const rolesPermitidos = route.data?.['roles'] as string[];

  if (user && rolesPermitidos.includes(user.rol)) {
    return true;
  }

  alert('Acceso no autorizado');
  router.navigate(['/dashboard']);
  return false;
};
