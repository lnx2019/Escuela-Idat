export type EstadoCita = 'pendiente' | 'confirmada' | 'completada' | 'cancelada';

export interface Cita {
  id?: number;
  nombreMascota: string;
  duenio: string;
  telefono: string;
  fecha: string;     // YYYY-MM-DD
  hora: string;      // HH:mm
  servicio: string;  // ← Cambiado de "sintomas" a "servicio"
  estado: EstadoCita;
}
