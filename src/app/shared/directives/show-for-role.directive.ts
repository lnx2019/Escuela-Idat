// src/app/shared/directives/show-for-role.directive.ts

import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service'; // Asumiendo tu AuthService
import { Subscription } from 'rxjs';

/**
 * Directiva estructural que muestra un elemento solo si el usuario actual
 * tiene al menos uno de los roles especificados.
 * Uso: <button *appShowForRole="'administrador'">...</button>
 * Uso con múltiples roles: <div *appShowForRole="['administrador', 'profesor']">...</div>
 */
@Directive({
  selector: '[appShowForRole]',
  standalone: true,
})
export class ShowForRoleDirective implements OnInit, OnDestroy {
  // El rol o array de roles requerido para mostrar el elemento
  @Input() appShowForRole: string | string[] = [];
  
  private subscription!: Subscription;

  constructor(
    private templateRef: TemplateRef<any>, // Referencia al contenido que queremos mostrar/ocultar
    private viewContainer: ViewContainerRef, // Contenedor donde se insertará/removerá la vista
    private authService: AuthService // Servicio de autenticación para obtener el rol del usuario
  ) {}

  ngOnInit(): void {
    // Escucha el cambio de estado de autenticación (ej. cuando el usuario inicia sesión)
    this.subscription = this.authService.user$.subscribe(user => {
      this.updateView();
    });

    // Ejecuta la lógica inicial
    this.updateView();
  }

  updateView(): void {
    const requiredRoles = Array.isArray(this.appShowForRole)
      ? this.appShowForRole.map(r => r.toLowerCase())
      : [this.appShowForRole.toLowerCase()];

    // Verifica si el usuario actual cumple con el rol
    const hasPermission = this.authService.hasRole(requiredRoles); 
    this.viewContainer.clear(); 
    if (hasPermission) {
      // Si tiene permiso, muestra el elemento (adjunta la vista al contenedor)
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      // Si no tiene permiso, oculta el elemento (limpia el contenedor)
      this.viewContainer.clear();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}