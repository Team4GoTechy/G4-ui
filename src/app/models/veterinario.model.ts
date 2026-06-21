export interface VeterinarioResponse {
  id: number;
  usuarioId: number;
  nombreUsuario: string;
  matricula: string;
  especialidad: string;
  bio: string;
  activo: boolean;
  avatar?: string;
}
