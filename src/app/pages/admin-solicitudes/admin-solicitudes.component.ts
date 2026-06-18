import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-solicitudes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-extrabold text-slate-800">Bandeja de Solicitudes</h2>
          <p class="text-slate-500 font-bold text-sm">Pedidos de insumos del equipo médico</p>
        </div>
        <div class="flex gap-2">
          <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">3 Pendientes</span>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th class="p-4 font-bold">Fecha</th>
              <th class="p-4 font-bold">Solicitante</th>
              <th class="p-4 font-bold">Insumo</th>
              <th class="p-4 font-bold">Cantidad</th>
              <th class="p-4 font-bold">Estado</th>
              <th class="p-4 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
              <td class="p-4 text-slate-500 font-bold">Hoy, 09:30</td>
              <td class="p-4 font-bold text-slate-800">Dr. Vet Peludo</td>
              <td class="p-4 text-slate-600">Vacuna Antirrábica</td>
              <td class="p-4 font-extrabold text-slate-800">5 Cajas</td>
              <td class="p-4"><span class="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">Pendiente</span></td>
              <td class="p-4">
                <button class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">Aprobar</button>
                <button class="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ml-2">Rechazar</button>
              </td>
            </tr>
            <tr class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
              <td class="p-4 text-slate-500 font-bold">Ayer, 18:00</td>
              <td class="p-4 font-bold text-slate-800">Dra. Ana López</td>
              <td class="p-4 text-slate-600">Jeringas 5ml</td>
              <td class="p-4 font-extrabold text-slate-800">10 Cajas</td>
              <td class="p-4"><span class="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">Aprobado</span></td>
              <td class="p-4 text-slate-400 font-bold text-xs">Sin acciones</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminSolicitudesComponent {}
