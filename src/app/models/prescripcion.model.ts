export interface DetallePrescripcionRequest {
  insumoId: number;
  dosis: string;
  frecuencia: string;
  duracion: string;
  viaAdministracion?: string;
  instrucciones?: string;
}

export interface PrescripcionRequest {
  consultaId: number;
  observaciones?: string;
  detalles: DetallePrescripcionRequest[];
}

export interface DetallePrescripcionResponse {
  id: number;
  insumoId: number;
  insumoNombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  viaAdministracion: string;
  instrucciones: string;
}

export interface PrescripcionResponse {
  id: number;
  consultaId: number;
  veterinarioId: number;
  veterinarioNombre: string;
  fecha: string;
  observaciones: string;
  detalles: DetallePrescripcionResponse[];
}
