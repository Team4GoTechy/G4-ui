import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-doctor-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      
      <!-- Welcome Header -->
      <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex justify-between items-center relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
        <div class="relative z-10">
          <h1 class="text-3xl font-extrabold text-emerald-900">Buen día, {{ user?.nombre }} 🩺</h1>
          <p class="text-emerald-600 font-bold mt-1">Hoy tienes 4 pacientes agendados. ¡A salvar vidas!</p>
        </div>
        <div class="relative z-10 text-right">
          <p class="text-sm font-bold text-gray-500 uppercase tracking-wider">Fecha de Hoy</p>
          <p class="text-xl font-extrabold text-emerald-800">18 de Junio, 2026</p>
        </div>
      </div>

      <!-- Schedule Table -->
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-50/30">
          <h3 class="text-lg font-extrabold text-emerald-900">Agenda Médica del Día</h3>
          <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">4 Turnos Pendientes</span>
        </div>
        
        <div class="p-4">
          <div class="space-y-3">
            
            <!-- Turno 1 -->
            <div class="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:border-emerald-200 transition-colors">
              <div class="bg-gray-100 p-3 rounded-xl text-center min-w-[80px]">
                <p class="text-emerald-600 font-extrabold text-lg">09:00</p>
                <p class="text-gray-400 text-xs font-bold uppercase">Mañana</p>
              </div>
              <div class="flex-1">
                <h4 class="font-extrabold text-gray-800 text-lg">Dandi (Gato)</h4>
                <p class="text-sm text-gray-500">Cliente: Mauricio Heredia - <span class="text-emerald-600 font-bold">Control de Vacunación</span></p>
              </div>
              <button class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md transition-colors">
                Iniciar Consulta
              </button>
            </div>

            <!-- Turno 2 -->
            <div class="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:border-emerald-200 transition-colors">
              <div class="bg-gray-100 p-3 rounded-xl text-center min-w-[80px]">
                <p class="text-emerald-600 font-extrabold text-lg">11:30</p>
                <p class="text-gray-400 text-xs font-bold uppercase">Mañana</p>
              </div>
              <div class="flex-1">
                <h4 class="font-extrabold text-gray-800 text-lg">Firulais (Perro)</h4>
                <p class="text-sm text-gray-500">Cliente: Carlos Ruiz - <span class="text-orange-500 font-bold">Problema Digestivo</span></p>
              </div>
              <button class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md transition-colors">
                Iniciar Consulta
              </button>
            </div>

            <!-- Turno 3 -->
            <div class="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:border-emerald-200 transition-colors">
              <div class="bg-gray-100 p-3 rounded-xl text-center min-w-[80px]">
                <p class="text-emerald-600 font-extrabold text-lg">15:00</p>
                <p class="text-gray-400 text-xs font-bold uppercase">Tarde</p>
              </div>
              <div class="flex-1">
                <h4 class="font-extrabold text-gray-800 text-lg">Luna (Perro)</h4>
                <p class="text-sm text-gray-500">Cliente: Sofía López - <span class="text-emerald-600 font-bold">Chequeo General</span></p>
              </div>
              <button class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md transition-colors">
                Iniciar Consulta
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  `
})
export class DoctorHomeComponent {
  private authService = inject(AuthService);
  user = this.authService.getCurrentUser();
}
