import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VeterinarioResponse } from '../models/veterinario.model';

@Injectable({
  providedIn: 'root'
})
export class VeterinarioService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/v1/veterinarios';

  listarTodos(): Observable<VeterinarioResponse[]> {
    return this.http.get<VeterinarioResponse[]>(this.API_URL);
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
}
