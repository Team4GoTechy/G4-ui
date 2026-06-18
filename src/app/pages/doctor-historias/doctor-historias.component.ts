import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-historias',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-extrabold text-emerald-900">Historias Clínicas</h2>
          <p class="text-emerald-600 font-bold text-sm">Búsqueda y registro de pacientes</p>
        </div>
        <div class="relative">
          <input type="text" placeholder="Buscar paciente (ej. Dandi)..." class="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm w-64 focus:ring-2 focus:ring-emerald-400 outline-none">
        </div>
      </div>

      <!-- Ficha Clínica (Simulada para Dandi) -->
      <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8">
        
        <div class="md:w-1/3 flex flex-col items-center border-r border-gray-100 pr-8">
          <div class="w-32 h-32 bg-emerald-50 rounded-full border-4 border-emerald-100 flex items-center justify-center mb-4 p-4">
            <img src="/assets/images/pets/gato.png" class="w-full h-full object-contain">
          </div>
          <h3 class="text-2xl font-extrabold text-emerald-900">Dandi</h3>
          <p class="text-emerald-600 font-bold">Felino • Macho • 3 años</p>
          <div class="mt-4 bg-gray-50 rounded-xl p-4 w-full text-center">
            <p class="text-xs text-gray-500 font-bold uppercase">Propietario</p>
            <p class="font-extrabold text-gray-800">Mauricio Heredia</p>
          </div>
        </div>

        <div class="md:w-2/3 space-y-6">
          <h4 class="font-extrabold text-gray-800 text-lg border-b border-gray-100 pb-2">Última Consulta</h4>
          <div class="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 relative">
            <div class="absolute top-4 right-4 text-emerald-600 font-bold text-sm">Hace 1 mes</div>
            <p class="font-bold text-gray-800 mb-2">Motivo: Control General y Vacunación</p>
            <p class="text-sm text-gray-600 mb-4">El paciente Dandi se presenta en buen estado general. Peso: 4.2kg. Se procede a aplicar vacuna Séxtuple y se receta desparasitante interno.</p>
            <div class="flex gap-2">
              <span class="bg-white border border-emerald-200 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">Receta Emitida</span>
              <span class="bg-white border border-emerald-200 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">Vacuna Aplicada</span>
            </div>
          </div>
          
          <button class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-colors w-full">
            + Redactar Nueva Consulta (Hoy)
          </button>
        </div>

      </div>
    </div>
  `
})
export class DoctorHistoriasComponent {}
