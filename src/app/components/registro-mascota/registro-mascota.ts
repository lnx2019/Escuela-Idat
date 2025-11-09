import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MascotaService } from '../../services/mascota.service';
import { Mascota } from '../../models/mascota.model';
import { NavegacionService } from '../../services/navegacion.service';

@Component({
  selector: 'app-registro-mascota',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-mascota.html',
  styleUrls: ['./registro-mascota.scss'],
})
export class RegistroMascotaComponent implements OnInit {
  registroExitoso = false;
  mascotaForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private mascotaService: MascotaService,
    private nav: NavegacionService,
  ) {}

  //Inicialización del formulario
  ngOnInit(): void {
    this.mascotaForm = this.fb.group({
      nombreMascota: ['', [Validators.required, Validators.minLength(2)]],
      especie: ['', Validators.required],
      raza: [''],
      edad: [0, [Validators.required, Validators.min(0)]],
      duenio: this.fb.group({
        nombre: ['', Validators.required],
        telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
        email: ['', [Validators.required, Validators.email]],
      }),
    });
  }

  //Lógica para guardar la mascota
  onSubmit(): void {
  if (this.mascotaForm.valid) {
    // Obtenemos las mascotas actuales desde el servicio
    this.mascotaService.obtenerMascotas().subscribe({
      next: (mascotasExistentes) => {
        // Calculamos el siguiente ID numérico
        const nextId = mascotasExistentes.length > 0
          ? Math.max(...mascotasExistentes.map(m => Number(m.id))) + 1
          : 1;

        // Construimos la nueva mascota con ID
        const nuevaMascota: Mascota = {
          id: nextId,
          ...this.mascotaForm.value
        };

        // Registramos la mascota
        this.mascotaService.registrarMascota(nuevaMascota).subscribe({
          next: () => {
            console.log('✅ Mascota registrada correctamente en db.json');
            this.registroExitoso = true;
            setTimeout(() => (this.registroExitoso = false), 3000);
            this.mascotaForm.reset();
          },
          error: (err) => console.error('❌ Error al guardar:', err),
        });
      },
      error: (err) => console.error('❌ Error al obtener mascotas:', err),
    });
  } else {
    this.mascotaForm.markAllAsTouched();
  }
}

  regresar(): void {
    this.nav.regresar('/');
  }

}

