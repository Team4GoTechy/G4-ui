import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-extrabold text-slate-800">Catálogo de Servicios</h2>
          <p class="text-slate-500 font-bold text-sm">Servicios veterinarios y estética</p>
        </div>
        <button class="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-xl transition-colors">
          + Nuevo Servicio
        </button>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th class="p-4 font-bold">Servicio</th>
              <th class="p-4 font-bold">Precio Base</th>
              <th class="p-4 font-bold">Duración Est.</th>
              <th class="p-4 font-bold">Tipo</th>
              <th class="p-4 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
              <td class="p-4 font-extrabold text-slate-800">Consulta General</td>
              <td class="p-4 font-bold text-sky-600">$8,000</td>
              <td class="p-4 text-slate-600">30 Minutos</td>
              <td class="p-4"><span class="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-bold">Médico</span></td>
              <td class="p-4 text-sky-500 font-bold cursor-pointer hover:underline">Editar</td>
            </tr>
            <tr class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
              <td class="p-4 font-extrabold text-slate-800">Baño y Peluquería</td>
              <td class="p-4 font-bold text-sky-600">$15,000</td>
              <td class="p-4 text-slate-600">1 Hora</td>
              <td class="p-4"><span class="bg-sky-100 text-sky-600 px-3 py-1 rounded-full text-xs font-bold">Estética</span></td>
              <td class="p-4 text-sky-500 font-bold cursor-pointer hover:underline">Editar</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminServiciosComponent {}
