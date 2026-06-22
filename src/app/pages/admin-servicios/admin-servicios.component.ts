import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicioService } from '../../services/servicio.service';
import { ServicioResponse } from '../../models/servicio.model';
import { VeterinarioResponse } from '../../models/veterinario.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Encabezado -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 class="text-2xl font-extrabold text-slate-800">Catálogo de Servicios</h2>
          <p class="text-slate-500 font-bold text-sm">Gestiona los servicios médicos, tratamientos y estética de la clínica</p>
        </div>
        <button 
          (click)="openCreateModal()"
          class="flex items-center bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-sm shadow-sky-200">
          <!-- Icono Plus SVG -->
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo Servicio
        </button>
      </div>

      <!-- Spinner de Carga -->
      <div *ngIf="cargando" class="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div class="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
        <p class="text-slate-500 font-bold mt-4">Cargando catálogo de servicios...</p>
      </div>

      <!-- Mensaje de Error -->
      <div *ngIf="errorMsg" class="p-4 bg-red-50 text-red-700 font-bold rounded-2xl border border-red-100 text-center">
        {{ errorMsg }}
      </div>

      <!-- Grid de Servicios -->
      <div *ngIf="!cargando && !errorMsg" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Servicio Card -->
        <div 
          *ngFor="let serv of servicios"
          class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
          
          <div>
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-extrabold text-slate-800 text-lg group-hover:text-sky-500 transition-colors">{{ serv.nombre }}</h3>
              <span class="text-xl font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
                $ {{ serv.precio | number:'1.0-0' }}
              </span>
            </div>
            
            <p class="text-slate-500 text-sm font-semibold leading-relaxed mb-6 line-clamp-3">
              {{ serv.descripcion || 'Sin descripción detallada disponible.' }}
            </p>
          </div>

          <!-- Footer de la tarjeta: Veterinarios + Acciones -->
          <div class="border-t border-slate-50 pt-4 flex justify-between items-center mt-auto">
            <!-- Veterinarios Asignados (Overlapping Avatars) -->
            <div class="flex flex-col gap-1.5">
              <span class="text-slate-400 text-xs font-bold uppercase tracking-wider">Veterinarios</span>
              <div class="flex -space-x-2 overflow-hidden" *ngIf="serv.veterinarios && serv.veterinarios.length > 0; else noVets">
                <img 
                  *ngFor="let vet of serv.veterinarios"
                  [src]="vet.avatar || '/assets/images/avatars/chico.jpg'"
                  [title]="vet.nombreUsuario + ' - ' + vet.especialidad"
                  [alt]="vet.nombreUsuario"
                  class="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" />
              </div>
              <ng-template #noVets>
                <span class="text-xs text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-md">Sin asignar</span>
              </ng-template>
            </div>

            <!-- Acciones -->
            <div class="flex items-center gap-2">
              <button 
                (click)="openEditModal(serv)"
                title="Editar Servicio"
                class="p-2.5 bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-600 rounded-xl transition-all duration-200">
                <!-- Icono Editar SVG -->
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button 
                (click)="eliminarServicio(serv.id)"
                title="Eliminar Servicio"
                class="p-2.5 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl transition-all duration-200">
                <!-- Icono Papelera SVG -->
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado Vacío -->
      <div 
        *ngIf="!cargando && !errorMsg && servicios.length === 0" 
        class="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-lg mx-auto">
        <svg class="w-16 h-16 text-slate-300 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
        </svg>
        <h3 class="text-lg font-bold text-slate-700 mb-1">Catálogo Vacío</h3>
        <p class="text-slate-500 font-semibold text-sm mb-6">No hay servicios registrados en la plataforma.</p>
        <button 
          (click)="openCreateModal()"
          class="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-200">
          Crear Primer Servicio
        </button>
      </div>

      <!-- Modal de Formulario -->
      <div 
        *ngIf="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <div class="bg-white p-8 rounded-3xl shadow-xl max-w-2xl w-full border border-slate-100 max-h-[90vh] overflow-y-auto">
          
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-extrabold text-slate-800">
              {{ isEditMode ? 'Editar Servicio' : 'Nuevo Servicio Vendedor' }}
            </h3>
            <button 
              (click)="closeModal()"
              class="text-slate-400 hover:text-slate-600 p-1 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form (ngSubmit)="guardarServicio()" class="space-y-6">
            <!-- Nombre y Precio en fila horizontal -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div class="sm:col-span-2">
                <label class="block text-slate-700 font-bold text-sm mb-2">Nombre del Servicio</label>
                <input 
                  type="text" 
                  [(ngModel)]="nombre" 
                  name="nombre" 
                  placeholder="Ej. Consulta de Especialidad"
                  required
                  class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-semibold text-slate-800 placeholder-slate-400 text-sm transition-all" />
              </div>
              <div>
                <label class="block text-slate-700 font-bold text-sm mb-2">Precio Base ($)</label>
                <input 
                  type="number" 
                  [(ngModel)]="precio" 
                  name="precio" 
                  placeholder="Precio"
                  required
                  min="0"
                  class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-semibold text-slate-800 placeholder-slate-400 text-sm transition-all" />
              </div>
            </div>

            <!-- Descripción -->
            <div>
              <label class="block text-slate-700 font-bold text-sm mb-2">Descripción del Servicio</label>
              <textarea 
                [(ngModel)]="descripcion" 
                name="descripcion" 
                rows="3" 
                placeholder="Describe brevemente de qué trata el servicio..."
                class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-semibold text-slate-800 placeholder-slate-400 text-sm transition-all"></textarea>
            </div>

            <!-- Asignar Veterinarios -->
            <div>
              <label class="block text-slate-700 font-bold text-sm mb-1">Asignar Profesionales</label>
              <p class="text-slate-400 font-bold text-xs mb-3">Selecciona qué veterinarios realizarán este servicio</p>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-100">
                <div 
                  *ngFor="let vet of veterinarios"
                  (click)="toggleVet(vet.id)"
                  [class.border-sky-500]="isVetSelected(vet.id)"
                  [class.bg-sky-50]="isVetSelected(vet.id)"
                  class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white cursor-pointer select-none hover:bg-slate-50 hover:border-slate-350 transition-all">
                  
                  <!-- Checkbox interno -->
                  <div 
                    [class.bg-sky-500]="isVetSelected(vet.id)"
                    [class.border-sky-500]="isVetSelected(vet.id)"
                    class="w-5 h-5 rounded-md border-2 border-slate-300 flex items-center justify-center text-white transition-all shrink-0">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" *ngIf="isVetSelected(vet.id)">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>

                  <!-- Avatar -->
                  <img 
                    [src]="vet.avatar || '/assets/images/avatars/chico.jpg'" 
                    class="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100" />
                  
                  <div class="overflow-hidden">
                    <p class="text-xs font-extrabold text-slate-800 truncate">{{ vet.nombreUsuario }}</p>
                    <p class="text-[10px] text-slate-400 font-bold truncate">{{ vet.especialidad }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botones del Modal -->
            <div class="flex justify-end gap-3 border-t border-slate-50 pt-6">
              <button 
                type="button" 
                (click)="closeModal()"
                class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all">
                Cancelar
              </button>
              <button 
                type="submit"
                class="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm transition-all shadow-sm shadow-sky-200">
                {{ isEditMode ? 'Guardar Cambios' : 'Crear Servicio' }}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>

    <!-- Reusable Custom Confirmation Modal -->
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
export class AdminServiciosComponent implements OnInit {
  private servicioService = inject(ServicioService);

  servicios: ServicioResponse[] = [];
  veterinarios: VeterinarioResponse[] = [];
  cargando = true;
  errorMsg = '';

  showModal = false;
  isEditMode = false;
  editingId: number | null = null;

  nombre = '';
  descripcion = '';
  precio: number | null = null;
  selectedVetIds: number[] = [];

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
    this.cargarServicios();
    this.cargarVeterinarios();
  }

  cargarServicios() {
    this.cargando = true;
    this.servicioService.listarTodos().subscribe({
      next: (data) => {
        this.servicios = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error al cargar los servicios. Por favor, intente de nuevo.';
        this.cargando = false;
      }
    });
  }

  cargarVeterinarios() {
    this.servicioService.obtenerTodosLosVeterinarios().subscribe({
      next: (data) => {
        this.veterinarios = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.editingId = null;
    this.nombre = '';
    this.descripcion = '';
    this.precio = null;
    this.selectedVetIds = [];
    this.showModal = true;
  }

  openEditModal(serv: ServicioResponse) {
    this.isEditMode = true;
    this.editingId = serv.id;
    this.nombre = serv.nombre;
    this.descripcion = serv.descripcion;
    this.precio = serv.precio;
    this.selectedVetIds = serv.veterinarios.map(v => v.id);
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  toggleVet(id: number) {
    const idx = this.selectedVetIds.indexOf(id);
    if (idx > -1) {
      this.selectedVetIds.splice(idx, 1);
    } else {
      this.selectedVetIds.push(id);
    }
  }

  isVetSelected(id: number): boolean {
    return this.selectedVetIds.includes(id);
  }

  guardarServicio() {
    if (!this.nombre.trim() || this.precio === null || this.precio <= 0) {
      toast.warning('Por favor complete el nombre y un precio válido.');
      return;
    }
    if (this.selectedVetIds.length === 0) {
      toast.warning('Por favor asocie al menos un veterinario a este servicio.');
      return;
    }

    const request = {
      nombre: this.nombre,
      descripcion: this.descripcion,
      precio: this.precio,
      veterinarioIds: this.selectedVetIds
    };

    if (this.isEditMode && this.editingId !== null) {
      this.servicioService.actualizar(this.editingId, request).subscribe({
        next: () => {
          toast.success('Servicio actualizado correctamente.');
          this.cargarServicios();
          this.closeModal();
        },
        error: (err) => {
          toast.error('Error al actualizar el servicio: ' + (err.error?.message || err.message));
        }
      });
    } else {
      this.servicioService.crear(request).subscribe({
        next: () => {
          toast.success('Servicio creado correctamente.');
          this.cargarServicios();
          this.closeModal();
        },
        error: (err) => {
          toast.error('Error al crear el servicio: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  eliminarServicio(id: number) {
    this.confirmModalConfig = {
      title: '¿Eliminar Servicio?',
      message: '¿Está seguro de que desea eliminar este servicio de forma permanente? Se desvincularán los veterinarios asociados.',
      icon: '🗑️',
      iconClass: 'bg-red-50 text-red-600',
      btnClass: 'bg-red-500 hover:bg-red-600',
      action: () => {
        this.servicioService.eliminar(id).subscribe({
          next: () => {
            toast.success('Servicio eliminado correctamente.');
            this.cargarServicios();
          },
          error: (err) => {
            toast.error('Error al eliminar el servicio: ' + (err.error?.message || err.message));
          }
        });
      }
    };
    this.isConfirmModalOpen = true;
  }

  ejecutarAccionConfirmada() {
    this.confirmModalConfig.action();
    this.cerrarConfirmModal();
  }

  cerrarConfirmModal() {
    this.isConfirmModalOpen = false;
  }
}
