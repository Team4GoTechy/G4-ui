import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-solicitudes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-extrabold text-emerald-900">Solicitar Insumos</h2>
          <p class="text-emerald-600 font-bold text-sm">Pide reabastecimiento a Administración</p>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-6">
        <!-- Formulario -->
        <div class="md:w-1/3 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit">
          <h3 class="font-extrabold text-gray-800 mb-4">Nueva Solicitud</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Insumo Necesario</label>
              <input type="text" placeholder="Ej. Jeringas 5ml" class="w-full bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-400">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Cantidad</label>
              <input type="number" placeholder="Ej. 10" class="w-full bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-400">
            </div>
            <button class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-md transition-colors mt-2">
              Enviar Solicitud
            </button>
          </div>
        </div>

        <!-- Historial -->
        <div class="md:w-2/3 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-100 bg-emerald-50/30">
            <h3 class="font-extrabold text-emerald-900">Historial de Solicitudes</h3>
          </div>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th class="p-4 font-bold">Insumo</th>
                <th class="p-4 font-bold">Cant.</th>
                <th class="p-4 font-bold">Fecha</th>
                <th class="p-4 font-bold">Estado</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                <td class="p-4 font-extrabold text-gray-800">Vacuna Antirrábica</td>
                <td class="p-4 font-bold text-gray-600">5 Cajas</td>
                <td class="p-4 text-gray-500">Hoy</td>
                <td class="p-4"><span class="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">Pendiente</span></td>
              </tr>
              <tr class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                <td class="p-4 font-extrabold text-gray-800">Gasas Esterilizadas</td>
                <td class="p-4 font-bold text-gray-600">20 Paquetes</td>
                <td class="p-4 text-gray-500">Ayer</td>
                <td class="p-4"><span class="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">Aprobado</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class DoctorSolicitudesComponent {}
