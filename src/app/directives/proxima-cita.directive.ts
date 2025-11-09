// src/app/directives/proxima-cita.directive.ts
import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appProximaCita]',
  standalone: true
})
export class ProximaCitaDirective implements OnInit {
  @Input('appProximaCita') fecha!: string;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const citaDate = new Date(this.fecha);
    const hoy = new Date();
    const diffHoras = (citaDate.getTime() - hoy.getTime()) / (1000 * 60 * 60);

    if (diffHoras >= 0 && diffHoras <= 24) {
      this.el.nativeElement.style.backgroundColor = '#fff3cd'; // amarillo suave
      this.el.nativeElement.style.fontWeight = '600';
    }
  }
}
