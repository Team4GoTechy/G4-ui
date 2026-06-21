export interface ConsultaRequest {
  citaId?: number;
  mascotaId: number;
  veterinarioId: number;
  motivo: string;
  anamnesis: string;
  examenFisico: string;
  diagnostico: string;
  tratamiento: string;
  peso: number;
  temperatura: number;
  frecuenciaCardiaca: number;
  frecuenciaRespiratoria: number;
  trc: string;
  notas?: string;
}

export interface ConsultaResponse {
  id: number;
  citaId?: number;
  mascotaId: number;
  mascotaNombre: string;
  veterinarioId: number;
  veterinarioNombre: string;
  motivo: string;
  anamnesis: string;
  examenFisico: string;
  diagnostico: string;
  tratamiento: string;
  peso: number;
  temperatura: number;
  frecuenciaCardiaca: number;
  frecuenciaRespiratoria: number;
  trc: string;
  notas?: string;
  fechaCreacion: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: any;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
