import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-veterinarios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-extrabold text-slate-800">Staff Veterinario</h2>
          <p class="text-slate-500 font-bold text-sm">Gestión de doctores y especialistas</p>
        </div>
        <button class="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-xl transition-colors">
          + Agregar Profesional
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Veterinario 1 -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
          <img src="/assets/images/avatars/chico.jpg" class="w-20 h-20 rounded-full border-4 border-sky-50 object-cover shadow-sm">
          <div class="flex-1">
            <h3 class="font-extrabold text-slate-800 text-lg">Dr. Vet Peludo</h3>
            <p class="text-slate-500 text-sm font-bold">Médico General y Cirujano</p>
            <div class="mt-2 flex gap-2">
              <span class="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">Activo</span>
              <span class="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold cursor-pointer hover:bg-slate-200">Editar</span>
            </div>
          </div>
        </div>

        <!-- Veterinario 2 -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
          <img src="/assets/images/avatars/chica.jpg" class="w-20 h-20 rounded-full border-4 border-sky-50 object-cover shadow-sm">
          <div class="flex-1">
            <h3 class="font-extrabold text-slate-800 text-lg">Dra. Ana López</h3>
            <p class="text-slate-500 text-sm font-bold">Especialista Feline</p>
            <div class="mt-2 flex gap-2">
              <span class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">De Vacaciones</span>
              <span class="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold cursor-pointer hover:bg-slate-200">Editar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminVeterinariosComponent {}
