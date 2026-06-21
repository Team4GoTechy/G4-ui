export interface CitaRequest {
  mascotaId: number;
  veterinarioId: number;
  tipoCita: string;
  fechaHora: string;
  duracionMinutos: number;
  notas: string;
}

export interface CitaResponse {
  id: number;
  mascotaId: number;
  mascotaNombre?: string;
  clienteId?: number;
  clienteNombre?: string;
  veterinarioId: number;
  tipoCita: string;
  fechaHora: string;
  duracionMinutos: number;
  estado: string;
  notas: string;
}
