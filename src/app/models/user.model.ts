export interface User {
  id?: number;
  nombre: string;
  apellido: string;
  edad?: number;
  direccion: string;
  celular: string;
  email: string;
  password?: string;
  tipoMascota: 'Perro' | 'Gato' | string;
  nombreMascota: string;
  cantidadMascotas?: number;
}
