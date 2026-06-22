import { VeterinarioResponse } from './veterinario.model';

export interface ServicioResponse {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  veterinarios: VeterinarioResponse[];
}

export interface ServicioRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  veterinarioIds: number[];
}
