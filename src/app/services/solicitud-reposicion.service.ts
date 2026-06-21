import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SolicitudReposicionRequest, SolicitudReposicionResponse } from '../models/solicitud-reposicion.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitudReposicionService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/solicitudes';

  listarMisSolicitudes(): Observable<SolicitudReposicionResponse[]> {
    return this.http.get<SolicitudReposicionResponse[]>(this.apiUrl);
  }

  listarTodas(): Observable<SolicitudReposicionResponse[]> {
    return this.http.get<SolicitudReposicionResponse[]>(`${this.apiUrl}/todas`);
  }

  obtenerPorId(id: number): Observable<SolicitudReposicionResponse> {
    return this.http.get<SolicitudReposicionResponse>(`${this.apiUrl}/${id}`);
  }

  crear(request: SolicitudReposicionRequest): Observable<SolicitudReposicionResponse> {
    return this.http.post<SolicitudReposicionResponse>(this.apiUrl, request);
  }

  aprobar(id: number, proveedorId: number): Observable<SolicitudReposicionResponse> {
    return this.http.put<SolicitudReposicionResponse>(`${this.apiUrl}/${id}/aprobar?proveedorId=${proveedorId}`, {});
  }

  cancelar(id: number): Observable<SolicitudReposicionResponse> {
    return this.http.put<SolicitudReposicionResponse>(`${this.apiUrl}/${id}/cancelar`, {});
  }

  // --- Ordenes de Compra (Proveedores) ---
  private ordersUrl = 'http://localhost:8080/ordenes-compra';

  listarOrdenes(): Observable<any[]> {
    return this.http.get<any[]>(this.ordersUrl);
  }

  completarOrden(id: number, request: { items: { insumoId: number, cantidad: number, precioUnitario: number }[] }): Observable<any> {
    return this.http.put<any>(`${this.ordersUrl}/${id}/completar`, request);
  }

  cancelarOrden(id: number): Observable<any> {
    return this.http.put<any>(`${this.ordersUrl}/${id}/cancelar`, {});
  }
}
