// src/app/shared/pipes/role-display.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforma el nombre de un rol a un formato amigable con ícono.
 * Ejemplo: 'administrador' -> 'ADMINISTRADOR 👑'
 * 'usuario'       -> 'USUARIO'
 */
@Pipe({
  name: 'roleDisplay',
  standalone: true // Se define como standalone, como el resto de tu proyecto.
})
export class RoleDisplayPipe implements PipeTransform {

  // El método 'transform' recibe el valor (rol: string) y retorna el valor transformado (string).
  transform(role: string | undefined): string {
    if (!role) return '';

    const lowerRole = role.toLowerCase();

    switch (lowerRole) {
      case 'administrador':
        return 'ADMINISTRADOR 👑';
      case 'usuario':
        return 'USUARIO';
      case 'profesor':
        // Asumiendo otros roles que puedas tener
        return 'PROFESOR 🧑‍🏫'; 
      default:
        // Capitaliza la primera letra si no se reconoce
        return lowerRole.charAt(0).toUpperCase() + lowerRole.slice(1);
    }
  }

}