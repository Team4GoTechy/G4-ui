import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-notificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-notificaciones.component.html'
})
export class ClientNotificacionesComponent {
  notificaciones = [
    { id: 1, tipo: 'whatsapp', titulo: 'Recordatorio de Turno', mensaje: 'Se ha enviado un mensaje a tu WhatsApp recordando tu turno mañana con el Dr. Ramiro López.', fecha: 'Hace 2 horas', leido: false },
    { id: 2, tipo: 'email', titulo: 'Comprobante de Compra', mensaje: 'Te hemos enviado por Email el recibo de tu última compra (Alimento DogChow).', fecha: 'Ayer', leido: true },
    { id: 3, tipo: 'sistema', titulo: '¡Bienvenido a PetHouse!', mensaje: 'Gracias por registrar a Dandi en nuestro sistema.', fecha: 'Hace 1 semana', leido: true }
  ];

  marcarLeido(notif: any) {
    notif.leido = true;
  }
}
