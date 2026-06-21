import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrescripcionRequest, PrescripcionResponse } from '../models/prescripcion.model';

@Injectable({
  providedIn: 'root'
})
export class PrescripcionService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/v1/consultas';

  verPrescripcion(consultaId: number): Observable<PrescripcionResponse> {
    return this.http.get<PrescripcionResponse>(`${this.API_URL}/${consultaId}/prescripcion`);
  }

  crearPrescripcion(consultaId: number, prescripcion: PrescripcionRequest): Observable<PrescripcionResponse> {
    return this.http.post<PrescripcionResponse>(`${this.API_URL}/${consultaId}/prescripcion`, prescripcion);
  }
}
