export interface InternacionRequest {
  mascotaId: number;
  veterinarioId: number;
  motivo: string;
  jaulaId: string;
  notas?: string;
}

export interface EvolucionRequest {
  observacion: string;
  peso: number;
  temperatura: number;
}

export interface EvolucionResponse {
  id: number;
  internacionId: number;
  veterinarioId: number;
  veterinarioNombre: string;
  fechaRegistro: string;
  observacion: string;
  peso: number;
  temperatura: number;
}

export interface InternacionResponse {
  id: number;
  mascotaId: number;
  mascotaNombre: string;
  veterinarioId: number;
  veterinarioNombre: string;
  motivo: string;
  fechaIngreso: string;
  fechaAlta?: string;
  jaulaId: string;
  estado: string; // 'ACTIVA' | 'DADA_DE_ALTA'
  notas?: string;
  evoluciones: EvolucionResponse[];
}
