import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { NotificacionResponse } from '../models/notificacion.model';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/v1/notificaciones';

  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  listar(): Observable<NotificacionResponse[]> {
    return this.http.get<NotificacionResponse[]>(this.API_URL);
  }

  marcarLeido(id: number): Observable<NotificacionResponse> {
    return this.http.patch<NotificacionResponse>(`${this.API_URL}/${id}/leer`, {}).pipe(
      tap(() => this.actualizarCantidadSinLeer())
    );
  }

  cantidadSinLeer(): Observable<{ cantidad: number }> {
    return this.http.get<{ cantidad: number }>(`${this.API_URL}/sin-leer/cantidad`);
  }

  actualizarCantidadSinLeer(): void {
    this.cantidadSinLeer().subscribe({
      next: (res) => {
        this.unreadCountSubject.next(res.cantidad || 0);
      },
      error: (err) => {
        console.error('Error al actualizar contador de notificaciones', err);
      }
    });
  }
}
