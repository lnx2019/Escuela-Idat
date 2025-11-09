import { Duenio } from './duenio.model';

export interface Mascota {
  id: number;
  nombreMascota: string;
  especie: string;
  raza?: string;
  edad: number;
  duenio: Duenio;
}
