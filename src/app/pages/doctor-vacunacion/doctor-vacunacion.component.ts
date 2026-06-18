import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-vacunacion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-extrabold text-emerald-900">Registro de Vacunación</h2>
          <p class="text-emerald-600 font-bold text-sm">Control de vacunas y desparasitación</p>
        </div>
        <button class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-xl transition-colors">
          + Registrar Vacuna
        </button>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100 bg-emerald-50/30">
          <h3 class="font-extrabold text-emerald-900">Aplicaciones Recientes (Hoy)</h3>
        </div>
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th class="p-4 font-bold">Paciente</th>
              <th class="p-4 font-bold">Vacuna</th>
              <th class="p-4 font-bold">Lote</th>
              <th class="p-4 font-bold">Próxima Dosis</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
              <td class="p-4 font-extrabold text-gray-800">Dandi (Felino)</td>
              <td class="p-4 text-emerald-600 font-bold">Triple Felina</td>
              <td class="p-4 text-gray-500 font-mono text-xs">L-1092A</td>
              <td class="p-4 text-orange-500 font-bold">18 Jun 2027</td>
            </tr>
            <tr class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
              <td class="p-4 font-extrabold text-gray-800">Firulais (Canino)</td>
              <td class="p-4 text-emerald-600 font-bold">Antirrábica</td>
              <td class="p-4 text-gray-500 font-mono text-xs">R-992B</td>
              <td class="p-4 text-orange-500 font-bold">18 Jun 2027</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class DoctorVacunacionComponent {}
