import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServicioResponse, ServicioRequest } from '../models/servicio.model';
import { VeterinarioResponse } from '../models/veterinario.model';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/v1/servicios';

  listarTodos(): Observable<ServicioResponse[]> {
    return this.http.get<ServicioResponse[]>(this.API_URL);
  }

  crear(dto: ServicioRequest): Observable<ServicioResponse> {
    return this.http.post<ServicioResponse>(this.API_URL, dto);
  }

  actualizar(id: number, dto: ServicioRequest): Observable<ServicioResponse> {
    return this.http.put<ServicioResponse>(`${this.API_URL}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  obtenerTodosLosVeterinarios(): Observable<VeterinarioResponse[]> {
    return this.http.get<VeterinarioResponse[]>(`${this.API_URL}/veterinarios`);
  }
}
