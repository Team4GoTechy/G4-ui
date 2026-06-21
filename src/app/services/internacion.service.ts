import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InternacionRequest, InternacionResponse, EvolucionRequest, EvolucionResponse } from '../models/internacion.model';

@Injectable({
  providedIn: 'root'
})
export class InternacionService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/v1/internaciones';

  ingresar(data: InternacionRequest): Observable<InternacionResponse> {
    return this.http.post<InternacionResponse>(this.API_URL, data);
  }

  listarActivas(): Observable<InternacionResponse[]> {
    return this.http.get<InternacionResponse[]>(`${this.API_URL}/activas`);
  }

  registrarEvolucion(internacionId: number, data: EvolucionRequest): Observable<EvolucionResponse> {
    return this.http.post<EvolucionResponse>(`${this.API_URL}/${internacionId}/evolucion`, data);
  }

  darDeAlta(internacionId: number, indicacionesAlta: string): Observable<InternacionResponse> {
    return this.http.patch<InternacionResponse>(`${this.API_URL}/${internacionId}/alta`, { indicacionesAlta });
  }

  listarPendientesReingreso(): Observable<InternacionResponse[]> {
    return this.http.get<InternacionResponse[]>(`${this.API_URL}/pendientes-reingreso`);
  }

  obtenerPorMascota(mascotaId: number): Observable<InternacionResponse[]> {
    return this.http.get<InternacionResponse[]>(`${this.API_URL}/mascota/${mascotaId}`);
  }

  solicitarReingreso(mascotaId: number, notasCliente: string): Observable<InternacionResponse> {
    return this.http.post<InternacionResponse>(`${this.API_URL}/solicitar-reingreso`, { mascotaId, notasCliente });
  }

  confirmarReingreso(internacionId: number, jaulaId: string): Observable<InternacionResponse> {
    return this.http.patch<InternacionResponse>(`${this.API_URL}/${internacionId}/confirmar-reingreso?jaulaId=${encodeURIComponent(jaulaId)}`, {});
  }
}
