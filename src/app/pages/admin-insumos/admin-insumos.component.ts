import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InsumoService } from '../../services/insumo.service';
import { Insumo, InsumoRequest } from '../../models/insumo.model';
import { toast } from 'ngx-sonner';
import { gsap } from 'gsap';

@Component({
  selector: 'app-admin-insumos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!--======================= MODAL: CONFIRMACIÓN DE ELIMINACIÓN =======================-->
    <div *ngIf="isDeleteModalOpen" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 delete-modal-backdrop opacity-0">
      <div class="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-sm w-full p-8 relative delete-modal-content opacity-0">
        <div class="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h3 class="text-xl font-black text-slate-800 mb-2 text-center">¿Estás seguro?</h3>
        <p class="text-slate-500 text-sm font-bold text-center mb-6">
          Vas a deshabilitar el insumo "{{ deleteName }}".
        </p>
        <div class="flex justify-center gap-3">
          <button type="button" (click)="closeDeleteModal()" class="bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-600 font-extrabold py-2.5 px-6 rounded-xl transition-all duration-200 text-sm cursor-pointer">
            Cancelar
          </button>
          <button type="button" (click)="executeDelete()" class="bg-red-500 hover:bg-red-600 active:scale-95 text-white font-extrabold py-2.5 px-6 rounded-xl transition-all duration-200 text-sm shadow-md shadow-red-500/20 cursor-pointer">
            Deshabilitar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Formulario -->
    <div *ngIf="mostrarModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-nunito form-modal-backdrop opacity-0">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-full form-modal-content opacity-0">
        
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
          <h3 class="text-lg font-extrabold text-slate-800">{{ insumoEditando ? 'Editar Insumo' : 'Nuevo Insumo' }}</h3>
          <button (click)="cerrarModal()" class="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form [formGroup]="formulario" (ngSubmit)="guardar()" class="p-6 overflow-y-auto">
          <div class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Nombre del Insumo</label>
              <input type="text" formControlName="nombre" class="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-400 focus:bg-white outline-none transition-all" placeholder="Ej. Vacuna Antirrábica">
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Descripción (Opcional)</label>
              <textarea formControlName="descripcion" rows="2" class="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-400 focus:bg-white outline-none transition-all resize-none" placeholder="Breve descripción del producto..."></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Unidad de Medida</label>
                <select formControlName="unidadMedida" class="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-400 focus:bg-white outline-none transition-all appearance-none cursor-pointer">
                  <option value="unidades">Unidades (Cajas/Unid)</option>
                  <option value="ml">Mililitros (ml)</option>
                  <option value="mg">Miligramos (mg)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Stock Mínimo</label>
                <input type="number" min="0" formControlName="stockMinimo" class="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-400 focus:bg-white outline-none transition-all" placeholder="0">
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Precio Unitario ($)</label>
              <input type="number" step="0.01" min="0" formControlName="precioUnitario" class="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-sky-400 focus:bg-white outline-none transition-all" placeholder="0.00">
            </div>
          </div>

          <div class="mt-8 flex gap-3">
            <button type="button" (click)="cerrarModal()" class="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">Cancelar</button>
            <button type="submit" [disabled]="formulario.invalid || guardando" class="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md">
              {{ guardando ? 'Guardando...' : 'Guardar Insumo' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="h-full flex flex-col font-nunito page-container opacity-0">
      <div class="bg-white px-8 py-5 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center shrink-0 mb-6 relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-32 h-32 bg-sky-50 rounded-full blur-2xl opacity-60"></div>
        <div class="absolute right-20 -bottom-10 w-24 h-24 bg-indigo-50 rounded-full blur-xl opacity-60"></div>
        <div class="relative z-10">
          <h2 class="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Gestión de Insumos Médicos
          </h2>
          <p class="text-sm text-slate-500 font-medium mt-1">Control de inventario, vacunas y suministros.</p>
        </div>
        <button (click)="abrirModal()" class="relative z-10 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nuevo Insumo
        </button>
      </div>

      <div class="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
        <div *ngIf="cargando" class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-sky-100 border-t-sky-500"></div>
        </div>

        <div class="flex-1 overflow-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th class="p-4 font-bold">Insumo</th>
                <th class="p-4 font-bold">Unidad</th>
                <th class="p-4 font-bold text-right">Precio</th>
                <th class="p-4 font-bold text-center">Stock Mínimo</th>
                <th class="p-4 font-bold text-center">Estado</th>
                <th class="p-4 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 text-sm">
              <tr *ngFor="let insumo of insumos" class="hover:bg-slate-50/50 transition-colors group">
                <td class="p-4">
                  <p class="font-bold text-slate-800">{{ insumo.nombre }}</p>
                  <p class="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{{ insumo.descripcion || 'Sin descripción' }}</p>
                </td>
                <td class="p-4 text-slate-600 font-medium capitalize">{{ insumo.unidadMedida }}</td>
                <td class="p-4 text-slate-800 font-extrabold text-right">$\{{ insumo.precioUnitario | number:'1.2-2' }}</td>
                <td class="p-4 text-center">
                  <span class="bg-amber-50 text-amber-600 px-3 py-1 rounded-lg font-bold text-xs">{{ insumo.stockMinimo }}</span>
                </td>
                <td class="p-4 text-center">
                  <span [class]="insumo.activo ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'" 
                        class="px-3 py-1 rounded-lg font-bold text-xs">
                    {{ insumo.activo ? 'ACTIVO' : 'INACTIVO' }}
                  </span>
                </td>
                <td class="p-4 text-center">
                  <div class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button (click)="abrirModal(insumo)" class="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-colors" title="Editar">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button (click)="confirmDelete(insumo.id, insumo.nombre)" class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Eliminar">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="insumos.length === 0 && !cargando">
                <td colspan="6" class="p-12 text-center text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
                  <p class="font-bold">No hay insumos registrados</p>
                  <p class="text-sm">Hacé clic en "Nuevo Insumo" para comenzar.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminInsumosComponent implements OnInit {
  private insumoService = inject(InsumoService);
  private fb = inject(FormBuilder);

  insumos: Insumo[] = [];
  cargando = true;
  
  mostrarModal = false;
  guardando = false;
  insumoEditando: Insumo | null = null;

  isDeleteModalOpen = false;
  deleteId: number | null = null;
  deleteName = '';

  formulario: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    unidadMedida: ['unidades', Validators.required],
    precioUnitario: [0, [Validators.required, Validators.min(0.01)]],
    stockMinimo: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit() {
    this.cargarInsumos();
    setTimeout(() => {
      gsap.fromTo('.page-container', 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    });
  }

  cargarInsumos() {
    this.cargando = true;
    this.insumoService.listar().subscribe({
      next: (data) => {
        this.insumos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
        toast.error('No se pudieron cargar los insumos');
      }
    });
  }

  abrirModal(insumo?: Insumo) {
    if (insumo) {
      this.insumoEditando = insumo;
      this.formulario.patchValue({
        nombre: insumo.nombre,
        descripcion: insumo.descripcion,
        unidadMedida: insumo.unidadMedida,
        precioUnitario: insumo.precioUnitario,
        stockMinimo: insumo.stockMinimo
      });
    } else {
      this.insumoEditando = null;
      this.formulario.reset({ unidadMedida: 'unidades', precioUnitario: 0, stockMinimo: 0 });
    }
    this.mostrarModal = true;
    
    setTimeout(() => {
      gsap.fromTo('.form-modal-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo('.form-modal-content', 
        { scale: 0.85, y: 40, opacity: 0 }, 
        { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.4)' }
      );
    });
  }

  cerrarModal() {
    gsap.to('.form-modal-content', { 
      scale: 0.85, 
      y: 40, 
      opacity: 0, 
      duration: 0.2, 
      ease: 'power2.in' 
    });
    gsap.to('.form-modal-backdrop', { 
      opacity: 0, 
      duration: 0.2, 
      onComplete: () => {
        this.mostrarModal = false;
        this.insumoEditando = null;
      }
    });
  }

  guardar() {
    if (this.formulario.invalid) return;

    this.guardando = true;
    const request: InsumoRequest = this.formulario.value;

    if (this.insumoEditando) {
      this.insumoService.actualizar(this.insumoEditando.id, request).subscribe({
        next: () => {
          this.guardando = false;
          this.cerrarModal();
          this.cargarInsumos();
          toast.success('Insumo actualizado con éxito');
        },
        error: (err) => {
          this.guardando = false;
          toast.error('No se pudo actualizar el insumo');
        }
      });
    } else {
      this.insumoService.crear(request).subscribe({
        next: () => {
          this.guardando = false;
          this.cerrarModal();
          this.cargarInsumos();
          toast.success('Insumo creado con éxito');
        },
        error: (err) => {
          this.guardando = false;
          toast.error('No se pudo crear el insumo');
        }
      });
    }
  }

  confirmDelete(id: number, name: string) {
    this.deleteId = id;
    this.deleteName = name;
    this.isDeleteModalOpen = true;
    setTimeout(() => {
      gsap.fromTo('.delete-modal-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo('.delete-modal-content', 
        { scale: 0.85, y: 40, opacity: 0 }, 
        { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.4)' }
      );
    });
  }

  closeDeleteModal() {
    gsap.to('.delete-modal-content', { 
      scale: 0.85, 
      y: 40, 
      opacity: 0, 
      duration: 0.2, 
      ease: 'power2.in' 
    });
    gsap.to('.delete-modal-backdrop', { 
      opacity: 0, 
      duration: 0.2, 
      onComplete: () => {
        this.isDeleteModalOpen = false;
        this.deleteId = null;
        this.deleteName = '';
      }
    });
  }

  executeDelete() {
    if (this.deleteId === null) return;
    
    this.insumoService.eliminar(this.deleteId).subscribe({
      next: () => {
        toast.success('Insumo deshabilitado correctamente');
        this.closeDeleteModal();
        this.cargarInsumos();
      },
      error: () => {
        toast.error('Error al deshabilitar el insumo');
        this.closeDeleteModal();
      }
    });
  }
}
