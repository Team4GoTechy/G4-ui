import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MascotaResponse } from '../models/mascota.model';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/v1/mascotas';

  obtenerTodas(): Observable<MascotaResponse[]> {
    return this.http.get<MascotaResponse[]>(this.API_URL);
  }

  obtenerMisMascotas(): Observable<MascotaResponse[]> {
    return this.http.get<MascotaResponse[]>(`${this.API_URL}/mis-mascotas`);
  }

  obtenerHistorialClinico(mascotaId: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${mascotaId}/historial-clinico`);
  }

  obtenerPrescripciones(mascotaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/${mascotaId}/prescripciones`);
  }
}
