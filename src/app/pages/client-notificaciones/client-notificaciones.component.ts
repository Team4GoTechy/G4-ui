import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../services/notificacion.service';
import { NotificacionResponse } from '../../models/notificacion.model';

@Component({
  selector: 'app-client-notificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-notificaciones.component.html'
})
export class ClientNotificacionesComponent implements OnInit {
  private notificacionService = inject(NotificacionService);

  notificaciones: NotificacionResponse[] = [];
  loading = false;

  ngOnInit() {
    this.cargarNotificaciones();
  }

  cargarNotificaciones() {
    this.loading = true;
    this.notificacionService.listar().subscribe({
      next: (data) => {
        this.notificaciones = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar las notificaciones', err);
        this.loading = false;
      }
    });
  }

  marcarLeido(notif: NotificacionResponse) {
    if (notif.leido) return;

    this.notificacionService.marcarLeido(notif.id).subscribe({
      next: (updated) => {
        notif.leido = true;
        // El BehaviorSubject del servicio actualizará automáticamente el sidebar
      },
      error: (err) => {
        console.error('Error al marcar notificación como leída', err);
      }
    });
  }
}
