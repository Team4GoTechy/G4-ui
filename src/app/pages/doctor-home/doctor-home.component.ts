import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-doctor-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <!-- Welcome Header -->
      <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex justify-between items-center relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
        <div class="relative z-10">
          <h1 class="text-3xl font-extrabold text-emerald-900">Buen día, {{ user?.nombre }} 🩺</h1>
          <p class="text-emerald-600 font-bold mt-1">¡Que tengas una excelente jornada médica!</p>
        </div>
        <div class="relative z-10 text-right">
          <p class="text-sm font-bold text-gray-500 uppercase tracking-wider">Fecha de Hoy</p>
          <p class="text-xl font-extrabold text-emerald-800">{{ hoy | date:'longDate' }}</p>
        </div>
      </div>
    </div>
  `
})
export class DoctorHomeComponent {
  private authService = inject(AuthService);
  user = this.authService.getCurrentUser();
  hoy = new Date();
}
