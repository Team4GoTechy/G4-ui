import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-inventario',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-extrabold text-emerald-900">Inventario del Consultorio</h2>
          <p class="text-emerald-600 font-bold text-sm">Stock interno de uso veterinario</p>
        </div>
        <button routerLink="/doctor/solicitudes" class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-xl transition-colors shadow-md">
          Pedir Reposición
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <h3 class="font-extrabold text-gray-800 text-lg">Vacunas Antirrábicas</h3>
          <p class="text-sm text-gray-500 mb-4">Refrigerador 1</p>
          <div class="mt-auto">
            <span class="text-3xl font-black text-emerald-600">12</span> <span class="text-gray-400 font-bold text-sm">Dosis restantes</span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col border-l-4 border-l-orange-400">
          <h3 class="font-extrabold text-gray-800 text-lg">Anestesia Local (Frascos)</h3>
          <p class="text-sm text-gray-500 mb-4">Gabinete A</p>
          <div class="mt-auto">
            <span class="text-3xl font-black text-orange-500">2</span> <span class="text-gray-400 font-bold text-sm">Frascos restantes</span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col border-l-4 border-l-red-500">
          <h3 class="font-extrabold text-gray-800 text-lg">Jeringas 5ml</h3>
          <p class="text-sm text-gray-500 mb-4">Almacén General</p>
          <div class="mt-auto">
            <span class="text-3xl font-black text-red-500">0</span> <span class="text-gray-400 font-bold text-sm">Sin Stock</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DoctorInventarioComponent {}
