import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-clientes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-extrabold text-slate-800">Directorio de Clientes</h2>
          <p class="text-slate-500 font-bold text-sm">Usuarios registrados y sus mascotas</p>
        </div>
        <div class="relative">
          <input type="text" placeholder="Buscar cliente..." class="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm w-64 focus:ring-2 focus:ring-sky-400 outline-none">
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th class="p-4 font-bold">Cliente</th>
              <th class="p-4 font-bold">Email</th>
              <th class="p-4 font-bold">Mascotas (Familia)</th>
              <th class="p-4 font-bold">Última Visita</th>
              <th class="p-4 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
              <td class="p-4 font-extrabold text-slate-800">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold">MH</div>
                  Mauricio Heredia
                </div>
              </td>
              <td class="p-4 text-slate-600">maurih4632...</td>
              <td class="p-4 font-bold text-sky-600">1 (Gato)</td>
              <td class="p-4 text-slate-500">18 Jun 2026</td>
              <td class="p-4 text-sky-500 font-bold cursor-pointer hover:underline">Ver Perfil</td>
            </tr>
            <tr class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
              <td class="p-4 font-extrabold text-slate-800">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">CR</div>
                  Carlos Ruiz
                </div>
              </td>
              <td class="p-4 text-slate-600">carlos&#64;example.com</td>
              <td class="p-4 font-bold text-orange-500">4 (Familia Perruna)</td>
              <td class="p-4 text-slate-500">10 Jun 2026</td>
              <td class="p-4 text-sky-500 font-bold cursor-pointer hover:underline">Ver Perfil</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminClientesComponent {}
