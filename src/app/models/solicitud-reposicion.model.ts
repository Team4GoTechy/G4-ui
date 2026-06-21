export interface DetalleSolicitudItem {
  insumoId: number;
  cantidadSolicitada: number;
}

export interface SolicitudReposicionRequest {
  detalles: DetalleSolicitudItem[];
}

export interface DetalleSolicitudResponse {
  insumoId: number;
  nombreInsumo: string;
  cantidadSolicitada: number;
}

export interface SolicitudReposicionResponse {
  id: number;
  veterinarioId: number;
  nombreVeterinario: string;
  estado: string; // 'PENDIENTE' | 'APROBADO' | 'CANCELADO'
  fechaCreacion: string;
  detalles: DetalleSolicitudResponse[];
}
