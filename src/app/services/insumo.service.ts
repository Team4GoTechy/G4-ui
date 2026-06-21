import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Insumo, InsumoRequest, StockInsumoResponse, MovimientoInsumoResponse, ConsumoRequest } from '../models/insumo.model';
@Injectable({
  providedIn: 'root'
})
export class InsumoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/insumos';

  listar(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Insumo> {
    return this.http.get<Insumo>(`${this.apiUrl}/${id}`);
  }

  crear(request: InsumoRequest): Observable<Insumo> {
    return this.http.post<Insumo>(this.apiUrl, request);
  }

  actualizar(id: number, request: InsumoRequest): Observable<Insumo> {
    return this.http.put<Insumo>(`${this.apiUrl}/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  listarStock(): Observable<StockInsumoResponse[]> {
    return this.http.get<StockInsumoResponse[]>(`${this.apiUrl}/stock`);
  }

  obtenerStockPorId(id: number): Observable<StockInsumoResponse> {
    return this.http.get<StockInsumoResponse>(`${this.apiUrl}/stock/${id}`);
  }

  obtenerHistorialStock(id: number): Observable<MovimientoInsumoResponse[]> {
    return this.http.get<MovimientoInsumoResponse[]>(`${this.apiUrl}/stock/${id}/historial`);
  }

  registrarConsumo(request: ConsumoRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/consumo`, request);
  }
}
