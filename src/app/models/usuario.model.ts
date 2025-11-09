export type RolUsuario = 'administrador' | 'vendedor' | 'cliente';

export interface Usuario {
  id: number;
  nombre: string;
  usuario: string;
  password: string;
  rol: RolUsuario;
}
