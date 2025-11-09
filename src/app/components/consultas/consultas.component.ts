import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Cita } from '../../models/cita.model';
import { CitasService } from '../../services/citas.service';
import { finalize, map } from 'rxjs/operators';
import { EstadoCitaPipe } from '../../pipes/estado-cita.pipe';
import { NavegacionService } from '../../services/navegacion.service';
import { UsuarioService } from '../../services/usuarios.service'; 
import { firstValueFrom, Observable } from 'rxjs';

@Component({
  selector: 'app-consultas',
  standalone: true,
  // imports: [CommonModule, FormsModule, NgbModule],
   imports: [CommonModule, FormsModule, NgbModule, EstadoCitaPipe],
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.scss'],
})
export class ConsultasComponent implements OnInit {
  consultas: Cita[] = [];
  todasLasConsultas: Cita[] = [];
  filtroMascota = '';
  cargando = false;
  esAdministrador$!: Observable<boolean>; // 👈 Observable reactivo
  citaSeleccionada: Cita | null = null;

  constructor(
    private citasService: CitasService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private nav: NavegacionService,
    private usuarioService: UsuarioService,
  ) {}

ngOnInit(): void {
    // 👇 Deriva un Observable booleano directamente del usuario$
    this.esAdministrador$ = this.usuarioService.usuario$.pipe(
      map(usuario => usuario?.rol === 'administrador' || false)
    );
    this.cargarConsultas();
  }

  //obtener el estado las citas 
  getEstadoClass(estado: string): string {
    const badgeClasses: Record<string, string> = {
      pendiente: 'bg-warning text-dark',
      confirmada: 'bg-primary text-white',
      completada: 'bg-success text-white',
      cancelada: 'bg-danger text-white'
    };
    return badgeClasses[estado] || 'bg-secondary text-white';
  }

  //Carga las citas grabadas en la base de datos
  cargarConsultas(): void {
    this.cargando = true;
    this.citasService.obtenerCitas()
      .pipe(finalize(() => {
        this.cargando = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (data) => {
          this.todasLasConsultas = data;
          this.consultas = [...data];
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al cargar citas:', err),
      });
  }

  //buscar o filtra una cita especifica
  buscar(): void {
    const filtro = this.filtroMascota.trim().toLowerCase();
    this.consultas = filtro
      ? this.todasLasConsultas.filter(c =>
          c.nombreMascota?.toLowerCase().includes(filtro)
        )
      : [...this.todasLasConsultas];
    this.cdr.detectChanges();
  }

  // Abrir modal y pasar cita
  abrirModal(modalContent: TemplateRef<any>, cita: Cita) {
    this.citaSeleccionada = cita;
    this.modalService.open(modalContent, { centered: true, size: 'lg' });
  }

  //EDITAR
  editarCita(cita: Cita): void {
    this.nav.navegarA(`/citas/editar/${cita.id}`);
  }

    //ELIMINAR
  async eliminarCita(id: number | undefined): Promise<void> {
    if (id === undefined) return;

    if (!confirm('¿Seguro que deseas eliminar esta cita?')) return;

    this.cargando = true;
    this.cdr.markForCheck();

    try {
      await firstValueFrom(this.citasService.eliminarCita(id));
      this.cargarConsultas(); // recargar la lista
    } catch (err) {
      console.error('Error al eliminar cita:', err);
      alert('No se pudo eliminar la cita.');
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }

  }
  regresar(): void {
    this.nav.regresar('/');
  }

}
