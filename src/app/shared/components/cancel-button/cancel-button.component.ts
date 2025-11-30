import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cancel-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cancel-button.component.html', // Enlace al nuevo archivo HTML
  styleUrls: ['./cancel-button.component.scss'] // Enlace al nuevo archivo SCSS
})
export class CancelButtonComponent {
  // Texto personalizable del botón (por defecto 'Cancelar')
  @Input() text: string = 'Cancelar';
  
  // Clase adicional que el componente padre quiera agregar
  @Input() customClass: string = '';
  
  // Ruta a la que se debe navegar al cancelar (por defecto el dashboard)
  @Input() navigateTo: string = '/dashboard';

  constructor(private router: Router) { }

  /**
   * Navega a la ruta especificada en la propiedad 'navigateTo' al hacer clic.
   */
  onCancelClick(): void {
    this.router.navigate([this.navigateTo]);
  }
}