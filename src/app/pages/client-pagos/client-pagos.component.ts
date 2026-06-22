import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitaService } from '../../services/cita.service';
import { CitaResponse } from '../../models/cita.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-client-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full bg-slate-50 p-8 rounded-2xl border border-gray-100 flex flex-col font-nunito overflow-y-auto">
      <!-- Encabezado -->
      <div class="mb-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h1 class="text-3xl font-extrabold text-slate-800">Pagos y Facturación</h1>
        <p class="text-slate-500 font-bold text-sm">Gestiona y abona los servicios médicos y consultas realizadas por tus mascotas.</p>
      </div>

      <!-- Spinner de Carga Global -->
      <div *ngIf="cargando" class="flex flex-col justify-center items-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-sky-200 border-t-sky-500"></div>
        <p class="text-slate-500 font-bold mt-4">Cargando cuentas...</p>
      </div>

      <div *ngIf="!cargando" class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <!-- Columna Izquierda: Facturas Pendientes (Ocupa 2 cols) -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h2 class="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
              <!-- Icono Factura SVG -->
              <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
              Facturas Pendientes de Pago
            </h2>

            <div *ngIf="facturasPendientes.length === 0" class="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-100 flex flex-col justify-center items-center">
              <!-- Icono Success SVG -->
              <svg class="w-12 h-12 text-emerald-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-slate-500 font-extrabold">¡Al día!</p>
              <p class="text-slate-400 text-xs mt-1">No tienes facturas pendientes de pago para tus mascotas.</p>
            </div>

            <div *ngIf="facturasPendientes.length > 0" class="space-y-4">
              <!-- Card de Factura -->
              <div 
                *ngFor="let f of facturasPendientes"
                class="p-5 rounded-2xl border border-slate-100 hover:border-sky-100 bg-slate-50/40 hover:bg-white transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                
                <div class="flex items-center gap-4">
                  <!-- Icono de Servicio Medico -->
                  <div class="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center border border-sky-100 shrink-0">
                    <svg class="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-extrabold text-slate-800 text-sm">{{ getDetalleServicio(f.notas).nombre }}</h3>
                    <p class="text-xs text-slate-400 font-bold mt-1">
                      Mascota: <span class="text-slate-600">{{ f.mascotaNombre }}</span> | 
                      Veterinario: <span class="text-slate-600">{{ f.veterinarioNombre }}</span>
                    </p>
                    <p class="text-[10px] text-slate-400 font-semibold mt-0.5">
                      Fecha: {{ f.fechaHora | date:'dd/MM/yyyy HH:mm' }}hs
                    </p>
                  </div>
                </div>

                <div class="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                  <div class="text-right">
                    <span class="text-lg font-black text-emerald-600">
                      $ {{ getDetalleServicio(f.notas).precio | number:'1.0-0' }}
                    </span>
                  </div>
                  <button 
                    (click)="abrirPago(f)"
                    class="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all duration-200 shadow-sm shadow-sky-100 shrink-0">
                    Pagar Factura
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Historial de Facturas Pagadas (Ocupa 1 col) -->
        <div class="space-y-6">
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h2 class="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
              <!-- Icono Historial SVG -->
              <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Historial de Pagos
            </h2>

            <div *ngIf="facturasPagadas.length === 0" class="text-center py-8 text-slate-400 italic text-xs">
              No tienes transacciones registradas.
            </div>

            <div *ngIf="facturasPagadas.length > 0" class="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
              <div 
                *ngFor="let f of facturasPagadas"
                class="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex justify-between items-center gap-2 hover:border-slate-200 transition-all">
                <div>
                  <h4 class="font-extrabold text-slate-800 text-xs">{{ getDetalleServicio(f.notas).nombre }}</h4>
                  <p class="text-[10px] text-slate-400 font-semibold mt-0.5">{{ f.fechaHora | date:'dd/MM/yyyy' }} - Pet: {{ f.mascotaNombre }}</p>
                  <!-- Badge Pagado -->
                  <span class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-extrabold mt-1">
                    <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                    Pagado
                  </span>
                </div>
                <div class="text-right">
                  <span class="text-sm font-black text-slate-700">
                    $ {{ getDetalleServicio(f.notas).precio | number:'1.0-0' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Modal Checkout Pasarela de Pago -->
      <div 
        *ngIf="showPaymentModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        
        <div class="bg-white p-8 rounded-3xl shadow-xl max-w-4xl w-full border border-slate-100 transition-all transform overflow-hidden relative">
          
          <!-- Botón Cerrar (Deshabilitado mientras procesa) -->
          <button 
            *ngIf="!paying && !paymentSuccess"
            (click)="cerrarPago()"
            class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- 1. Formulario y Pasarela -->
          <div *ngIf="!paying && !paymentSuccess" class="flex flex-col">
            <div class="text-center mb-6">
              <h3 class="text-2xl font-extrabold text-slate-800">Finalizar Pago</h3>
              <p class="text-slate-400 text-sm font-semibold mt-1">Simula tu transacción bancaria de forma segura</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              <!-- Lado Izquierdo: Resumen y Tarjeta -->
              <div class="space-y-6">
                <!-- Resumen de Costo -->
                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <p class="text-xs text-slate-400 font-bold">Servicio a abonar</p>
                    <p class="text-sm font-extrabold text-slate-800 mt-0.5">
                      {{ citaParaPagar ? getDetalleServicio(citaParaPagar.notas).nombre : '' }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-slate-400 font-bold">Total</p>
                    <p class="text-lg font-black text-emerald-600">
                      $ {{ citaParaPagar ? (getDetalleServicio(citaParaPagar.notas).precio | number:'1.0-0') : '0' }}
                    </p>
                  </div>
                </div>

                <!-- Preview Tarjeta de Crédito (Efecto Premium) -->
                <div class="relative bg-gradient-to-br from-slate-800 to-slate-950 p-6 rounded-2xl shadow-lg text-white font-mono space-y-8 select-none">
                  <!-- Chip y Red Card -->
                  <div class="flex justify-between items-center">
                    <div class="w-10 h-8 bg-gradient-to-r from-amber-400 to-yellow-200 rounded-lg"></div>
                    <span class="italic font-bold text-sky-400 text-lg">PETCARD</span>
                  </div>

                  <!-- Número de Tarjeta -->
                  <div class="text-xl tracking-wider font-semibold text-center py-2 text-slate-200">
                    {{ formatNumeroTarjeta(tarjetaNumero) || '•••• •••• •••• ••••' }}
                  </div>

                  <!-- Dueño y Fecha -->
                  <div class="flex justify-between items-center text-xs text-slate-400">
                    <div>
                      <p class="uppercase tracking-widest text-[9px]">Titular</p>
                      <p class="font-bold text-white uppercase mt-0.5 truncate max-w-[150px]">
                        {{ tarjetaNombre || 'NOMBRE APELLIDO' }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="uppercase tracking-widest text-[9px]">Vence</p>
                      <p class="font-bold text-white mt-0.5">
                        {{ tarjetaExpiracion || 'MM/AA' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lado Derecho: Campos del Formulario -->
              <div class="bg-white p-2">
                <form (ngSubmit)="realizarPago()" class="space-y-4">
                  <div>
                    <label class="block text-slate-700 font-bold text-xs mb-1.5">Número de Tarjeta</label>
                    <input 
                      type="text" 
                      [(ngModel)]="tarjetaNumero" 
                      name="tarjeta"
                      placeholder="4000 1234 5678 9010" 
                      maxlength="19"
                      required
                      class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-semibold text-slate-850" />
                  </div>

                  <div>
                    <label class="block text-slate-700 font-bold text-xs mb-1.5">Nombre en la Tarjeta</label>
                    <input 
                      type="text" 
                      [(ngModel)]="tarjetaNombre" 
                      name="nombre"
                      placeholder="JANE DOE" 
                      required
                      class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-semibold uppercase text-slate-850" />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-slate-700 font-bold text-xs mb-1.5">Expiración</label>
                      <input 
                        type="text" 
                        [(ngModel)]="tarjetaExpiracion" 
                        name="exp"
                        placeholder="12/28" 
                        maxlength="5"
                        required
                        class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-semibold text-slate-850" />
                    </div>
                    <div>
                      <label class="block text-slate-700 font-bold text-xs mb-1.5">CVV</label>
                      <input 
                        type="password" 
                        [(ngModel)]="tarjetaCvv" 
                        name="cvv"
                        placeholder="•••" 
                        maxlength="3"
                        required
                        class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-semibold text-slate-850" />
                    </div>
                  </div>

                  <div class="flex justify-end gap-3 pt-4">
                    <button 
                      type="button" 
                      (click)="cerrarPago()"
                      class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-all">
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      class="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition-all shadow-sm shadow-sky-100 flex items-center gap-2">
                      Pagar Factura
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>

          <!-- 2. Pantalla Procesando Pago (Loader) -->
          <div *ngIf="paying" class="flex flex-col items-center justify-center py-16 space-y-4">
            <div class="w-16 h-16 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin"></div>
            <div class="text-center">
              <h3 class="font-extrabold text-slate-800 text-lg">Procesando Transacción</h3>
              <p class="text-slate-400 text-xs font-semibold mt-1">Validando datos bancarios con la red de pagos...</p>
            </div>
          </div>

          <!-- 3. Pantalla de Éxito del Pago -->
          <div *ngIf="paymentSuccess" class="flex flex-col items-center justify-center py-16 space-y-4 text-center">
            <!-- Icono Success Grande Animado -->
            <div class="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 text-emerald-500 scale-110 transition-transform duration-300">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <h3 class="font-extrabold text-slate-800 text-lg">¡Abonado Correctamente!</h3>
              <p class="text-slate-400 text-xs font-bold mt-1">El recibo de pago ha sido generado y enviado a tu e-mail.</p>
              <p class="text-[11px] text-emerald-600 font-extrabold bg-emerald-50 px-3 py-1 rounded-xl mt-3 inline-block">
                Transacción #TX-{{ citaParaPagar?.id }}OK
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  `
})
export class ClientPagosComponent implements OnInit {
  private citaService = inject(CitaService);

  citas: CitaResponse[] = [];
  cargando = true;

  showPaymentModal = false;
  citaParaPagar: CitaResponse | null = null;
  paying = false;
  paymentSuccess = false;

  // Form
  tarjetaNumero = '';
  tarjetaNombre = '';
  tarjetaExpiracion = '';
  tarjetaCvv = '';

  ngOnInit() {
    this.cargarCitas();
  }

  cargarCitas() {
    this.cargando = true;
    this.citaService.obtenerMisCitas().subscribe({
      next: (data) => {
        this.citas = data || [];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando citas para pagos', err);
        this.cargando = false;
      }
    });
  }

  get facturasPendientes(): CitaResponse[] {
    return this.citas.filter(c => c.estado === 'COMPLETADA' && !c.pagado);
  }

  get facturasPagadas(): CitaResponse[] {
    return this.citas.filter(c => c.estado === 'COMPLETADA' && c.pagado);
  }

  getDetalleServicio(notas: string) {
    if (!notas) return { nombre: 'Consulta Veterinaria General', precio: 8000 };
    
    // Parse format "Servicio: XXXXX ($ YYYYY) - Notas: ..."
    const match = notas.match(/Servicio:\s*([^\(]+)\s*\(\$\s*([\d\.,]+)\)/);
    if (match) {
      return {
        nombre: match[1].trim(),
        precio: parseFloat(match[2].replace(/\./g, '').replace(/,/g, ''))
      };
    }
    
    // Fallback if not matching but contains notes
    return { nombre: 'Consulta Médica de Control', precio: 10000 };
  }

  abrirPago(cita: CitaResponse) {
    this.citaParaPagar = cita;
    this.tarjetaNumero = '';
    this.tarjetaNombre = '';
    this.tarjetaExpiracion = '';
    this.tarjetaCvv = '';
    this.paying = false;
    this.paymentSuccess = false;
    this.showPaymentModal = true;
  }

  cerrarPago() {
    this.showPaymentModal = false;
    this.citaParaPagar = null;
  }

  formatNumeroTarjeta(val: string): string {
    if (!val) return '';
    const digits = val.replace(/\D/g, '');
    const matches = digits.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return val;
    }
  }

  realizarPago() {
    if (!this.citaParaPagar) return;
    
    this.paying = true;
    
    // Simulate transaction delay
    setTimeout(() => {
      if (this.citaParaPagar) {
        this.citaService.pagarCita(this.citaParaPagar.id).subscribe({
          next: () => {
            this.paying = false;
            this.paymentSuccess = true;
            
            // Wait 1.5 seconds on success screen before reload
            setTimeout(() => {
              this.cerrarPago();
              this.cargarCitas();
            }, 1800);
          },
          error: (err) => {
            console.error('Error al registrar pago', err);
            toast.error('La transacción bancaria falló. Por favor intente de nuevo.');
            this.paying = false;
          }
        });
      }
    }, 2000);
  }
}
