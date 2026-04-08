// src/app/core/models/curso.model.ts

export interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  // ⬇️ Cambios a snake_case para coincidir con la DB
  instructor_id: number; // Campo requerido por la DB
  duracion_horas: number; // Cambio de nombre
  estado: 'activo' | 'inactivo' | 'archivado'; // Cambio de 'activo: boolean' a 'estado: enum'
  fecha_creacion: string; // Cambio de nombre
  
  // Si usabas 'instructor' para mostrar el nombre, puedes eliminarlo de aquí si no
  // está en la DB, o manejarlo como un campo de solo lectura en el front.
  // Lo eliminamos para simplificar el payload.
}

/**
 * Payload para la creación (POST).
 * Se omiten 'id' y 'fecha_creacion'.
 */
export interface CursoRegistro extends Omit<Curso, 'id' | 'fecha_creacion'> {}

/**
 * Payload para la actualización (PUT/PATCH).
 * Se omiten 'id'. Todos los campos son opcionales.
 */
export interface CursoUpdate extends Partial<Omit<Curso, 'id' | 'fecha_creacion'>> {
  // Aseguramos que 'fecha_creacion' pueda ser incluido si es PUT total.
  fecha_creacion?: string; 
}