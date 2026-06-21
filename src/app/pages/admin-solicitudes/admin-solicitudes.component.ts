import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { SolicitudReposicionService } from '../../services/solicitud-reposicion.service';
import { ProveedorService } from '../../services/proveedor.service';
import { SolicitudReposicionResponse } from '../../models/solicitud-reposicion.model';
import { Proveedor } from '../../models/proveedor.model';
import { toast } from 'ngx-sonner';
import { gsap } from 'gsap';

@Component({
  selector: 'app-admin-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col font-nunito page-container opacity-0">
      
      <!-- Topbar Header -->
      <div class="bg-white px-8 py-5 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center shrink-0 mb-6 relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-32 h-32 bg-sky-50 rounded-full blur-2xl opacity-60"></div>
        <div class="absolute right-20 -bottom-10 w-24 h-24 bg-indigo-50 rounded-full blur-xl opacity-60"></div>
        <div class="relative z-10">
          <h2 class="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
            </svg>
            Bandeja de Solicitudes
          </h2>
          <p class="text-sm text-slate-500 font-medium mt-1">Administra los pedidos de clientes y requerimientos internos.</p>
        </div>
      </div>

      <!-- TABS -->
      <div class="flex gap-4 mb-6">
        <button (click)="switchTab('clientes')" 
                [class]="activeTab === 'clientes' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'bg-white text-slate-500 hover:bg-slate-50 border border-gray-100'"
                class="px-6 py-3 rounded-2xl font-extrabold transition-all flex items-center gap-2 cursor-pointer relative overflow-hidden group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          E-Commerce (Clientes)
          <span *ngIf="pendientesCount > 0" class="ml-2 bg-white text-sky-600 px-2 py-0.5 rounded-lg text-xs" [class.bg-sky-100]="activeTab !== 'clientes'">{{ pendientesCount }}</span>
        </button>
        
        <button (click)="switchTab('veterinarios')" 
                [class]="activeTab === 'veterinarios' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'bg-white text-slate-500 hover:bg-slate-50 border border-gray-100'"
                class="px-6 py-3 rounded-2xl font-extrabold transition-all flex items-center gap-2 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
          Insumos (Veterinarios)
          <span *ngIf="solicitudesPendientesCount > 0" class="ml-2 bg-white text-sky-600 px-2 py-0.5 rounded-lg text-xs" [class.bg-sky-100]="activeTab !== 'veterinarios'">{{ solicitudesPendientesCount }}</span>
        </button>
      </div>

      <!-- TAB CONTENIDO: CLIENTES -->
      <div *ngIf="activeTab === 'clientes'" class="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative tab-content">
        <div *ngIf="cargando" class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-sky-100 border-t-sky-500"></div>
        </div>

        <div class="flex-1 overflow-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th class="p-5 font-bold">Fecha / ID</th>
                <th class="p-5 font-bold">Cliente ID</th>
                <th class="p-5 font-bold">Detalle Compra</th>
                <th class="p-5 font-bold text-right">Total</th>
                <th class="p-5 font-bold text-center">Estado y Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 text-sm">
              <tr *ngFor="let compra of compras" class="hover:bg-slate-50/50 transition-colors">
                <td class="p-5">
                  <p class="font-extrabold text-slate-800">{{ compra.fecha | date:'dd/MM/yyyy HH:mm' }}</p>
                  <p class="text-xs text-slate-400 font-bold mt-0.5">Orden #{{ compra.id }}</p>
                </td>
                <td class="p-5">
                  <span class="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg font-bold text-xs">User #{{ compra.usuarioId }}</span>
                </td>
                <td class="p-5">
                  <div class="space-y-1">
                    <div *ngFor="let item of compra.productos" class="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                      <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                      <span class="font-bold text-slate-700">{{ item.cantidad }}x</span> {{ item.nombreProducto }}
                    </div>
                  </div>
                </td>
                <td class="p-5 text-right">
                  <p class="font-black text-slate-800">$\{{ compra.total | number:'1.2-2' }}</p>
                  <p class="text-xs font-bold text-slate-400 mt-0.5">{{ compra.metodoPago }}</p>
                </td>
                <td class="p-5">
                  <div class="flex flex-col items-center gap-2">
                    <span [ngClass]="getEstadoClase(compra.estado)" class="px-3 py-1 rounded-lg font-extrabold text-xs inline-block text-center min-w-[100px]">
                      {{ compra.estado }}
                    </span>
                    
                    <div class="flex gap-1" *ngIf="compra.estado !== 'ENTREGADO' && compra.estado !== 'CANCELADO'">
                      <button *ngIf="compra.estado === 'PENDIENTE'" 
                              (click)="cambiarEstado(compra.id, 'CONFIRMADO')"
                              class="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer" title="Marcar Confirmado">
                        Confirmar
                      </button>
                      <button *ngIf="compra.estado === 'CONFIRMADO'" 
                              (click)="cambiarEstado(compra.id, 'ENTREGADO')"
                              class="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer" title="Marcar Entregado">
                        Entregar
                      </button>
                      <button (click)="cambiarEstado(compra.id, 'CANCELADO')"
                              class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer" title="Cancelar Orden">
                        Cancelar
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
              
              <tr *ngIf="compras.length === 0 && !cargando">
                <td colspan="5" class="p-16 text-center text-slate-500">
                  <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                  </div>
                  <p class="font-extrabold text-lg text-slate-700">Sin compras recientes</p>
                  <p class="text-sm mt-1">Aún no hay compras registradas en la tienda.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB CONTENIDO: VETERINARIOS -->
      <div *ngIf="activeTab === 'veterinarios'" class="flex-1 overflow-y-auto space-y-6 tab-content">
        
        <!-- Peticiones Section -->
        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
          <div *ngIf="cargandoSolicitudes" class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
            <div class="animate-spin rounded-full h-10 w-10 border-4 border-sky-100 border-t-sky-500"></div>
          </div>
          
          <div class="p-6 border-b border-gray-50 bg-emerald-50/10 flex justify-between items-center">
            <h3 class="font-extrabold text-emerald-950 text-lg">Peticiones de Insumos (De Veterinarios)</h3>
            <span class="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-black">Pendientes: {{ solicitudesPendientesCount }}</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th class="p-4 font-bold">Solicitud ID / Fecha</th>
                  <th class="p-4 font-bold">Solicitante</th>
                  <th class="p-4 font-bold">Insumos Solicitados</th>
                  <th class="p-4 font-bold text-center">Estado y Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 text-sm font-semibold">
                <tr *ngFor="let sol of solicitudes" class="hover:bg-slate-50/50 transition-colors">
                  <td class="p-4">
                    <p class="font-extrabold text-slate-800">#{{ sol.id }}</p>
                    <p class="text-xs text-slate-400 font-bold mt-0.5">{{ sol.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}</p>
                  </td>
                  <td class="p-4">
                    <p class="font-bold text-slate-700">{{ sol.nombreVeterinario }}</p>
                    <p class="text-xs text-slate-400">Dr. ID: {{ sol.veterinarioId }}</p>
                  </td>
                  <td class="p-4">
                    <div class="space-y-1">
                      <div *ngFor="let item of sol.detalles" class="text-xs font-bold text-slate-700 flex items-center gap-2">
                        <span class="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-black">Cant: {{ item.cantidadSolicitada }}</span>
                        {{ item.nombreInsumo }}
                      </div>
                    </div>
                  </td>
                  <td class="p-4">
                    <div class="flex flex-col items-center gap-2">
                      <span [ngClass]="getSolicitudEstadoClase(sol.estado)" class="px-3 py-1 rounded-lg font-extrabold text-xs inline-block text-center min-w-[100px] uppercase">
                        {{ sol.estado }}
                      </span>
                      
                      <div class="flex gap-1" *ngIf="sol.estado === 'PENDIENTE'">
                        <button (click)="abrirAprobarModal(sol)"
                                class="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                          Aprobar
                        </button>
                        <button (click)="confirmarRechazoSolicitud(sol.id)"
                                class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="solicitudes.length === 0 && !cargandoSolicitudes">
                  <td colspan="4" class="p-8 text-center text-slate-400 font-medium">No hay peticiones de reposición.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Ordenes Compra Section -->
        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
          <div *ngIf="cargandoOrdenes" class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
            <div class="animate-spin rounded-full h-10 w-10 border-4 border-sky-100 border-t-sky-500"></div>
          </div>
          
          <div class="p-6 border-b border-gray-50 bg-indigo-50/10 flex justify-between items-center">
            <div>
              <h3 class="font-extrabold text-indigo-950 text-lg">Órdenes de Compra (Proveedores)</h3>
              <p class="text-xs text-slate-500 font-semibold mt-0.5">Completa el ingreso de stock cuando la mercadería sea entregada por el proveedor.</p>
            </div>
            <span class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-black">Pendientes de Entrega: {{ pendientesOrdenesCount }}</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th class="p-4 font-bold">Orden ID / Fecha</th>
                  <th class="p-4 font-bold">Proveedor</th>
                  <th class="p-4 font-bold">Detalle de Insumos</th>
                  <th class="p-4 text-right font-bold">Costo Total</th>
                  <th class="p-4 font-bold text-center">Estado y Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 text-sm font-semibold">
                <tr *ngFor="let ord of ordenes" class="hover:bg-slate-50/50 transition-colors">
                  <td class="p-4">
                    <p class="font-extrabold text-slate-800">#{{ ord.id }}</p>
                    <p class="text-xs text-slate-400 font-bold mt-0.5">{{ ord.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}</p>
                  </td>
                  <td class="p-4">
                    <p class="font-bold text-slate-700">{{ ord.nombreProveedor }}</p>
                    <p class="text-xs text-slate-400">ID: {{ ord.proveedorId }}</p>
                  </td>
                  <td class="p-4">
                    <div class="space-y-1">
                      <div *ngFor="let item of ord.detalles" class="text-xs font-bold text-slate-700 flex items-center gap-2">
                        <span class="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-black">Cant: {{ item.cantidad }}</span>
                        {{ item.nombreInsumo }} ($\{{ item.precioUnitario }}/ud)
                      </div>
                    </div>
                  </td>
                  <td class="p-4 text-right">
                    <p class="font-black text-slate-800">$\{{ ord.total | number:'1.2-2' }}</p>
                  </td>
                  <td class="p-4">
                    <div class="flex flex-col items-center gap-2">
                      <span [ngClass]="getOrdenEstadoClase(ord.estado)" class="px-3 py-1 rounded-lg font-extrabold text-xs inline-block text-center min-w-[110px] uppercase">
                        {{ ord.estado }}
                      </span>
                      
                      <div class="flex gap-1" *ngIf="ord.estado === 'PENDIENTE'">
                        <button (click)="confirmarRecepcionOrden(ord)"
                                class="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                          Confirmar Recepción
                        </button>
                        <button (click)="confirmarCancelarOrden(ord.id)"
                                class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="ordenes.length === 0 && !cargandoOrdenes">
                  <td colspan="5" class="p-8 text-center text-slate-400 font-medium">No se han registrado órdenes de compra.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal Seleccionar Proveedor para Aprobar Solicitud -->
    <div *ngIf="isAprobarModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" (click)="cerrarAprobarModal()"></div>
      <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in">
        
        <div class="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
          <div>
            <h3 class="text-lg font-extrabold">Aprobar Solicitud #{{ solicitudSeleccionada?.id }}</h3>
            <p class="text-slate-400 text-xs font-semibold">Selecciona el proveedor de reposición</p>
          </div>
          <button (click)="cerrarAprobarModal()" class="text-slate-400 hover:text-white">❌</button>
        </div>

        <form (ngSubmit)="confirmarAprobacion()" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Insumo a Reponer</label>
            <div class="bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-bold text-gray-700">
              <div *ngFor="let item of solicitudSeleccionada?.detalles">
                {{ item.nombreInsumo }} <span class="text-sky-600">x{{ item.cantidadSolicitada }}</span>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Proveedor Autorizado <span class="text-red-500">*</span></label>
            <select [(ngModel)]="proveedorSeleccionadoId" name="proveedorId" required
                    class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-400 font-bold text-gray-800">
              <option [ngValue]="0" disabled selected>Seleccione un proveedor...</option>
              <option *ngFor="let prov of proveedores" [ngValue]="prov.id">
                {{ prov.nombre }}
              </option>
            </select>
          </div>

          <div class="pt-4 flex gap-3">
            <button type="button" (click)="cerrarAprobarModal()" 
                    class="flex-1 py-3 text-gray-500 hover:bg-gray-100 font-bold rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" [disabled]="aprobando"
                    class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md transition-colors disabled:opacity-50">
              {{ aprobando ? 'Procesando...' : 'Aprobar y Comprar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Reusable Custom Confirmation Modal (Replaces native confirm/alert) -->
    <div *ngIf="isConfirmModalOpen" class="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" (click)="cerrarConfirmModal()"></div>
      <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 animate-zoom-in text-center">
        <div class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
             [ngClass]="confirmModalConfig.iconClass">
          {{ confirmModalConfig.icon }}
        </div>
        <h3 class="text-xl font-extrabold text-slate-800 mb-2">{{ confirmModalConfig.title }}</h3>
        <p class="text-slate-500 text-sm font-medium mb-6 leading-relaxed">{{ confirmModalConfig.message }}</p>
        
        <div class="flex gap-3">
          <button type="button" (click)="cerrarConfirmModal()" 
                  class="flex-1 py-3 text-slate-500 hover:bg-slate-50 font-bold rounded-xl border border-slate-100 transition-colors">
            Cancelar
          </button>
          <button type="button" (click)="ejecutarAccionConfirmada()"
                  [ngClass]="confirmModalConfig.btnClass"
                  class="flex-1 text-white font-extrabold py-3 rounded-xl shadow-md transition-colors">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  `
})
export class AdminSolicitudesComponent implements OnInit {
  private productService = inject(ProductService);
  private solicitudService = inject(SolicitudReposicionService);
  private proveedorService = inject(ProveedorService);

  activeTab: 'clientes' | 'veterinarios' = 'clientes';
  
  // Tab Clientes (Compras Store)
  compras: any[] = [];
  cargando = true;
  pendientesCount = 0;

  // Tab Veterinarios (Insumos Solicitudes y Ordenes Compra)
  solicitudes: SolicitudReposicionResponse[] = [];
  cargandoSolicitudes = false;
  solicitudesPendientesCount = 0;

  ordenes: any[] = [];
  cargandoOrdenes = false;
  pendientesOrdenesCount = 0;

  // Modal Aprobar
  isAprobarModalOpen = false;
  solicitudSeleccionada: SolicitudReposicionResponse | null = null;
  proveedores: Proveedor[] = [];
  proveedorSeleccionadoId = 0;
  aprobando = false;

  // Reusable Confirmation Modal
  isConfirmModalOpen = false;
  confirmModalConfig = {
    title: '',
    message: '',
    icon: '',
    iconClass: '',
    btnClass: '',
    action: () => {}
  };

  ngOnInit() {
    this.cargarCompras();
    this.cargarSolicitudesCount();
    setTimeout(() => {
      gsap.fromTo('.page-container', 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    });
  }

  switchTab(tab: 'clientes' | 'veterinarios') {
    this.activeTab = tab;
    if (tab === 'clientes') {
      this.cargarCompras();
    } else {
      this.cargarSolicitudes();
      this.cargarProveedores();
      this.cargarOrdenes();
    }
  }

  // --- E-Commerce Clientes ---
  cargarCompras() {
    this.cargando = true;
    this.productService.getAllPurchases().subscribe({
      next: (data) => {
        this.compras = data;
        this.pendientesCount = this.compras.filter(c => c.estado === 'PENDIENTE').length;
        this.cargando = false;
        this.animateTabContent();
      },
      error: (err) => {
        console.error(err);
        toast.error('No se pudieron cargar las compras de la tienda.');
        this.cargando = false;
      }
    });
  }

  cambiarEstado(id: number, nuevoEstado: string) {
    this.productService.updatePurchaseStatus(id, nuevoEstado).subscribe({
      next: () => {
        if (nuevoEstado === 'CANCELADO') {
          toast.success('Orden cancelada. El stock ha sido devuelto a la tienda.');
        } else {
          toast.success(`Orden marcada como ${nuevoEstado}`);
        }
        this.cargarCompras();
      },
      error: (err) => {
        toast.error(err.error?.message || 'Hubo un error al cambiar el estado.');
      }
    });
  }

  getEstadoClase(estado: string): string {
    switch(estado) {
      case 'PENDIENTE': return 'bg-amber-100 text-amber-600';
      case 'CONFIRMADO': return 'bg-blue-100 text-blue-600';
      case 'ENTREGADO': return 'bg-emerald-100 text-emerald-600';
      case 'CANCELADO': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  }

  // --- Insumos Veterinarios ---
  cargarSolicitudesCount() {
    this.solicitudService.listarTodas().subscribe({
      next: (res) => {
        this.solicitudesPendientesCount = (res || []).filter(s => s.estado === 'PENDIENTE').length;
      }
    });
  }

  cargarSolicitudes() {
    this.cargandoSolicitudes = true;
    this.solicitudService.listarTodas().subscribe({
      next: (res) => {
        this.solicitudes = (res || []).sort((a, b) => b.id - a.id);
        this.solicitudesPendientesCount = this.solicitudes.filter(s => s.estado === 'PENDIENTE').length;
        this.cargandoSolicitudes = false;
        this.animateTabContent();
      },
      error: (err) => {
        console.error(err);
        toast.error('No se pudieron cargar las solicitudes de insumos.');
        this.cargandoSolicitudes = false;
      }
    });
  }

  cargarProveedores() {
    this.proveedorService.listar().subscribe({
      next: (res) => {
        this.proveedores = (res || []).filter(p => p.activo);
      }
    });
  }

  confirmarRechazoSolicitud(id: number) {
    this.confirmModalConfig = {
      title: '¿Rechazar Petición?',
      message: 'Esta acción cancelará la solicitud del veterinario de forma permanente.',
      icon: '🚫',
      iconClass: 'bg-red-50 text-red-600',
      btnClass: 'bg-red-500 hover:bg-red-600',
      action: () => {
        this.solicitudService.cancelar(id).subscribe({
          next: () => {
            toast.success('Solicitud rechazada y cancelada.');
            this.cargarSolicitudes();
          },
          error: (err) => {
            console.error(err);
            toast.error(err.error?.message || 'Error al cancelar la solicitud.');
          }
        });
      }
    };
    this.isConfirmModalOpen = true;
  }

  getSolicitudEstadoClase(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'bg-amber-100 text-amber-600';
      case 'APROBADO': return 'bg-emerald-100 text-emerald-600';
      case 'CANCELADO': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  }

  // --- Ordenes de Compra ---
  cargarOrdenes() {
    this.cargandoOrdenes = true;
    this.solicitudService.listarOrdenes().subscribe({
      next: (res) => {
        this.ordenes = (res || []).sort((a, b) => b.id - a.id);
        this.pendientesOrdenesCount = this.ordenes.filter(o => o.estado === 'PENDIENTE').length;
        this.cargandoOrdenes = false;
      },
      error: (err) => {
        console.error(err);
        toast.error('No se pudieron cargar las órdenes de compra.');
        this.cargandoOrdenes = false;
      }
    });
  }

  confirmarRecepcionOrden(ord: any) {
    this.confirmModalConfig = {
      title: '¿Confirmar Recepción?',
      message: `¿Confirmar llegada de mercadería para la Orden #${ord.id}? Se incrementará el stock del inventario.`,
      icon: '🚚',
      iconClass: 'bg-emerald-50 text-emerald-600',
      btnClass: 'bg-emerald-600 hover:bg-emerald-700',
      action: () => {
        const itemsPayload = ord.detalles.map((d: any) => ({
          insumoId: d.insumoId,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario
        }));

        this.solicitudService.completarOrden(ord.id, { items: itemsPayload }).subscribe({
          next: () => {
            toast.success('¡Mercadería recibida! El stock ha sido incrementado.');
            this.cargarOrdenes();
          },
          error: (err) => {
            console.error(err);
            toast.error(err.error?.message || 'Error al completar la orden de compra.');
          }
        });
      }
    };
    this.isConfirmModalOpen = true;
  }

  confirmarCancelarOrden(id: number) {
    this.confirmModalConfig = {
      title: '¿Cancelar Orden?',
      message: '¿Está seguro de que desea cancelar esta orden de compra con el proveedor?',
      icon: '❌',
      iconClass: 'bg-red-50 text-red-600',
      btnClass: 'bg-red-500 hover:bg-red-600',
      action: () => {
        this.solicitudService.cancelarOrden(id).subscribe({
          next: () => {
            toast.success('Orden de compra cancelada.');
            this.cargarOrdenes();
          },
          error: (err) => {
            console.error(err);
            toast.error(err.error?.message || 'Error al cancelar la orden.');
          }
        });
      }
    };
    this.isConfirmModalOpen = true;
  }

  getOrdenEstadoClase(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'bg-amber-100 text-amber-600';
      case 'COMPLETADA': return 'bg-emerald-100 text-emerald-600';
      case 'CANCELADA': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  }

  // --- Modal Aprobación ---
  abrirAprobarModal(sol: SolicitudReposicionResponse) {
    this.solicitudSeleccionada = sol;
    this.proveedorSeleccionadoId = 0;
    this.isAprobarModalOpen = true;
  }

  cerrarAprobarModal() {
    this.isAprobarModalOpen = false;
    this.solicitudSeleccionada = null;
  }

  confirmarAprobacion() {
    if (!this.solicitudSeleccionada || this.proveedorSeleccionadoId <= 0) {
      toast.error('Seleccione un proveedor de la lista.');
      return;
    }

    this.aprobando = true;
    this.solicitudService.aprobar(this.solicitudSeleccionada.id, this.proveedorSeleccionadoId).subscribe({
      next: () => {
        toast.success('Solicitud aprobada. Se ha generado una Orden de Compra.');
        this.aprobando = false;
        this.cerrarAprobarModal();
        this.cargarSolicitudes();
      },
      error: (err) => {
        console.error(err);
        toast.error(err.error?.message || 'Error al aprobar la solicitud.');
        this.aprobando = false;
      }
    });
  }

  // --- Reusable Confirm Modal ---
  ejecutarAccionConfirmada() {
    this.confirmModalConfig.action();
    this.cerrarConfirmModal();
  }

  cerrarConfirmModal() {
    this.isConfirmModalOpen = false;
  }

  private animateTabContent() {
    setTimeout(() => {
      gsap.fromTo('.tab-content', 
        { opacity: 0, y: 10 }, 
        { opacity: 1, y: 0, duration: 0.3, ease: 'power1.out' }
      );
    });
  }
}
