import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8 font-nunito flex flex-col gap-6">
      
      <!-- Welcome Header -->
      <div class="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform duration-500 ease-out z-0"></div>
        <div class="relative z-10">
          <h1 class="text-3xl font-black">Panel de Administración 🛠️</h1>
          <p class="text-slate-300 font-bold mt-1">Hola, {{ user?.nombre }} {{ user?.apellido }} • Administrador de la veterinaria</p>
        </div>
      </div>

      <!-- Bento Grid (KPIs) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- KPI 1: Ventas del día -->
        <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div class="absolute -right-6 -bottom-6 w-20 h-20 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500 z-0"></div>
          <div class="z-10">
            <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Ventas de Hoy</span>
            <h2 class="text-3xl font-black text-slate-800 mt-2">\${{ ventasHoy | number:'1.2-2' }}</h2>
          </div>
          <p class="text-xs text-emerald-600 font-extrabold mt-4 z-10 flex items-center gap-1">
            🟢 Activo hoy
          </p>
        </div>

        <!-- KPI 2: Pedidos del día -->
        <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div class="absolute -right-6 -bottom-6 w-20 h-20 bg-sky-50 rounded-full group-hover:scale-110 transition-transform duration-500 z-0"></div>
          <div class="z-10">
            <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Pedidos Hoy</span>
            <h2 class="text-3xl font-black text-slate-800 mt-2">{{ pedidosHoyCount }}</h2>
          </div>
          <p class="text-xs text-sky-600 font-extrabold mt-4 z-10">
            📦 Compras registradas hoy
          </p>
        </div>

        <!-- KPI 3: Clientes activos -->
        <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div class="absolute -right-6 -bottom-6 w-20 h-20 bg-violet-50 rounded-full group-hover:scale-110 transition-transform duration-500 z-0"></div>
          <div class="z-10">
            <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Clientes Activos</span>
            <h2 class="text-3xl font-black text-slate-800 mt-2">{{ clientesActivosCount }}</h2>
          </div>
          <p class="text-xs text-violet-600 font-extrabold mt-4 z-10">
            👥 Usuarios tipo cliente
          </p>
        </div>

        <!-- KPI 4: Solicitudes pendientes -->
        <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div class="absolute -right-6 -bottom-6 w-20 h-20 bg-amber-50 rounded-full group-hover:scale-110 transition-transform duration-500 z-0"></div>
          <div class="z-10">
            <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Reposición Insumos</span>
            <h2 class="text-3xl font-black text-slate-800 mt-2">{{ solicitudesPendientesCount }}</h2>
          </div>
          <p class="text-xs font-extrabold mt-4 z-10" [ngClass]="solicitudesPendientesCount > 0 ? 'text-amber-600 animate-pulse' : 'text-slate-400'">
            ⚠️ {{ solicitudesPendientesCount > 0 ? 'Solicitudes pendientes de revisión' : 'Sin solicitudes pendientes' }}
          </p>
        </div>

      </div>

      <!-- Bento Grid (Gráficos y Tablas) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Bento Card 5: Gráfico Ventas Semanales (Col-Span 2) -->
        <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col gap-4">
          <div class="flex justify-between items-center pb-2 border-b border-slate-50">
            <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Evolución de Ventas (Últimos 7 días)</span>
            <span class="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">Semanal</span>
          </div>

          <div class="flex-1 flex flex-col justify-center min-h-[220px]">
            <div class="relative w-full h-44">
              <!-- SVG Chart -->
              <svg class="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
                <defs>
                  <!-- Gradient for chart background fill -->
                  <linearGradient id="admin-sales-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#10b981" stop-opacity="0.25"></stop>
                    <stop offset="100%" stop-color="#10b981" stop-opacity="0.00"></stop>
                  </linearGradient>
                  
                  <!-- Clip path for animated revealing -->
                  <clipPath id="admin-chart-clip">
                    <rect id="admin-sales-rect" x="0" y="0" width="500" height="160"></rect>
                  </clipPath>
                </defs>

                <!-- Grid Lines -->
                <line x1="40" y1="30" x2="470" y2="30" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4"></line>
                <line x1="40" y1="85" x2="470" y2="85" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4"></line>
                <line x1="40" y1="140" x2="470" y2="140" stroke="#e2e8f0" stroke-width="1.5"></line>

                <!-- Gradient Area Fill -->
                <path *ngIf="chartGradientPath" [attr.d]="chartGradientPath" fill="url(#admin-sales-grad)" clip-path="url(#admin-chart-clip)"></path>

                <!-- Line Path -->
                <path *ngIf="chartPath" [attr.d]="chartPath" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" clip-path="url(#admin-chart-clip)"></path>

                <!-- Data Dots -->
                <g *ngFor="let dot of chartCoords">
                  <circle [attr.cx]="dot.x" [attr.cy]="dot.y" r="5" fill="#ffffff" stroke="#10b981" stroke-width="2.5" class="admin-chart-dot origin-center transition-all duration-300 hover:r-7" [attr.title]="dot.val"></circle>
                  <text [attr.x]="dot.x" [attr.y]="dot.y - 12" text-anchor="middle" class="text-[9px] font-black fill-slate-700 font-nunito">\${{ dot.val | number:'1.0-0' }}</text>
                  <!-- X-Axis Labels -->
                  <text [attr.x]="dot.x" y="155" text-anchor="middle" class="text-[9px] font-extrabold fill-slate-400 font-nunito">{{ dot.label }}</text>
                </g>
              </svg>
            </div>
          </div>
        </div>

        <!-- Bento Card 6: Pedidos por estado (Col-Span 1) -->
        <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
          <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Monitor de Pedidos</span>
          
          <div class="flex-1 flex flex-col justify-center gap-3">
            <div>
              <div class="flex justify-between items-center text-[10px] font-extrabold text-slate-600 mb-1">
                <span>Pendientes de confirmación</span>
                <span>{{ pedidosPendientes }} ({{ pedidosTotal > 0 ? Math.round((pedidosPendientes/pedidosTotal)*100) : 0 }}%)</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div class="stat-progress-bar h-full rounded-full bg-amber-500" [style.width.%]="pedidosTotal > 0 ? (pedidosPendientes/pedidosTotal)*100 : 0"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center text-[10px] font-extrabold text-slate-600 mb-1">
                <span>Confirmados (En armado)</span>
                <span>{{ pedidosConfirmados }} ({{ pedidosTotal > 0 ? Math.round((pedidosConfirmados/pedidosTotal)*100) : 0 }}%)</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div class="stat-progress-bar h-full rounded-full bg-sky-500" [style.width.%]="pedidosTotal > 0 ? (pedidosConfirmados/pedidosTotal)*100 : 0"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center text-[10px] font-extrabold text-slate-600 mb-1">
                <span>Entregados</span>
                <span>{{ pedidosEntregados }} ({{ pedidosTotal > 0 ? Math.round((pedidosEntregados/pedidosTotal)*100) : 0 }}%)</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div class="stat-progress-bar h-full rounded-full bg-emerald-500" [style.width.%]="pedidosTotal > 0 ? (pedidosEntregados/pedidosTotal)*100 : 0"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center text-[10px] font-extrabold text-slate-600 mb-1">
                <span>Cancelados</span>
                <span>{{ pedidosCancelados }} ({{ pedidosTotal > 0 ? Math.round((pedidosCancelados/pedidosTotal)*100) : 0 }}%)</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div class="stat-progress-bar h-full rounded-full bg-rose-500" [style.width.%]="pedidosTotal > 0 ? (pedidosCancelados/pedidosTotal)*100 : 0"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bento Card 7: Solicitudes de Insumos (Col-Span 2) -->
        <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col gap-4">
          <div class="flex justify-between items-center pb-2 border-b border-slate-50">
            <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Solicitudes de Reposición de Insumos</span>
            <span class="text-xs font-black text-amber-500 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">{{ solicitudesPendientes.length }} Pendientes</span>
          </div>

          <div class="flex-1 overflow-y-auto max-h-64 pr-1 custom-scrollbar">
            <div *ngIf="solicitudesPendientes.length === 0" class="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
              <span class="text-3xl mb-1">✅</span>
              <p class="text-xs font-bold">No hay solicitudes de reposición pendientes de aprobación.</p>
            </div>

            <div class="flex flex-col gap-3">
              <div *ngFor="let sol of solicitudesPendientes" class="p-4 border border-slate-100 rounded-2xl bg-slate-50/20 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span class="text-[9px] font-black uppercase text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">Pendiente</span>
                  <h4 class="font-extrabold text-slate-800 text-sm mt-1.5">Insumos solicitados:</h4>
                  <ul class="list-disc list-inside text-[10px] text-slate-600 font-bold mt-1">
                    <li *ngFor="let det of sol.detalles">
                      {{ det.nombreInsumo }} (x{{ det.cantidadSolicitada }})
                    </li>
                  </ul>
                  <p class="text-[9px] text-slate-400 mt-2 font-bold">
                    Solicitado por: {{ sol.nombreVeterinario }} • Fecha: {{ sol.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}
                  </p>
                </div>
                
                <div class="flex gap-2 w-full sm:w-auto justify-end">
                  <button (click)="abrirAprobarModal(sol)" class="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-[10px] px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer">
                    Aprobar compra
                  </button>
                  <button (click)="cancelarSolicitud(sol.id)" class="border border-rose-200 hover:bg-rose-50 text-rose-500 font-extrabold text-[10px] px-3 py-2 rounded-xl transition-all cursor-pointer">
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bento Card 8: Insumos con Alerta Crítica (Col-Span 1) -->
        <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
          <div class="flex justify-between items-center pb-2 border-b border-slate-50">
            <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Stock Crítico Veterinario</span>
            <span class="text-xs font-black text-rose-500 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full">{{ insumosCriticos.length }} Alertas</span>
          </div>

          <div class="flex-1 overflow-y-auto max-h-64 pr-1 custom-scrollbar">
            <div *ngIf="insumosCriticos.length === 0" class="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
              <span class="text-2xl mb-1">📦</span>
              <p class="text-xs font-bold text-slate-500">Todo en orden. No hay insumos en stock crítico.</p>
            </div>

            <div class="flex flex-col gap-3">
              <div *ngFor="let item of insumosCriticos" class="p-3 border border-rose-100 rounded-2xl bg-rose-50/10 shadow-sm flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <h4 class="font-extrabold text-slate-800 text-xs truncate">{{ item.nombreInsumo }}</h4>
                  <p class="text-[9px] text-slate-500 font-bold mt-0.5">
                    Stock actual: <span class="text-rose-600 font-extrabold">{{ item.cantidadActual }}</span> • Mínimo: {{ item.stockMinimo }}
                  </p>
                </div>
                <span class="text-[9px] font-black uppercase text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Crítico
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal para Aprobar y Seleccionar Proveedor -->
    <div *ngIf="isAprobarModalOpen" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="relative bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl border border-emerald-50/50 animate-zoom-in">
        <h3 class="text-2xl font-black text-slate-800 mb-2">Despachar Orden de Compra</h3>
        <div class="text-xs text-slate-500 font-bold mb-6">
          Aprobarás la solicitud de reposición de insumos de <span class="text-slate-800 font-extrabold">{{ solicitudSeleccionada?.nombreVeterinario }}</span>:
          <ul class="list-disc list-inside mt-2 text-slate-700">
            <li *ngFor="let det of solicitudSeleccionada?.detalles">
              {{ det.nombreInsumo }} (x{{ det.cantidadSolicitada }})
            </li>
          </ul>
        </div>

        <form (ngSubmit)="confirmarAprobacion()">
          <div class="mb-6">
            <label class="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Selecciona Proveedor Autorizado</label>
            <select [(ngModel)]="proveedorSeleccionadoId" name="proveedor" required
                    class="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm">
              <option value="0" disabled>-- Elige un proveedor --</option>
              <option *ngFor="let p of proveedores" [value]="p.id">{{ p.nombre }} ({{ p.telefono || p.email || 'Sin contacto' }})</option>
            </select>
          </div>

          <div class="flex gap-3">
            <button type="button" (click)="cerrarAprobarModal()" 
                    class="flex-1 py-3 text-gray-500 hover:bg-gray-50 font-bold rounded-2xl transition-colors border border-gray-100 text-sm cursor-pointer">
              Cancelar
            </button>
            <button type="submit" [disabled]="aprobando"
                    class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 rounded-2xl shadow-md transition-colors disabled:opacity-50 text-sm cursor-pointer">
              {{ aprobando ? 'Procesando...' : 'Aprobar y Comprar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Reusable Custom Confirmation Modal -->
    <div *ngIf="isConfirmModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-md confirm-modal-backdrop" (click)="cerrarConfirmModal()"></div>
      <div class="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-6 text-center border border-slate-100/50 confirm-modal-content">
        <div class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl bg-rose-50 text-rose-500 shadow-inner border border-rose-100 animate-pulse">
          🗑️
        </div>
        <h3 class="text-xl font-extrabold text-slate-800 mb-2">{{ confirmModalConfig.title }}</h3>
        <p class="text-slate-500 text-sm font-medium mb-6 leading-relaxed">{{ confirmModalConfig.message }}</p>
        
        <div class="flex gap-3">
          <button type="button" (click)="cerrarConfirmModal()" 
                  class="flex-1 py-3 text-slate-500 hover:bg-slate-50 font-bold rounded-xl border border-slate-150 transition-colors cursor-pointer text-sm">
            Volver
          </button>
          <button type="button" (click)="ejecutarAccionConfirmada()"
                  class="flex-1 text-white font-extrabold py-3 rounded-xl shadow-md transition-colors cursor-pointer text-sm bg-rose-500 hover:bg-rose-600 active:scale-97">
            Confirmar
          </button>
        </div>
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

  protected Math = Math;
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

  // Custom Confirm Modal State
  isConfirmModalOpen = false;
  confirmModalConfig = {
    title: '',
    message: '',
    action: () => {}
  };

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
      toast.error('Error de validación', {
        description: 'Por favor selecciona un proveedor autorizado para despachar la compra.'
      });
      return;
    }

    this.aprobando = true;
    this.solicitudService.aprobar(this.solicitudSeleccionada.id, this.proveedorSeleccionadoId).subscribe({
      next: () => {
        toast.success('Solicitud Aprobada', {
          description: 'La solicitud ha sido aprobada con éxito. Se emitió la orden de compra al proveedor.'
        });
        this.cerrarAprobarModal();
        this.cargarDashboard();
      },
      error: (err) => {
        console.error('Error al aprobar solicitud de reposición', err);
        toast.error('Error', {
          description: err.error?.message || 'No se pudo aprobar la solicitud de insumo.'
        });
        this.aprobando = false;
      }
    });
  }

  cancelarSolicitud(id: number) {
    this.confirmModalConfig = {
      title: '¿Rechazar esta solicitud?',
      message: 'Esta acción cancelará el pedido de insumo y no se podrá revertir.',
      action: () => {
        this.solicitudService.cancelar(id).subscribe({
          next: () => {
            toast.success('Solicitud Rechazada', {
              description: 'La solicitud ha sido cancelada correctamente.'
            });
            this.cargarDashboard();
          },
          error: (err) => {
            console.error('Error al rechazar solicitud', err);
            toast.error('Error', {
              description: err.error?.message || 'No se pudo rechazar la solicitud.'
            });
          }
        });
      }
    };
    this.abrirConfirmModal();
  }

  abrirConfirmModal() {
    this.isConfirmModalOpen = true;
    setTimeout(() => {
      gsap.fromTo('.confirm-modal-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.fromTo('.confirm-modal-content', 
        { scale: 0.9, y: 30, opacity: 0 }, 
        { scale: 1, y: 0, opacity: 1, duration: 0.3, ease: 'back.out(1.2)' }
      );
    }, 10);
  }

  cerrarConfirmModal() {
    gsap.to('.confirm-modal-content', { 
      scale: 0.9, 
      y: 30, 
      opacity: 0, 
      duration: 0.15, 
      ease: 'power2.in' 
    });
    gsap.to('.confirm-modal-backdrop', { 
      opacity: 0, 
      duration: 0.15, 
      onComplete: () => {
        this.isConfirmModalOpen = false;
      }
    });
  }

  ejecutarAccionConfirmada() {
    this.confirmModalConfig.action();
    this.cerrarConfirmModal();
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
