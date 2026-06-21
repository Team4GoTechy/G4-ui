import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConsultaRequest, ConsultaResponse, PageResponse } from '../models/consulta.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/v1';

  historialPorMascota(mascotaId: number, page: number = 0, size: number = 20): Observable<PageResponse<ConsultaResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'fechaCreacion,desc'); // Ordenar por las más recientes primero
      
    return this.http.get<PageResponse<ConsultaResponse>>(`${this.API_URL}/mascotas/${mascotaId}/historial-clinico`, { params });
  }

  registrarConsulta(consulta: ConsultaRequest): Observable<ConsultaResponse> {
    return this.http.post<ConsultaResponse>(`${this.API_URL}/consultas`, consulta);
  }

  buscarPorId(id: number): Observable<ConsultaResponse> {
    return this.http.get<ConsultaResponse>(`${this.API_URL}/consultas/${id}`);
  }
}
