import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { SolicitudReposicionService } from '../../services/solicitud-reposicion.service';
import { InsumoService } from '../../services/insumo.service';
import { ProveedorService } from '../../services/proveedor.service';
import { SolicitudReposicionResponse } from '../../models/solicitud-reposicion.model';
import { Proveedor } from '../../models/proveedor.model';
import { StockInsumoResponse } from '../../models/insumo.model';
import { forkJoin } from 'rxjs';
import { gsap } from 'gsap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8 font-nunito flex flex-col gap-6">
      
      <!-- Welcome Header -->
      <div class="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
        <div class="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-sky-500/10 group-hover:scale-110 transition-transform duration-500 ease-out z-0"></div>
        <div class="absolute right-20 -top-10 w-32 h-32 rounded-full bg-indigo-500/10 group-hover:scale-110 transition-transform duration-500 ease-out z-0"></div>
        <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 class="text-3xl font-black">Hola, {{ user?.nombre }} 👋</h1>
            <p class="text-slate-300 font-bold mt-1 text-sm">Resumen financiero y operativo de la clínica en tiempo real.</p>
          </div>
          <div class="flex gap-3 w-full md:w-auto">
            <a routerLink="/admin/productos" class="flex-1 md:flex-initial text-center bg-sky-500 hover:bg-sky-600 text-white font-extrabold py-3 px-6 rounded-2xl shadow-md transition-all text-sm whitespace-nowrap">
              📦 Gestionar Inventario
            </a>
            <a routerLink="/admin/solicitudes" class="flex-1 md:flex-initial text-center border border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-slate-200 font-extrabold py-3 px-6 rounded-2xl transition-all text-sm whitespace-nowrap">
              📥 Ver Bandeja
            </a>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="cargando" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-sky-100 border-t-sky-500 mb-4"></div>
        <p class="text-slate-500 font-bold">Cargando inteligencia de negocios...</p>
      </div>

      <!-- Main Dashboard Grid -->
      <div *ngIf="!cargando" class="flex flex-col gap-6">
        
        <!-- KPIs Row -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div class="bento-card bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 bg-sky-100 text-sky-500 rounded-2xl flex items-center justify-center mb-4 text-xl">
                💵
              </div>
              <h3 class="text-slate-500 font-bold text-xs uppercase tracking-wider">Ventas de Hoy</h3>
              <p class="text-3xl font-black text-slate-800 mt-1">\${{ ventasHoy | number:'1.2-2' }}</p>
            </div>
            <p class="text-emerald-500 text-xs font-bold mt-2">↑ 12% vs promedio diario</p>
          </div>
          
          <div class="bento-card bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mb-4 text-xl">
                🛍️
              </div>
              <h3 class="text-slate-500 font-bold text-xs uppercase tracking-wider">Pedidos Tienda</h3>
              <p class="text-3xl font-black text-slate-800 mt-1">{{ pedidosHoyCount }}</p>
            </div>
            <p class="text-slate-400 text-xs font-bold mt-2">{{ pedidosPendientes }} pedidos pendientes</p>
          </div>

          <div class="bento-card bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 bg-purple-100 text-purple-500 rounded-2xl flex items-center justify-center mb-4 text-xl">
                👥
              </div>
              <h3 class="text-slate-500 font-bold text-xs uppercase tracking-wider">Clientes Activos</h3>
              <p class="text-3xl font-black text-slate-800 mt-1">{{ clientesActivosCount }}</p>
            </div>
            <p class="text-emerald-500 text-xs font-bold mt-2">Total registrados en sistema</p>
          </div>

          <div class="bento-card bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mb-4 text-xl">
                🩺
              </div>
              <h3 class="text-slate-500 font-bold text-xs uppercase tracking-wider">Peticiones Veterinarias</h3>
              <p class="text-3xl font-black text-slate-800 mt-1">{{ solicitudesPendientesCount }}</p>
            </div>
            <p class="text-rose-500 text-xs font-bold mt-2" *ngIf="solicitudesPendientesCount > 0">Requieren aprobación urgente</p>
            <p class="text-slate-400 text-xs font-bold mt-2" *ngIf="solicitudesPendientesCount === 0">Al día sin pendientes</p>
          </div>
        </div>

        <!-- Bento Grid Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Column-Span 2: Evolution Line Chart -->
          <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col gap-4">
            <div class="flex justify-between items-center">
              <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Desempeño E-Commerce</span>
              <span class="text-xs font-black text-sky-500 uppercase tracking-widest bg-sky-50 border border-sky-100 px-3 py-1 rounded-full">
                Ventas Semanales
              </span>
            </div>

            <div class="flex-1 flex flex-col py-2">
              <!-- SVG Chart -->
              <div class="w-full h-52 relative bg-slate-50/30 rounded-2xl p-2 border border-slate-100 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 500 160" class="w-full h-full">
                  <!-- Grids -->
                  <line x1="40" y1="20" x2="470" y2="20" stroke="#f1f5f9" stroke-width="1"></line>
                  <line x1="40" y1="60" x2="470" y2="60" stroke="#f1f5f9" stroke-width="1"></line>
                  <line x1="40" y1="100" x2="470" y2="100" stroke="#f1f5f9" stroke-width="1"></line>
                  <line x1="40" y1="140" x2="470" y2="140" stroke="#e2e8f0" stroke-width="1.5"></line>

                  <!-- Gradient & Clip Mask -->
                  <defs>
                    <linearGradient id="admin-sales-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.25"></stop>
                      <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.00"></stop>
                    </linearGradient>
                    <clipPath id="admin-sales-clip">
                      <rect x="0" y="0" width="0" height="160" id="admin-sales-rect"></rect>
                    </clipPath>
                  </defs>

                  <!-- Gradient Fill -->
                  <path [attr.d]="chartGradientPath" fill="url(#admin-sales-grad)" clip-path="url(#admin-sales-clip)"></path>

                  <!-- Line -->
                  <path [attr.d]="chartPath" fill="none" stroke="#0ea5e9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" clip-path="url(#admin-sales-clip)"></path>

                  <!-- Dots -->
                  <g clip-path="url(#admin-sales-clip)">
                    <circle *ngFor="let c of chartCoords" 
                            [attr.cx]="c.x" 
                            [attr.cy]="c.y" 
                            r="4.5" 
                            fill="#ffffff" 
                            stroke="#0ea5e9" 
                            stroke-width="2.5"
                            class="admin-chart-dot origin-center transition-all duration-300 hover:r-6 cursor-pointer">
                    </circle>
                  </g>

                  <!-- Labels -->
                  <text *ngFor="let c of chartCoords" 
                        [attr.x]="c.x" 
                        y="152" 
                        text-anchor="middle" 
                        fill="#94a3b8" 
                        font-size="8.5" 
                        font-weight="bold">
                    {{ c.label }}
                  </text>

                  <!-- Values above dots -->
                  <text *ngFor="let c of chartCoords" 
                        [attr.x]="c.x" 
                        [attr.y]="c.y - 8" 
                        text-anchor="middle" 
                        fill="#334155" 
                        font-size="8.5" 
                        font-weight="black">
                    \${{ c.val | number:'1.0-0' }}
                  </text>
                </svg>
              </div>
            </div>
          </div>

          <!-- Column-Span 1: Low Stock Alerts -->
          <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <div class="flex justify-between items-center border-b border-slate-50 pb-2">
              <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Alertas de Inventario</span>
              <span class="text-xs font-black text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                {{ insumosCriticos.length }} Críticos
              </span>
            </div>

            <div class="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[190px] pr-1 custom-scrollbar">
              <div *ngIf="insumosCriticos.length === 0" class="flex flex-col items-center justify-center py-10 text-slate-400 text-center">
                <span class="text-2xl mb-1">🎉</span>
                <p class="text-xs font-bold text-slate-500">¡Excelente! Insumos al día sin faltantes.</p>
              </div>

              <div *ngFor="let ins of insumosCriticos" 
                   class="p-3 rounded-2xl border border-rose-100 bg-rose-50/10 flex items-center justify-between gap-3 shadow-sm">
                <div>
                  <h4 class="font-extrabold text-slate-800 text-xs">{{ ins.nombreInsumo }}</h4>
                  <p class="text-[9px] text-rose-500 font-bold mt-0.5">
                    Stock: {{ ins.cantidadActual }} {{ ins.unidadMedida }} (Mín: {{ ins.stockMinimo }})
                  </p>
                </div>
                <a routerLink="/admin/insumos" class="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[9px] px-3 py-2 rounded-xl transition-all shadow-sm whitespace-nowrap">
                  Reponer
                </a>
              </div>
            </div>
          </div>

        </div>

        <!-- Row 3: Solicitudes Table & breakdown -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Column-Span 2: Pending Supply Requests -->
          <div class="bento-card bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2 flex flex-col">
            <div class="p-6 border-b border-gray-50 flex justify-between items-center bg-slate-50/40">
              <h3 class="text-lg font-black text-slate-850">Solicitudes de Reposición Pendientes</h3>
              <a routerLink="/admin/solicitudes" class="text-sky-500 font-extrabold text-xs hover:underline">Ir a la bandeja</a>
            </div>

            <div class="overflow-x-auto flex-1 max-h-[280px] custom-scrollbar">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-gray-100">
                    <th class="p-4 font-bold">Solicitante</th>
                    <th class="p-4 font-bold">Fecha</th>
                    <th class="p-4 font-bold">Detalle de Solicitud</th>
                    <th class="p-4 font-bold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody class="text-xs font-semibold">
                  <tr *ngFor="let sol of solicitudesPendientes" class="border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                    <td class="p-4">
                      <p class="font-extrabold text-slate-800">{{ sol.nombreVeterinario }}</p>
                      <p class="text-[9px] text-slate-400">Dr. ID: {{ sol.veterinarioId }}</p>
                    </td>
                    <td class="p-4 text-slate-500">
                      {{ sol.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}
                    </td>
                    <td class="p-4">
                      <div class="space-y-0.5">
                        <div *ngFor="let d of sol.detalles" class="text-slate-650 flex items-center gap-1.5">
                          <span class="font-black text-slate-800 bg-slate-100 px-1 rounded">{{ d.cantidadSolicitada }}</span>
                          {{ d.nombreInsumo }}
                        </div>
                      </div>
                    </td>
                    <td class="p-4">
                      <div class="flex gap-2 justify-center">
                        <button (click)="abrirAprobarModal(sol)" class="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-xl transition-all shadow-sm shadow-emerald-50">
                          Aprobar
                        </button>
                        <button (click)="cancelarSolicitud(sol.id)" class="border border-red-200 hover:bg-red-50 text-red-500 font-extrabold text-[10px] px-3.5 py-1.5 rounded-xl transition-all">
                          Rechazar
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr *ngIf="solicitudesPendientes.length === 0">
                    <td colspan="4" class="p-16 text-center text-slate-450 font-bold">
                      No hay solicitudes de reabastecimiento pendientes de revisión.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Column-Span 1: Order Status Breakdown -->
          <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Monitoreo de Despacho</span>
            
            <div class="flex-1 flex flex-col justify-center gap-3.5">
              
              <div>
                <div class="flex justify-between items-center text-[10.5px] font-black text-slate-600 mb-1">
                  <span>Entregados</span>
                  <span>{{ pedidosEntregados }} / {{ pedidosTotal }}</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div class="stat-progress-bar h-full rounded-full bg-emerald-500" [style.width.%]="pedidosTotal > 0 ? (pedidosEntregados / pedidosTotal) * 100 : 0"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between items-center text-[10.5px] font-black text-slate-600 mb-1">
                  <span>Confirmados</span>
                  <span>{{ pedidosConfirmados }} / {{ pedidosTotal }}</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div class="stat-progress-bar h-full rounded-full bg-sky-500" [style.width.%]="pedidosTotal > 0 ? (pedidosConfirmados / pedidosTotal) * 100 : 0"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between items-center text-[10.5px] font-black text-slate-600 mb-1">
                  <span>Pendientes</span>
                  <span>{{ pedidosPendientes }} / {{ pedidosTotal }}</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div class="stat-progress-bar h-full rounded-full bg-amber-500" [style.width.%]="pedidosTotal > 0 ? (pedidosPendientes / pedidosTotal) * 100 : 0"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between items-center text-[10.5px] font-black text-slate-600 mb-1">
                  <span>Cancelados</span>
                  <span>{{ pedidosCancelados }} / {{ pedidosTotal }}</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div class="stat-progress-bar h-full rounded-full bg-red-400" [style.width.%]="pedidosTotal > 0 ? (pedidosCancelados / pedidosTotal) * 100 : 0"></div>
                </div>
              </div>

            </div>
          </div>
          
        </div>

      </div>
    </div>

    <!-- Modal Seleccionar Proveedor para Aprobación -->
    <div *ngIf="isAprobarModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="cerrarAprobarModal()"></div>
      <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in font-nunito">
        
        <div class="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
          <div>
            <h3 class="text-lg font-black">Aprobar Solicitud #{{ solicitudSeleccionada?.id }}</h3>
            <p class="text-slate-400 text-xs font-bold">Selecciona el proveedor de reposición autorizado</p>
          </div>
          <button (click)="cerrarAprobarModal()" class="text-slate-450 hover:text-white font-bold transition-colors">❌</button>
        </div>

        <form (ngSubmit)="confirmarAprobacion()" class="p-6 space-y-4">
          <div>
            <label class="block text-xs uppercase font-extrabold text-slate-400 mb-1">Insumo a Reponer</label>
            <div class="bg-gray-50 border border-gray-100 rounded-2xl p-3.5 text-xs font-black text-slate-700">
              <div *ngFor="let item of solicitudSeleccionada?.detalles">
                {{ item.nombreInsumo }} <span class="text-sky-500">x{{ item.cantidadSolicitada }}</span>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs uppercase font-extrabold text-slate-400 mb-1">Proveedor Autorizado <span class="text-red-500">*</span></label>
            <select [(ngModel)]="proveedorSeleccionadoId" name="proveedorId" required
                    class="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400 font-extrabold text-sm text-slate-700">
              <option [ngValue]="0" disabled selected>Seleccione un proveedor...</option>
              <option *ngFor="let prov of proveedores" [ngValue]="prov.id">
                {{ prov.nombre }}
              </option>
            </select>
          </div>

          <div class="pt-4 flex gap-3">
            <button type="button" (click)="cerrarAprobarModal()" 
                    class="flex-1 py-3 text-gray-500 hover:bg-gray-50 font-bold rounded-2xl transition-colors border border-gray-100 text-sm">
              Cancelar
            </button>
            <button type="submit" [disabled]="aprobando"
                    class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 rounded-2xl shadow-md transition-colors disabled:opacity-50 text-sm">
              {{ aprobando ? 'Procesando...' : 'Aprobar y Comprar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
    .animate-zoom-in {
      animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    @keyframes zoomIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class AdminHomeComponent implements OnInit {
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private solicitudService = inject(SolicitudReposicionService);
  private insumoService = inject(InsumoService);
  private proveedorService = inject(ProveedorService);

  user = this.authService.getCurrentUser();
  cargando = true;

  compras: any[] = [];
  usuarios: any[] = [];
  solicitudes: SolicitudReposicionResponse[] = [];
  solicitudesPendientes: SolicitudReposicionResponse[] = [];
  insumosCriticos: StockInsumoResponse[] = [];
  proveedores: Proveedor[] = [];

  // KPIs
  ventasHoy = 0;
  pedidosHoyCount = 0;
  clientesActivosCount = 0;
  solicitudesPendientesCount = 0;

  // Breakdown orders
  pedidosPendientes = 0;
  pedidosConfirmados = 0;
  pedidosEntregados = 0;
  pedidosCancelados = 0;
  pedidosTotal = 0;

  // Chart coordinates
  chartCoords: { x: number; y: number; label: string; val: number }[] = [];
  chartPath = '';
  chartGradientPath = '';

  // Modal approval
  isAprobarModalOpen = false;
  solicitudSeleccionada: SolicitudReposicionResponse | null = null;
  proveedorSeleccionadoId = 0;
  aprobando = false;

  ngOnInit() {
    this.cargarDashboard();
  }

  cargarDashboard() {
    this.cargando = true;
    forkJoin({
      compras: this.productService.getAllPurchases(),
      usuarios: this.authService.listarTodosLosUsuarios(),
      solicitudes: this.solicitudService.listarTodas(),
      stock: this.insumoService.listarStock(),
      proveedores: this.proveedorService.listar()
    }).subscribe({
      next: (res) => {
        this.compras = res.compras || [];
        this.usuarios = res.usuarios || [];
        this.solicitudes = res.solicitudes || [];
        const stockList = res.stock || [];
        this.proveedores = res.proveedores || [];

        // 1. Calcular KPIs de Ventas y Pedidos
        this.calcularKPIs();

        // 2. Filtrar insumos críticos (stock <= stockMinimo o alertaStock === true)
        this.insumosCriticos = stockList.filter(item => item.alertaStock || item.cantidadActual <= item.stockMinimo);

        // 3. Filtrar solicitudes pendientes
        this.solicitudesPendientes = this.solicitudes.filter(s => s.estado === 'PENDIENTE');
        this.solicitudesPendientesCount = this.solicitudesPendientes.length;

        // 4. Calcular evolución del gráfico
        this.calcularGraficoVentas();

        // 5. Animación
        this.animateDashboard();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar datos del dashboard de admin', err);
        this.cargando = false;
      }
    });
  }

  calcularKPIs() {
    const todayStr = new Date().toISOString().split('T')[0];
    let totalHoy = 0;
    let pedidosHoy = 0;

    this.compras.forEach(c => {
      if (c.fecha) {
        const cDateStr = c.fecha.split('T')[0];
        if (cDateStr === todayStr && c.estado !== 'CANCELADO') {
          totalHoy += Number(c.total || 0);
          pedidosHoy++;
        }
      }
    });

    this.ventasHoy = totalHoy;
    this.pedidosHoyCount = pedidosHoy;

    // Clientes Activos: usuarios con rol CLIENTE
    this.clientesActivosCount = this.usuarios.filter(u => 
      u.roles?.some((r: string) => r.includes('CLIENTE') || r.includes('CLIENT'))
    ).length;

    // Breakdown de pedidos
    this.pedidosPendientes = this.compras.filter(c => c.estado === 'PENDIENTE').length;
    this.pedidosConfirmados = this.compras.filter(c => c.estado === 'CONFIRMADO').length;
    this.pedidosEntregados = this.compras.filter(c => c.estado === 'ENTREGADO').length;
    this.pedidosCancelados = this.compras.filter(c => c.estado === 'CANCELADO').length;
    this.pedidosTotal = this.compras.length;
  }

  calcularGraficoVentas() {
    const dates = [];
    const salesMap = new Map<string, number>();

    // Generar las últimas 7 fechas (del de hace 6 días a hoy)
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      dates.push({ dateStr, label });
      salesMap.set(dateStr, 0);
    }

    // Acumular ventas de compras no canceladas
    this.compras.forEach(c => {
      if (c.fecha && c.estado !== 'CANCELADO') {
        const cDateStr = c.fecha.split('T')[0];
        if (salesMap.has(cDateStr)) {
          salesMap.set(cDateStr, salesMap.get(cDateStr)! + Number(c.total || 0));
        }
      }
    });

    const values = dates.map(d => salesMap.get(d.dateStr) || 0);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values, 1000); // 1000 de piso para no colapsar la escala vertical
    const range = maxVal - minVal || 1;

    // Dimensión de gráfico: Ancho 430px, Alto 110px. Origen X: 40, Origen Y: 140
    const chartWidth = 430;
    const chartHeight = 110;
    const startX = 40;
    const startY = 140;

    this.chartCoords = dates.map((d, i) => {
      const x = startX + i * (chartWidth / 6);
      const val = salesMap.get(d.dateStr) || 0;
      const y = startY - ((val - minVal) / range) * chartHeight;
      return { x, y, label: d.label, val };
    });

    if (this.chartCoords.length > 0) {
      this.chartPath = 'M ' + this.chartCoords.map(c => `${c.x} ${c.y}`).join(' L ');
      this.chartGradientPath = `${this.chartPath} L ${this.chartCoords[this.chartCoords.length - 1].x} ${startY} L ${this.chartCoords[0].x} ${startY} Z`;
    } else {
      this.chartPath = '';
      this.chartGradientPath = '';
    }

    this.animateChart();
  }

  abrirAprobarModal(sol: SolicitudReposicionResponse) {
    this.solicitudSeleccionada = sol;
    this.proveedorSeleccionadoId = 0;
    this.isAprobarModalOpen = true;
  }

  cerrarAprobarModal() {
    this.isAprobarModalOpen = false;
    this.solicitudSeleccionada = null;
    this.proveedorSeleccionadoId = 0;
  }

  confirmarAprobacion() {
    if (!this.solicitudSeleccionada) return;
    if (this.proveedorSeleccionadoId === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor selecciona un proveedor autorizado para despachar la compra.',
        customClass: { popup: 'rounded-3xl font-nunito shadow-xl' }
      });
      return;
    }

    this.aprobando = true;
    this.solicitudService.aprobar(this.solicitudSeleccionada.id, this.proveedorSeleccionadoId).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Solicitud Aprobada',
          text: 'La solicitud ha sido aprobada con éxito. Se emitió la orden de compra al proveedor.',
          timer: 2500,
          showConfirmButton: false,
          customClass: { popup: 'rounded-3xl font-nunito shadow-xl' }
        });
        this.cerrarAprobarModal();
        this.cargarDashboard();
      },
      error: (err) => {
        console.error('Error al aprobar solicitud de reposición', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'No se pudo aprobar la solicitud de insumo.',
          customClass: { popup: 'rounded-3xl font-nunito shadow-xl' }
        });
        this.aprobando = false;
      }
    });
  }

  cancelarSolicitud(id: number) {
    Swal.fire({
      title: '¿Rechazar esta solicitud?',
      text: 'Esta acción cancelará el pedido de insumo y no se podrá revertir.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Volver',
      customClass: {
        popup: 'rounded-3xl font-nunito shadow-xl',
        confirmButton: 'rounded-xl font-bold px-6 py-2.5',
        cancelButton: 'rounded-xl font-bold px-6 py-2.5'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitudService.cancelar(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Solicitud Rechazada',
              text: 'La solicitud ha sido cancelada correctamente.',
              timer: 2000,
              showConfirmButton: false,
              customClass: { popup: 'rounded-3xl font-nunito shadow-xl' }
            });
            this.cargarDashboard();
          },
          error: (err) => {
            console.error('Error al rechazar solicitud', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error?.message || 'No se pudo rechazar la solicitud.',
              customClass: { popup: 'rounded-3xl font-nunito shadow-xl' }
            });
          }
        });
      }
    });
  }

  // Animaciones GSAP
  animateDashboard() {
    setTimeout(() => {
      // Bento cards entrada escalonada
      gsap.from('.bento-card', {
        duration: 0.7,
        y: 30,
        opacity: 0,
        stagger: 0.08,
        ease: 'power2.out'
      });

      // Progress bars
      gsap.set('.stat-progress-bar', { width: '0%' });
      gsap.from('.stat-progress-bar', {
        duration: 1.2,
        width: '0%',
        ease: 'power2.out',
        stagger: 0.12
      });
    }, 50);
  }

  animateChart() {
    setTimeout(() => {
      // Revelar trazado SVG
      gsap.set('#admin-sales-rect', { width: 0 });
      gsap.to('#admin-sales-rect', {
        duration: 1.2,
        width: 500,
        ease: 'power2.out'
      });

      // Escalar puntos de datos
      gsap.from('.admin-chart-dot', {
        duration: 0.6,
        scale: 0,
        stagger: 0.07,
        ease: 'back.out(1.7)'
      });
    }, 100);
  }
}
