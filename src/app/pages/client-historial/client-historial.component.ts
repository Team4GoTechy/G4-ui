import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-historial.component.html'
})
export class ClientHistorialComponent {
  compras = [
    { fecha: '15/06/2026', productos: 'Alimento DogChow 15kg', pago: 'Transferencia', estado: 'Entregado', color: 'bg-emerald-100 text-emerald-700' },
    { fecha: '02/05/2026', productos: 'Collar Antipulgas Seresto', pago: 'Efectivo', estado: 'Entregado', color: 'bg-emerald-100 text-emerald-700' },
    { fecha: '18/06/2026', productos: 'Juguete Hueso Goma', pago: 'Transferencia', estado: 'En preparación', color: 'bg-yellow-100 text-yellow-700' }
  ];
}
