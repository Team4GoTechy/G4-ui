import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CitaRequest, CitaResponse } from '../models/cita.model';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/v1/citas';

  crearCita(cita: any): Observable<CitaResponse> {
    return this.http.post<CitaResponse>(this.API_URL, cita);
  }

  obtenerAgendaDia(veterinarioId: number, fecha: string): Observable<CitaResponse[]> {
    let params = new HttpParams()
      .set('veterinarioId', veterinarioId.toString())
      .set('fecha', fecha);
    return this.http.get<CitaResponse[]>(this.API_URL, { params });
  }

  obtenerAgendaMes(veterinarioId: number, mes: string): Observable<CitaResponse[]> {
    let params = new HttpParams()
      .set('veterinarioId', veterinarioId.toString())
      .set('mes', mes);
    return this.http.get<CitaResponse[]>(`${this.API_URL}/agenda/mes`, { params });
  }

  buscarPorId(id: number): Observable<CitaResponse> {
    return this.http.get<CitaResponse>(`${this.API_URL}/${id}`);
  }

  actualizarEstado(id: number, estado: string, motivo?: string): Observable<CitaResponse> {
    const body: any = { estado };
    if (motivo) {
      body.motivo = motivo;
    }
    return this.http.patch<CitaResponse>(`${this.API_URL}/${id}/estado`, body);
  }

  obtenerMisCitas(): Observable<CitaResponse[]> {
    return this.http.get<CitaResponse[]>(`${this.API_URL}/mis-citas`);
  }

  obtenerTodasLasCitas(veterinarioId: number): Observable<CitaResponse[]> {
    let params = new HttpParams().set('veterinarioId', veterinarioId.toString());
    return this.http.get<CitaResponse[]>(`${this.API_URL}/todas`, { params });
  }

  pagarCita(id: number): Observable<CitaResponse> {
    return this.http.patch<CitaResponse>(`${this.API_URL}/${id}/pagar`, {});
  }
}
