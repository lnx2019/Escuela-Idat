import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mascota } from '../models/mascota.model';


@Injectable({ providedIn: 'root' })
export class MascotaService {
  private apiUrl = 'http://localhost:3000/mascotas';

  constructor(private http: HttpClient) {}

  /** Obtiene todas las mascotas */
  obtenerMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.apiUrl);
  }

  /** Registra una nueva mascota (ID incluido si ya se genera en el componente) */
  registrarMascota(mascota: Omit<Mascota, 'id'> | Mascota): Observable<Mascota> {
    return this.http.post<Mascota>(this.apiUrl, mascota);
  }

  /** Opcional: obtener una mascota por ID */
  obtenerMascotaPorId(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.apiUrl}/${id}`);
  }

  /** Opcional: actualizar una mascota existente */
  actualizarMascota(mascota: Mascota): Observable<Mascota> {
    return this.http.put<Mascota>(`${this.apiUrl}/${mascota.id}`, mascota);
  }

  /** Opcional: eliminar una mascota por ID */
  eliminarMascota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
