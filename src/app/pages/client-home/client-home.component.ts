import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-[60vh] bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center font-nunito text-center max-w-2xl mx-auto my-8 animate-fade-in">
      <div *ngIf="user$ | async as user" class="flex flex-col items-center">
        
        <!-- Foto de Perfil del Alumno -->
        <div class="w-28 h-28 rounded-full border-4 border-sky-100 shadow-md overflow-hidden mb-6 flex items-center justify-center bg-gray-50">
          <img [src]="getAvatarUrl(user.avatar)" alt="Foto de perfil" class="w-full h-full object-cover">
        </div>

        <h1 class="text-3xl font-black text-gray-800 mb-2">¡Bienvenido, {{ user.nombre }}! 👋</h1>
        
        <!-- Nombre de la Mascota -->
        <div *ngIf="user.nombreMascota" class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 text-sky-600 font-extrabold text-sm border border-sky-100 mb-6">
          <span>{{ user.tipoMascota === 'Gato' ? '🐱' : '🐶' }}</span>
          <span>Dueño de {{ user.nombreMascota }}</span>
        </div>

        <p class="text-gray-500 font-bold max-w-md">
          Estamos felices de tenerte de vuelta. Aquí puedes gestionar los turnos, consultar el historial médico y comprar productos para tu mascota.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-8">
          <a routerLink="/cliente/turnos" class="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-extrabold py-3 px-6 rounded-2xl transition-all shadow-md">
            📅 Reservar Turno
          </a>
          <a routerLink="/cliente/mascota" class="flex items-center justify-center gap-2 border-2 border-sky-500 hover:bg-sky-50 text-sky-600 font-extrabold py-3 px-6 rounded-2xl transition-all">
            🐾 Ver Expediente
          </a>
        </div>
        
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ClientHomeComponent {
  private authService = inject(AuthService);
  user$ = this.authService.currentUser$;

  getAvatarUrl(avatar?: string): string {
    if (!avatar) {
      return '/assets/images/avatars/chico.jpg';
    }
    if (avatar.startsWith('http') || avatar.startsWith('/')) {
      return avatar;
    }
    return `/assets/images/avatars/${avatar}`;
  }
}
