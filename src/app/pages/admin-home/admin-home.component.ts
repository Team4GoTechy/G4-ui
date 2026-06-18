import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      
      <!-- Welcome Header -->
      <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-800">Hola, {{ user?.nombre }} 👋</h1>
          <p class="text-slate-500 font-bold mt-1">Aquí tienes el resumen financiero y operativo de hoy.</p>
        </div>
        <button class="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-colors">
          Generar Reporte
        </button>
      </div>

      <!-- KPIs Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div class="w-12 h-12 bg-sky-100 text-sky-500 rounded-xl flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 class="text-slate-500 font-bold text-sm">Ventas del Día</h3>
          <p class="text-3xl font-extrabold text-slate-800 mt-1">$45,200</p>
          <p class="text-emerald-500 text-xs font-bold mt-2">↑ 12% vs ayer</p>
        </div>
        
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div class="w-12 h-12 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <h3 class="text-slate-500 font-bold text-sm">Pedidos Tienda</h3>
          <p class="text-3xl font-extrabold text-slate-800 mt-1">28</p>
          <p class="text-slate-400 text-xs font-bold mt-2">5 por despachar</p>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div class="w-12 h-12 bg-purple-100 text-purple-500 rounded-xl flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <h3 class="text-slate-500 font-bold text-sm">Clientes Activos</h3>
          <p class="text-3xl font-extrabold text-slate-800 mt-1">1,204</p>
          <p class="text-emerald-500 text-xs font-bold mt-2">↑ 3 nuevos hoy</p>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div class="w-12 h-12 bg-red-100 text-red-500 rounded-xl flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h3 class="text-slate-500 font-bold text-sm">Solicitudes Médicas</h3>
          <p class="text-3xl font-extrabold text-slate-800 mt-1">3</p>
          <p class="text-red-500 text-xs font-bold mt-2">Requieren aprobación</p>
        </div>
      </div>

      <!-- Solicitudes Table -->
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-lg font-extrabold text-slate-800">Solicitudes de Insumos Pendientes</h3>
          <a class="text-sky-500 font-bold text-sm hover:underline cursor-pointer">Ver todas</a>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th class="p-4 font-bold">Veterinario</th>
                <th class="p-4 font-bold">Insumo Solicitado</th>
                <th class="p-4 font-bold">Cantidad</th>
                <th class="p-4 font-bold">Prioridad</th>
                <th class="p-4 font-bold">Acción</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                <td class="p-4 font-bold text-slate-800">Dr. Vet Peludo</td>
                <td class="p-4 text-slate-600">Vacuna Antirrábica (Caja)</td>
                <td class="p-4 font-bold">5 Cajas</td>
                <td class="p-4"><span class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">Alta</span></td>
                <td class="p-4">
                  <button class="bg-slate-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-sky-500 transition-colors">Aprobar Compra</button>
                </td>
              </tr>
              <tr class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                <td class="p-4 font-bold text-slate-800">Dra. Ana López</td>
                <td class="p-4 text-slate-600">Anestesia Local</td>
                <td class="p-4 font-bold">2 Frascos</td>
                <td class="p-4"><span class="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">Media</span></td>
                <td class="p-4">
                  <button class="bg-slate-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-sky-500 transition-colors">Aprobar Compra</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class AdminHomeComponent {
  private authService = inject(AuthService);
  user = this.authService.getCurrentUser();
}
