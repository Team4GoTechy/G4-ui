import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsumoService } from '../../services/insumo.service';
import { SolicitudReposicionService } from '../../services/solicitud-reposicion.service';
import { Insumo } from '../../models/insumo.model';
import { SolicitudReposicionResponse, SolicitudReposicionRequest } from '../../models/solicitud-reposicion.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-doctor-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 font-nunito animate-fade-in">
      <!-- Header -->
      <div class="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 class="text-2xl font-extrabold text-emerald-950 flex items-center gap-2">
            <span>📋</span> Solicitar Insumos Médicos
          </h2>
          <p class="text-emerald-600 font-bold text-sm">Crea peticiones de reposición para el Administrador</p>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Formulario de Solicitud -->
        <div class="lg:w-1/3 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit space-y-4">
          <h3 class="font-extrabold text-gray-800 text-lg">Nueva Petición</h3>
          
          <div *ngIf="cargandoInsumos" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
          </div>

          <form *ngIf="!cargandoInsumos" (ngSubmit)="enviarSolicitud()" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Insumo Necesario <span class="text-red-500">*</span></label>
              <select [(ngModel)]="solicitudData.insumoId" name="insumoId" required (change)="onInsumoSelected()"
                      class="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-400 font-bold text-gray-800">
                <option [ngValue]="0" disabled selected>Seleccione un insumo...</option>
                <option *ngFor="let item of insumos" [ngValue]="item.id">
                  {{ item.nombre }} ({{ item.unidadMedida }})
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Cantidad <span class="text-red-500">*</span></label>
                <input type="number" min="1" [(ngModel)]="solicitudData.cantidad" name="cantidad" required
                       class="w-full bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-400 font-bold text-gray-800">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Medida</label>
                <input type="text" [value]="unidadMedidaSeleccionada" disabled
                       class="w-full bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl text-sm outline-none text-gray-400 font-bold">
              </div>
            </div>

            <button type="submit" [disabled]="enviando"
                    class="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 rounded-xl shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 mt-2">
              {{ enviando ? 'Enviando...' : 'Enviar Solicitud' }}
            </button>
          </form>
        </div>

        <!-- Historial de Peticiones -->
        <div class="lg:w-2/3 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div class="p-6 border-b border-gray-50 bg-emerald-50/10">
            <h3 class="font-extrabold text-emerald-950 text-lg">Historial de Solicitudes Propias</h3>
          </div>

          <div *ngIf="cargandoHistorial" class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          </div>

          <div *ngIf="!cargandoHistorial && solicitudes.length === 0" class="text-center py-20 text-gray-500 font-semibold">
            <span class="text-4xl block mb-2">📋</span>
            No has realizado ninguna solicitud de reposición todavía.
          </div>

          <div *ngIf="!cargandoHistorial && solicitudes.length > 0" class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th class="p-4 font-bold">Solicitud ID</th>
                  <th class="p-4 font-bold">Detalle Insumo</th>
                  <th class="p-4 font-bold">Fecha Petición</th>
                  <th class="p-4 font-bold">Estado</th>
                </tr>
              </thead>
              <tbody class="text-sm font-semibold divide-y divide-gray-50">
                <tr *ngFor="let sol of solicitudes" class="hover:bg-slate-50/50 transition-colors">
                  <td class="p-4">
                    <span class="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-black">#{{ sol.id }}</span>
                  </td>
                  <td class="p-4">
                    <div class="space-y-1">
                      <div *ngFor="let det of sol.detalles" class="text-slate-800 font-bold">
                        {{ det.nombreInsumo }} <span class="text-emerald-600">x{{ det.cantidadSolicitada }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="p-4 text-gray-500">
                    {{ sol.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}
                  </td>
                  <td class="p-4">
                    <span [ngClass]="getEstadoBadgeClase(sol.estado)" class="px-3 py-1 rounded-full text-xs font-black uppercase">
                      {{ sol.estado }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DoctorSolicitudesComponent implements OnInit {
  private insumoService = inject(InsumoService);
  private solicitudService = inject(SolicitudReposicionService);

  insumos: Insumo[] = [];
  solicitudes: SolicitudReposicionResponse[] = [];
  cargandoInsumos = true;
  cargandoHistorial = true;
  enviando = false;

  unidadMedidaSeleccionada = '-';
  solicitudData = {
    insumoId: 0,
    cantidad: 1
  };

  ngOnInit() {
    this.cargarInsumos();
    this.cargarHistorial();
  }

  cargarInsumos() {
    this.cargandoInsumos = true;
    this.insumoService.listar().subscribe({
      next: (res) => {
        this.insumos = (res || []).filter(item => item.activo);
        this.cargandoInsumos = false;
      },
      error: (err) => {
        console.error('Error al cargar insumos', err);
        toast.error('No se pudo cargar la lista de insumos.');
        this.cargandoInsumos = false;
      }
    });
  }

  cargarHistorial() {
    this.cargandoHistorial = true;
    this.solicitudService.listarMisSolicitudes().subscribe({
      next: (res) => {
        // Ordenamos por ID descendente para ver las más recientes primero
        this.solicitudes = (res || []).sort((a, b) => b.id - a.id);
        this.cargandoHistorial = false;
      },
      error: (err) => {
        console.error('Error al cargar solicitudes', err);
        toast.error('No se pudo obtener el historial de solicitudes.');
        this.cargandoHistorial = false;
      }
    });
  }

  onInsumoSelected() {
    const selected = this.insumos.find(i => i.id === this.solicitudData.insumoId);
    if (selected) {
      this.unidadMedidaSeleccionada = selected.unidadMedida;
    }
  }

  enviarSolicitud() {
    if (this.solicitudData.insumoId <= 0 || this.solicitudData.cantidad <= 0) {
      toast.error('Seleccione un insumo e indique una cantidad válida.');
      return;
    }

    const payload: SolicitudReposicionRequest = {
      detalles: [
        {
          insumoId: this.solicitudData.insumoId,
          cantidadSolicitada: this.solicitudData.cantidad
        }
      ]
    };

    this.enviando = true;
    this.solicitudService.crear(payload).subscribe({
      next: () => {
        toast.success('Petición de reposición enviada al Administrador.');
        this.enviando = false;
        this.solicitudData = {
          insumoId: 0,
          cantidad: 1
        };
        this.unidadMedidaSeleccionada = '-';
        this.cargarHistorial(); // Recargar historial
      },
      error: (err) => {
        console.error('Error al enviar solicitud', err);
        toast.error(err.error?.message || 'Error al enviar la solicitud de reposición.');
        this.enviando = false;
      }
    });
  }

  getEstadoBadgeClase(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'bg-amber-50 text-amber-600';
      case 'APROBADO': return 'bg-emerald-50 text-emerald-600';
      case 'CANCELADO': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  }
}
