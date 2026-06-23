export interface VeterinarioResponse {
  id: number;
  usuarioId: number;
  nombreCompleto: string;
  avatar?: string;
  email: string;
  telefono?: string;
  matricula: string;
  especialidad: string;
  bio?: string;
  activo: boolean;
  serviciosHabilitados: string[];
  fechaCreacion?: string;
}

export interface HorarioResponse {
  id?: number;
  diaSemana: number;
  nombreDia?: string;
  horaInicio?: string;
  horaFin?: string;
  trabaja: boolean;
}

export interface BloqueoFechaResponse {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  motivo?: string;
  createdAt?: string;
}
