export interface MascotaResponse {
  id: number;
  nombre: string;
  especie?: string;
  tipo?: string;
  raza?: string;
  fechaNacimiento?: string;
  sexo: string;
  peso?: number;
  clienteId?: number;
  clienteNombre?: string;
}
