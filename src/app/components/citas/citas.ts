import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cita, EstadoCita } from '../../models/cita.model';
import { CitasService } from '../../services/citas.service';
import { NavegacionService } from '../../services/navegacion.service';
import { firstValueFrom } from 'rxjs';
import { Mascota } from '../../models/mascota.model';
import { MascotaService } from '../../services/mascota.service';
import { UsuarioService } from '../../services/usuarios.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.html',
  styleUrls: ['./citas.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // ⚡ Solo se renderiza cuando cambia el modelo
})
export class CitasComponent implements OnInit {
  nombreUsuario: string = 'Cargando...';
  nuevaCita: Cita = this.crearCitaVacia();
  estados: EstadoCita[] = ['pendiente', 'confirmada', 'completada', 'cancelada'];
  editando = false;
  citaSeleccionada: Cita | null = null;
  cargando = false;
  esAdministrador = false; 
  mascotas: Mascota[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private citasService: CitasService,
    private mascotaService: MascotaService,
    private usuarioService: UsuarioService,
    private nav: NavegacionService,
    private cdr: ChangeDetectorRef
  ) {}

  //Crear citas
    private crearCitaVacia(): Cita {
    return {
      nombreMascota: '',
      duenio: '',
      telefono: '',
      fecha: '',
      hora: '',
      servicio: '',
      estado: 'pendiente',
    };
  }

  //Guardar cita
  async guardarCita(): Promise<void> {
    if (!this.validarFormulario()) return;

    this.cargando = true;
    this.cdr.markForCheck();

    try {
      const citaGuardada = this.editando
        ? await firstValueFrom(
            this.citasService.actualizarCita(this.citaSeleccionada!.id!, this.nuevaCita)
          )
        : await firstValueFrom(this.citasService.crearCita(this.nuevaCita));

      this.citaSeleccionada = citaGuardada;
      this.resetFormulario();
    } catch (err) {
      console.error('❌ Error al guardar cita:', err);
    } finally {
      this.cargando = false;
      this.cdr.detectChanges(); // 🔁 fuerza actualización mínima
    }
  }

  //Editar
  editarCita(cita: Cita): void {
    this.editando = true;
    this.citaSeleccionada = cita;
    this.nuevaCita = { ...cita };
    this.cdr.markForCheck();
  }

  //eliminar
  async eliminarCita(id: number): Promise<void> {
    if (!confirm('¿Seguro que deseas eliminar esta cita?')) return;

    this.cargando = true;
    this.cdr.markForCheck();

    try {
      await firstValueFrom(this.citasService.eliminarCita(id));
      this.citaSeleccionada = null;
      this.resetFormulario();
    } catch (err) {
      console.error('❌ Error al eliminar cita:', err);
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  // ♻ Limpia formulario y estado de edición
  resetFormulario(): void {
    this.nuevaCita = this.crearCitaVacia();
    this.editando = false;
    this.cdr.markForCheck();
  }

  private validarFormulario(): boolean {
    const c = this.nuevaCita;
    if (!c.nombreMascota || !c.duenio || !c.telefono || !c.fecha || !c.hora) {
      alert('⚠️ Por favor, completa todos los campos obligatorios.');
      return false;
    }
    return true;
  }

  async ngOnInit(): Promise<void> {
    this.mascotas = await firstValueFrom(this.mascotaService.obtenerMascotas());
    // 👇 1. Verifica si hay un parámetro 'id' en la URL
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.editando = true;
      const id = +idParam; // Convierte a número

      try {
        // 👇 2. Carga la cita por ID
        const cita = await firstValueFrom(this.citasService.obtenerCitaPorId(id));
        this.nuevaCita = { ...cita };
        this.citaSeleccionada = cita;

        // 👇 3. Carga las mascotas para el select
        this.mascotas = await firstValueFrom(this.mascotaService.obtenerMascotas());
        
        // 👇 4. Si la cita tiene nombreMascota, dispara la selección para llenar dueño/teléfono
        if (this.nuevaCita.nombreMascota) {
          this.onMascotaSeleccionada(this.nuevaCita.nombreMascota);
        }
      } catch (err) {
        console.error('Error al cargar cita para edición:', err);
        alert('No se pudo cargar la cita. Redirigiendo...');
        this.nav.regresar('/');
      }
    } 
    const usuario = this.usuarioService.getUsuarioSincrono();
    this.esAdministrador = usuario?.rol === 'administrador';
    this.nombreUsuario = usuario?.nombre || 'Invitado';

    this.cdr.markForCheck();
  }

  // ⚡ Al seleccionar una mascota del menú desplegable
onMascotaSeleccionada(nombreMascota: string) {
  const mascotaSeleccionada = this.mascotas.find(m => m.nombreMascota === nombreMascota);

  if (mascotaSeleccionada) {
    // 👇 Mapeamos el OBJETO Mascota → CAMPOS PLANOS de Cita
    this.nuevaCita.nombreMascota = mascotaSeleccionada.nombreMascota;
    this.nuevaCita.duenio = mascotaSeleccionada.duenio.nombre;      // string
    this.nuevaCita.telefono = mascotaSeleccionada.duenio.telefono;  // string
  }
}
  regresar(): void {
    this.nav.regresar('/');
  }


}
