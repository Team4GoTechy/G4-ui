import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedor, ProveedorRequest } from '../models/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/proveedores';

  listar(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}/${id}`);
  }

  crear(request: ProveedorRequest): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, request);
  }

  actualizar(id: number, request: ProveedorRequest): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.apiUrl}/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
