import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule], // necesario para *ngFor y pipes
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'], // corregido de styleUrl
  providers: [DatePipe] // inyectamos DatePipe
})
export class DashboardPage implements OnInit {
  metrics: any = {};
  actividadReciente: any[] = [];

  constructor(
    private dash: DashboardService,
    private router: Router,
    public datePipe: DatePipe // inyectado correctamente
  ) {}

  ngOnInit() {
    this.dash.obtenerMétricas().subscribe(data => {
      this.metrics = data;
      this.actividadReciente = data.actividadReciente;
    });
  }

  go(ruta: string) {
    this.router.navigate([ruta]);
  }
}
