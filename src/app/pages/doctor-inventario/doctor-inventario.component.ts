import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InsumoService } from '../../services/insumo.service';
import { StockInsumoResponse, MovimientoInsumoResponse, ConsumoRequest } from '../../models/insumo.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-doctor-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="space-y-6 font-nunito animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h2 class="text-2xl font-extrabold text-emerald-950 flex items-center gap-2">
            <span>📦</span> Inventario del Consultorio
          </h2>
          <p class="text-emerald-600 font-bold text-sm">Control de stock de uso clínico y veterinario</p>
        </div>
        <div class="flex flex-wrap gap-3 w-full md:w-auto">
          <button (click)="abrirConsumoModal()" class="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 px-6 rounded-xl transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0 text-sm">
            ⚙️ Registrar Consumo
          </button>
          <button routerLink="/doctor/solicitudes" class="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-2.5 px-6 rounded-xl transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0 text-sm">
            ➕ Pedir Reposición
          </button>
        </div>
      </div>

      <!-- Barra de Filtros y Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Buscador -->
        <div class="lg:col-span-2 relative bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <input type="text" [(ngModel)]="filtroNombre" placeholder="Buscar por nombre de insumo..."
                 class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-bold text-emerald-950 placeholder:text-gray-400">
          <span class="absolute left-7 text-gray-400">🔍</span>
        </div>

        <!-- Stat Alertas -->
        <div class="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-4">
          <div class="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center text-xl font-bold shrink-0">⚠️</div>
          <div>
            <p class="text-xs font-bold text-amber-600 uppercase">Stock Bajo</p>
            <p class="text-2xl font-black text-amber-950">{{ countStockBajo }}</p>
          </div>
        </div>

        <!-- Stat Agotados -->
        <div class="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-4">
          <div class="w-12 h-12 bg-red-500 text-white rounded-xl flex items-center justify-center text-xl font-bold shrink-0">❌</div>
          <div>
            <p class="text-xs font-bold text-red-600 uppercase">Agotados</p>
            <p class="text-2xl font-black text-red-950">{{ countAgotados }}</p>
          </div>
        </div>
      </div>

      <!-- Grid de Insumos -->
      <div *ngIf="cargando" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>

      <div *ngIf="!cargando && stockFiltrado.length === 0" class="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
        <span class="text-5xl block mb-4">📦</span>
        <h3 class="text-xl font-extrabold text-gray-800">No se encontraron insumos</h3>
        <p class="text-gray-500 font-medium mt-1">Intenta con otra palabra o solicita nuevos medicamentos.</p>
      </div>

      <div *ngIf="!cargando && stockFiltrado.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let item of stockFiltrado" 
             (click)="verDetalle(item)"
             class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col hover:shadow-lg hover:border-emerald-100 transition-all duration-300 cursor-pointer relative group overflow-hidden">
          
          <!-- Decoración lateral según estado -->
          <div class="absolute left-0 top-0 bottom-0 w-1.5 transition-all"
               [ngClass]="{
                 'bg-red-500': item.cantidadActual === 0,
                 'bg-amber-400': item.cantidadActual > 0 && item.alertaStock,
                 'bg-emerald-500': !item.alertaStock
               }">
          </div>

          <div class="flex justify-between items-start mb-3 pl-2">
            <div>
              <h3 class="font-extrabold text-gray-800 text-lg group-hover:text-emerald-700 transition-colors">{{ item.nombreInsumo }}</h3>
              <p class="text-xs text-gray-400 font-medium mt-0.5">Unidad: {{ item.unidadMedida }}</p>
            </div>
            <span class="text-xs font-black px-2.5 py-1 rounded-full uppercase"
                  [ngClass]="{
                    'bg-red-50 text-red-600': item.cantidadActual === 0,
                    'bg-amber-50 text-amber-600': item.cantidadActual > 0 && item.alertaStock,
                    'bg-emerald-50 text-emerald-600': !item.alertaStock
                  }">
              {{ item.cantidadActual === 0 ? 'Sin Stock' : (item.alertaStock ? 'Stock Bajo' : 'Normal') }}
            </span>
          </div>

          <div class="mt-6 flex justify-between items-end pl-2">
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase">Cantidad Disponible</p>
              <p class="text-3xl font-black transition-colors"
                 [ngClass]="{
                   'text-red-500': item.cantidadActual === 0,
                   'text-amber-500': item.cantidadActual > 0 && item.alertaStock,
                   'text-emerald-700': !item.alertaStock
                 }">
                {{ item.cantidadActual }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-xs font-bold text-gray-400 uppercase">Precio Unit.</p>
              <p class="font-black text-gray-800 text-sm">$\{{ item.precioUnitario | number:'1.2-2' }}</p>
            </div>
          </div>

          <!-- Hover footer helper -->
          <div class="border-t border-gray-50 mt-4 pt-3 pl-2 flex justify-between items-center text-xs font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Ver historial de movimientos</span>
            <span>👁️</span>
          </div>
        </div>
      </div>

      <!-- Modal de Historial y Detalle -->
      <div *ngIf="isDetalleModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" (click)="cerrarDetalle()"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-zoom-in">
          
          <!-- Header -->
          <div class="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
            <div>
              <h3 class="text-xl font-extrabold">{{ itemSeleccionado?.nombreInsumo }}</h3>
              <p class="text-slate-400 text-sm font-semibold">Historial de movimientos de stock</p>
            </div>
            <button (click)="cerrarDetalle()" class="text-slate-400 hover:text-white p-2 bg-slate-800 rounded-full transition-colors">
              ❌
            </button>
          </div>

          <!-- Historial -->
          <div class="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
            <!-- Stats rápidas -->
            <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-gray-100 text-sm">
              <div>
                <p class="text-gray-400 font-bold">Stock Actual</p>
                <p class="text-xl font-black text-slate-800">{{ itemSeleccionado?.cantidadActual }} {{ itemSeleccionado?.unidadMedida }}</p>
              </div>
              <div>
                <p class="text-gray-400 font-bold">Alerta Stock Bajo</p>
                <p class="text-xl font-black text-slate-800">{{ itemSeleccionado?.stockMinimo }} {{ itemSeleccionado?.unidadMedida }}</p>
              </div>
            </div>

            <div>
              <h4 class="font-extrabold text-slate-800 mb-3 text-base">Movimientos Registrados</h4>
              
              <div *ngIf="cargandoHistorial" class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
              </div>

              <div *ngIf="!cargandoHistorial && historial.length === 0" class="text-center py-8 text-gray-500 font-semibold">
                No hay movimientos registrados para este insumo.
              </div>

              <div *ngIf="!cargandoHistorial && historial.length > 0" class="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-gray-100">
                      <th class="p-4">Fecha</th>
                      <th class="p-4">Tipo</th>
                      <th class="p-4 text-right">Cant.</th>
                      <th class="p-4">Detalle / Motivo</th>
                    </tr>
                  </thead>
                  <tbody class="text-xs font-semibold divide-y divide-gray-50">
                    <tr *ngFor="let mov of historial" class="hover:bg-slate-50/50 transition-colors">
                      <td class="p-4 text-gray-500">{{ mov.fecha | date:'dd/MM/yyyy HH:mm' }}</td>
                      <td class="p-4">
                        <span class="px-2 py-0.5 rounded text-[10px] font-black"
                              [ngClass]="mov.tipo === 'ENTRADA' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'">
                          {{ mov.tipo }}
                        </span>
                      </td>
                      <td class="p-4 text-right font-bold"
                          [ngClass]="mov.tipo === 'ENTRADA' ? 'text-emerald-600' : 'text-red-500'">
                        {{ mov.tipo === 'ENTRADA' ? '+' : '-' }}{{ mov.cantidad }}
                      </td>
                      <td class="p-4 text-gray-600 max-w-[200px] truncate" [title]="mov.descripcion || ''">
                        {{ mov.descripcion || 'Sin descripción' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Registrar Consumo -->
      <div *ngIf="isConsumoModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" (click)="cerrarConsumoModal()"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-zoom-in">
          
          <!-- Header -->
          <div class="p-6 bg-emerald-600 text-white flex justify-between items-center shrink-0">
            <div>
              <h3 class="text-xl font-extrabold">⚙️ Registrar Consumo</h3>
              <p class="text-emerald-100 text-sm font-semibold">Descuenta stock por uso veterinario</p>
            </div>
            <button (click)="cerrarConsumoModal()" class="text-emerald-200 hover:text-white p-2 bg-emerald-700 rounded-full transition-colors">
              ❌
            </button>
          </div>

          <!-- Formulario -->
          <form (ngSubmit)="guardarConsumo()" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Insumo / Medicamento <span class="text-red-500">*</span></label>
              <select [(ngModel)]="consumoData.insumoId" name="insumoId" required (change)="onInsumoSelected()"
                      class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-400 font-bold text-gray-800">
                <option [ngValue]="0" disabled selected>Seleccione un medicamento...</option>
                <option *ngFor="let item of stock" [ngValue]="item.insumoId">
                  {{ item.nombreInsumo }} (Stock: {{ item.cantidadActual }} {{ item.unidadMedida }})
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Cantidad <span class="text-red-500">*</span></label>
                <input type="number" min="1" [(ngModel)]="consumoData.cantidad" name="cantidad" required
                       class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-400 font-bold text-gray-800">
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-400 mb-1">Unidad Medida</label>
                <input type="text" [value]="unidadMedidaSeleccionada" disabled
                       class="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-2 outline-none text-gray-400 font-bold">
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Motivo / Descripción <span class="text-red-500">*</span></label>
              <textarea [(ngModel)]="consumoData.descripcion" name="descripcion" rows="3" required
                        placeholder="Ej. Vacunación canina de Max, cirugía de ligamento..."
                        class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-400 font-medium text-gray-800 resize-none"></textarea>
            </div>

            <div class="pt-4 flex gap-3">
              <button type="button" (click)="cerrarConsumoModal()" 
                      class="flex-1 py-3 text-gray-500 hover:bg-gray-100 font-bold rounded-xl transition-colors">
                Cancelar
              </button>
              <button type="submit" [disabled]="guardandoConsumo"
                      class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md transition-colors disabled:opacity-50">
                {{ guardandoConsumo ? 'Registrando...' : 'Registrar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class DoctorInventarioComponent implements OnInit {
  private insumoService = inject(InsumoService);

  stock: StockInsumoResponse[] = [];
  cargando = true;
  filtroNombre = '';

  // Modal Detalle
  isDetalleModalOpen = false;
  itemSeleccionado: StockInsumoResponse | null = null;
  historial: MovimientoInsumoResponse[] = [];
  cargandoHistorial = false;

  // Modal Consumo
  isConsumoModalOpen = false;
  guardandoConsumo = false;
  unidadMedidaSeleccionada = 'Unidades';
  consumoData = {
    insumoId: 0,
    cantidad: 1,
    descripcion: ''
  };

  ngOnInit() {
    this.cargarStock();
  }

  cargarStock() {
    this.cargando = true;
    this.insumoService.listarStock().subscribe({
      next: (res) => {
        this.stock = res || [];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar stock', err);
        toast.error('No se pudo cargar el inventario de la veterinaria.');
        this.cargando = false;
      }
    });
  }

  get stockFiltrado(): StockInsumoResponse[] {
    if (!this.filtroNombre) return this.stock;
    const term = this.filtroNombre.toLowerCase();
    return this.stock.filter(item => item.nombreInsumo.toLowerCase().includes(term));
  }

  get countStockBajo(): number {
    return this.stock.filter(item => item.cantidadActual > 0 && item.alertaStock).length;
  }

  get countAgotados(): number {
    return this.stock.filter(item => item.cantidadActual === 0).length;
  }

  // --- Lógica del Detalle ---
  verDetalle(item: StockInsumoResponse) {
    this.itemSeleccionado = item;
    this.isDetalleModalOpen = true;
    this.cargandoHistorial = true;
    this.historial = [];

    this.insumoService.obtenerHistorialStock(item.insumoId).subscribe({
      next: (res) => {
        this.historial = res || [];
        this.cargandoHistorial = false;
      },
      error: (err) => {
        console.error('Error al cargar historial', err);
        toast.error('No se pudo obtener el historial de movimientos.');
        this.cargandoHistorial = false;
      }
    });
  }

  cerrarDetalle() {
    this.isDetalleModalOpen = false;
    this.itemSeleccionado = null;
    this.historial = [];
  }

  // --- Lógica de Registro de Consumo ---
  abrirConsumoModal() {
    this.consumoData = {
      insumoId: 0,
      cantidad: 1,
      descripcion: ''
    };
    this.unidadMedidaSeleccionada = '-';
    this.isConsumoModalOpen = true;
  }

  cerrarConsumoModal() {
    this.isConsumoModalOpen = false;
  }

  onInsumoSelected() {
    const selectedItem = this.stock.find(item => item.insumoId === this.consumoData.insumoId);
    if (selectedItem) {
      this.unidadMedidaSeleccionada = selectedItem.unidadMedida;
    }
  }

  guardarConsumo() {
    if (this.consumoData.insumoId <= 0 || this.consumoData.cantidad <= 0 || !this.consumoData.descripcion.trim()) {
      toast.error('Complete todos los campos obligatorios del consumo.');
      return;
    }

    const selectedItem = this.stock.find(item => item.insumoId === this.consumoData.insumoId);
    if (selectedItem && selectedItem.cantidadActual < this.consumoData.cantidad) {
      toast.error(`Stock insuficiente. Solo quedan ${selectedItem.cantidadActual} ${selectedItem.unidadMedida}.`);
      return;
    }

    const request: ConsumoRequest = {
      descripcion: this.consumoData.descripcion,
      items: [
        {
          insumoId: this.consumoData.insumoId,
          cantidad: this.consumoData.cantidad
        }
      ]
    };

    this.guardandoConsumo = true;
    this.insumoService.registrarConsumo(request).subscribe({
      next: () => {
        toast.success('El consumo ha sido registrado y el stock actualizado.');
        this.guardandoConsumo = false;
        this.cerrarConsumoModal();
        this.cargarStock(); // Recargar inventario
      },
      error: (err) => {
        console.error('Error al registrar consumo', err);
        toast.error(err.error?.message || 'Error al procesar el consumo.');
        this.guardandoConsumo = false;
      }
    });
  }
}
