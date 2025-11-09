export class Duenio {
  constructor(
    public nombre: string,
    public telefono: string,
    public direccion: string
  ) {}

  esTelefonoValido(): boolean {
    return /^[0-9]{9}$/.test(this.telefono);
  }

  obtenerContacto(): string {
    return `${this.nombre} - Tel: ${this.telefono}`;
  }
}
