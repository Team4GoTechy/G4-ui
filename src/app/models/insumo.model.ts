export interface Insumo {
  id: number;
  nombre: string;
  descripcion?: string;
  unidadMedida: string;
  precioUnitario: number;
  stockMinimo: number;
  activo: boolean;
  fechaCreacion?: string;
}

export interface InsumoRequest {
  nombre: string;
  descripcion?: string;
  unidadMedida: string;
  precioUnitario: number;
  stockMinimo: number;
}

export interface StockInsumoResponse {
  insumoId: number;
  nombreInsumo: string;
  cantidadActual: number;
  stockMinimo: number;
  alertaStock: boolean;
  unidadMedida: string;
  precioUnitario: number;
}

export interface MovimientoInsumoResponse {
  id: number;
  insumoId: number;
  nombreInsumo: string;
  tipo: string; // 'ENTRADA' | 'SALIDA'
  cantidad: number;
  precioUnitario: number;
  fecha: string;
  descripcion?: string;
  referenciaId?: number;
}

export interface ConsumoItem {
  insumoId: number;
  cantidad: number;
}

export interface ConsumoRequest {
  descripcion: string;
  items: ConsumoItem[];
}
