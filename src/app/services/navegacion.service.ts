import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavegacionService {
  constructor(private location: Location, private router: Router) {}

  // ✅ Regresa a la página anterior o a una ruta por defecto
  regresar(rutaAlternativa: string = '/'): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate([rutaAlternativa]);
    }
  }

  // ✅ Navega a una ruta específica
  navegarA(ruta: string): void {
    this.router.navigate([ruta]);
  }
  logout(ruta: string): void {
    this.router.navigate([ruta]);
  }
}
