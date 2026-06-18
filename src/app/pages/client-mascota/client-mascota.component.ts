import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-client-mascota',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-mascota.component.html'
})
export class ClientMascotaComponent {
  private authService = inject(AuthService);
  user$ = this.authService.currentUser$;

  // Generamos un calendario de 120 días (aprox 4 meses)
  // 0: Sano (Verde), 1: Regular (Amarillo), 2: Malestar (Rojo)
  healthCalendar = Array.from({ length: 120 }, () => {
    const random = Math.random();
    if (random > 0.9) return 2; // 10% mal
    if (random > 0.75) return 1; // 15% regular
    return 0; // 75% sano
  });

  getColor(status: number) {
    switch (status) {
      case 2: return 'bg-red-500';
      case 1: return 'bg-yellow-400';
      default: return 'bg-emerald-400';
    }
  }
}
