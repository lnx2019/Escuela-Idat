export interface Usuario {
  id: number;
  username: string;
  email: string;
  nombre: string;
  rol: 'administrador' | 'instructor' | 'estudiante';
  activo: number;
}

export interface UsuarioRegistro extends Omit<Usuario, 'id' | 'activo'> {
  password: string;
}

export type UsuarioUpdate = Partial<Omit<Usuario, 'id'>>; 

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserRegistration extends Omit<Usuario, 'id'> {
  password: string;
}

export interface UserUpdate extends Partial<Omit<Usuario, 'id'>> {
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface Inscripcion {
  id: number;
  estudiante_id: number;
  curso_id: number;
  fecha_inscripcion: Date;
  estado: 'activo' | 'completado' | 'cancelado';
  // ⬇️ CAMPOS AGREGADOS PARA VISUALIZACIÓN (Asumimos que el backend los proporciona vía JOIN)
  nombreEstudiante: string;
  nombreCurso: string;
}

export interface Estudiante extends Usuario {
  fecha_registro: Date;
}
