import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-extrabold text-slate-800">Gestión de Productos</h2>
          <p class="text-slate-500 font-bold text-sm">Control de inventario de la tienda</p>
        </div>
        <button class="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-xl transition-colors">
          + Nuevo Producto
        </button>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th class="p-4 font-bold">Producto</th>
              <th class="p-4 font-bold">Categoría</th>
              <th class="p-4 font-bold">Precio</th>
              <th class="p-4 font-bold">Stock</th>
              <th class="p-4 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
              <td class="p-4 font-extrabold text-slate-800">Royal Canin Gatos 1.5kg</td>
              <td class="p-4 text-slate-600">Alimentos</td>
              <td class="p-4 font-bold text-sky-600">$18,500</td>
              <td class="p-4"><span class="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">45 Uds.</span></td>
              <td class="p-4 text-sky-500 font-bold cursor-pointer hover:underline">Editar</td>
            </tr>
            <tr class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
              <td class="p-4 font-extrabold text-slate-800">Correa Retráctil Flexi</td>
              <td class="p-4 text-slate-600">Accesorios</td>
              <td class="p-4 font-bold text-sky-600">$12,000</td>
              <td class="p-4"><span class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">2 Uds. (Bajo)</span></td>
              <td class="p-4 text-sky-500 font-bold cursor-pointer hover:underline">Editar</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminProductosComponent {}
