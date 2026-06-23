import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VeterinarioResponse, HorarioResponse, BloqueoFechaResponse } from '../models/veterinario.model';

@Injectable({
  providedIn: 'root'
})
export class VeterinarioService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/v1/veterinarios';

  listarActivos(): Observable<VeterinarioResponse[]> {
    return this.http.get<VeterinarioResponse[]>(this.API_URL);
  }

  listarTodos(): Observable<VeterinarioResponse[]> {
    return this.http.get<VeterinarioResponse[]>(`${this.API_URL}/todos`);
  }

  obtenerPorId(id: number): Observable<VeterinarioResponse> {
    return this.http.get<VeterinarioResponse>(`${this.API_URL}/${id}`);
  }

  crear(dto: any): Observable<VeterinarioResponse> {
    return this.http.post<VeterinarioResponse>(this.API_URL, dto);
  }

  actualizar(id: number, dto: any): Observable<VeterinarioResponse> {
    return this.http.put<VeterinarioResponse>(`${this.API_URL}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  cambiarEstado(id: number, activo: boolean): Observable<VeterinarioResponse> {
    return this.http.patch<VeterinarioResponse>(`${this.API_URL}/${id}/activo`, { activo });
  }

  listarHorarios(id: number): Observable<HorarioResponse[]> {
    return this.http.get<HorarioResponse[]>(`${this.API_URL}/${id}/horarios`);
  }

  actualizarHorarios(id: number, horarios: HorarioResponse[]): Observable<HorarioResponse[]> {
    return this.http.put<HorarioResponse[]>(`${this.API_URL}/${id}/horarios`, { horarios });
  }

  listarBloqueos(id: number): Observable<BloqueoFechaResponse[]> {
    return this.http.get<BloqueoFechaResponse[]>(`${this.API_URL}/${id}/bloqueos`);
  }

  crearBloqueo(id: number, bloqueo: { fechaInicio: string; fechaFin: string; motivo: string }): Observable<BloqueoFechaResponse> {
    return this.http.post<BloqueoFechaResponse>(`${this.API_URL}/${id}/bloqueos`, bloqueo);
  }

  eliminarBloqueo(id: number, bloqueoId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}/bloqueos/${bloqueoId}`);
  }
}
