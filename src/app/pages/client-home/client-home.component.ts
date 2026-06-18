import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full bg-slate-50 p-8 rounded-2xl border border-gray-100 flex flex-col items-center justify-center font-nunito text-center">
      <div *ngIf="user$ | async as user">
        <h1 class="text-4xl font-extrabold text-gray-800 mb-4">Bienvenido, {{ user.nombre }} 👋</h1>
        <p class="text-lg text-gray-500 mb-8">Este es tu panel en blanco. ¡Vamos a construirlo paso a paso!</p>
      </div>
    </div>
  `
})
export class ClientHomeComponent {
  private authService = inject(AuthService);
  user$ = this.authService.currentUser$;
}
