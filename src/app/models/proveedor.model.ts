export interface Proveedor {
  id: number;
  nombre: string;
  email?: string;
  telefono?: string;
  activo: boolean;
  fechaCreacion?: string;
}

export interface ProveedorRequest {
  nombre: string;
  email?: string;
  telefono?: string;
}
