import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor, ProveedorRequest } from '../../models/proveedor.model';
import { toast } from 'ngx-sonner';
import { gsap } from 'gsap';

@Component({
  selector: 'app-admin-proveedores',
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
          Vas a deshabilitar el proveedor "{{ deleteName }}".
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

    <!--======================= MODAL: CREAR/EDITAR =======================-->
    <div *ngIf="isFormModalOpen" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-nunito form-modal-backdrop opacity-0">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-full form-modal-content opacity-0 border border-gray-100">
        
        <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 class="text-xl font-black text-slate-800">{{ editandoProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor' }}</h3>
            <p class="text-slate-400 text-xs font-bold mt-1">Completa los datos de la empresa o laboratorio</p>
          </div>
          <button (click)="closeFormModal()" class="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form [formGroup]="formulario" (ngSubmit)="guardar()" class="p-6 overflow-y-auto">
          <div class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Razón Social / Nombre</label>
              <input type="text" formControlName="nombre" class="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-400 focus:bg-white outline-none transition-all" placeholder="Ej. Distribuidora Médica ABC">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Correo Electrónico</label>
                <input type="email" formControlName="email" class="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-400 focus:bg-white outline-none transition-all" placeholder="ejemplo@empresa.com">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Teléfono</label>
                <input type="text" formControlName="telefono" class="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-400 focus:bg-white outline-none transition-all" placeholder="+54 9 11 1234-5678">
              </div>
            </div>
          </div>

          <div class="mt-8 flex gap-3">
            <button type="button" (click)="closeFormModal()" class="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all">Cancelar</button>
            <button type="submit" [disabled]="formulario.invalid || guardando" class="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:pointer-events-none active:scale-95 transition-all shadow-md">
              {{ guardando ? 'Guardando...' : 'Guardar Proveedor' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="h-full flex flex-col font-nunito page-container opacity-0">
      
      <!-- Topbar Header -->
      <div class="bg-white px-8 py-5 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center shrink-0 mb-6 relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-32 h-32 bg-sky-50 rounded-full blur-2xl opacity-60"></div>
        <div class="absolute right-20 -bottom-10 w-24 h-24 bg-indigo-50 rounded-full blur-xl opacity-60"></div>
        <div class="relative z-10">
          <h2 class="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Directorio de Proveedores
          </h2>
          <p class="text-sm text-slate-500 font-medium mt-1">Laboratorios, distribuidoras y marcas asociadas.</p>
        </div>
        <button (click)="openFormModal()" class="relative z-10 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white px-5 py-2.5 rounded-xl font-extrabold transition-all shadow-md hover:shadow-sky-500/30 flex items-center gap-2 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nuevo Proveedor
        </button>
      </div>

      <!-- Tabla / Lista -->
      <div class="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
        <div *ngIf="cargando" class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-sky-100 border-t-sky-500"></div>
        </div>

        <div class="flex-1 overflow-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th class="p-5 font-bold">Razón Social</th>
                <th class="p-5 font-bold">Contacto</th>
                <th class="p-5 font-bold text-center">Estado</th>
                <th class="p-5 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 text-sm">
              <tr *ngFor="let prov of proveedores" class="hover:bg-slate-50/50 transition-colors group">
                <td class="p-5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center font-black text-lg shrink-0">
                      {{ prov.nombre.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-extrabold text-slate-800">{{ prov.nombre }}</p>
                      <p class="text-xs text-slate-400 font-bold mt-0.5">ID: #{{ prov.id }}</p>
                    </div>
                  </div>
                </td>
                <td class="p-5">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2 text-slate-600 font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      {{ prov.email || 'Sin correo' }}
                    </div>
                    <div class="flex items-center gap-2 text-slate-600 font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      {{ prov.telefono || 'Sin teléfono' }}
                    </div>
                  </div>
                </td>
                <td class="p-5 text-center">
                  <span [class]="prov.activo ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'" 
                        class="px-3 py-1 rounded-lg font-bold text-xs inline-flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full" [class]="prov.activo ? 'bg-emerald-500' : 'bg-red-500'"></span>
                    {{ prov.activo ? 'ACTIVO' : 'INACTIVO' }}
                  </span>
                </td>
                <td class="p-5 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button (click)="openFormModal(prov)" class="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-colors active:scale-90 cursor-pointer" title="Editar">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button (click)="confirmDelete(prov.id, prov.nombre)" class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors active:scale-90 cursor-pointer" title="Deshabilitar">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              
              <tr *ngIf="proveedores.length === 0 && !cargando">
                <td colspan="4" class="p-16 text-center text-slate-500">
                  <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                  </div>
                  <p class="font-extrabold text-lg text-slate-700">Sin proveedores</p>
                  <p class="text-sm mt-1">Registra tu primer laboratorio o distribuidor para comenzar.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminProveedoresComponent implements OnInit {
  private proveedorService = inject(ProveedorService);
  private fb = inject(FormBuilder);

  proveedores: Proveedor[] = [];
  cargando = true;
  
  isFormModalOpen = false;
  guardando = false;
  editandoProveedor: Proveedor | null = null;

  isDeleteModalOpen = false;
  deleteId: number | null = null;
  deleteName = '';

  formulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(150)]],
    email: ['', [Validators.email]],
    telefono: ['']
  });

  ngOnInit() {
    this.cargarProveedores();
    setTimeout(() => {
      gsap.fromTo('.page-container', 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    });
  }

  cargarProveedores() {
    this.cargando = true;
    this.proveedorService.listar().subscribe({
      next: (data) => {
        this.proveedores = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
        toast.error('No se pudieron cargar los proveedores');
      }
    });
  }

  openFormModal(prov?: Proveedor) {
    if (prov) {
      this.editandoProveedor = prov;
      this.formulario.patchValue({
        nombre: prov.nombre,
        email: prov.email,
        telefono: prov.telefono
      });
    } else {
      this.editandoProveedor = null;
      this.formulario.reset();
    }
    this.isFormModalOpen = true;
    
    setTimeout(() => {
      gsap.fromTo('.form-modal-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo('.form-modal-content', 
        { scale: 0.85, y: 40, opacity: 0 }, 
        { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.4)' }
      );
    });
  }

  closeFormModal() {
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
        this.isFormModalOpen = false;
        this.editandoProveedor = null;
      }
    });
  }

  guardar() {
    if (this.formulario.invalid) return;

    this.guardando = true;
    const request: ProveedorRequest = this.formulario.value;

    if (this.editandoProveedor) {
      this.proveedorService.actualizar(this.editandoProveedor.id, request).subscribe({
        next: () => {
          this.guardando = false;
          this.closeFormModal();
          this.cargarProveedores();
          toast.success('Proveedor actualizado con éxito');
        },
        error: (err) => {
          this.guardando = false;
          toast.error('Error al actualizar el proveedor');
        }
      });
    } else {
      this.proveedorService.crear(request).subscribe({
        next: () => {
          this.guardando = false;
          this.closeFormModal();
          this.cargarProveedores();
          toast.success('Proveedor registrado con éxito');
        },
        error: (err) => {
          this.guardando = false;
          toast.error('Error al registrar el proveedor');
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
    
    this.proveedorService.eliminar(this.deleteId).subscribe({
      next: () => {
        toast.success('Proveedor deshabilitado correctamente');
        this.closeDeleteModal();
        this.cargarProveedores();
      },
      error: () => {
        toast.error('Error al deshabilitar el proveedor');
        this.closeDeleteModal();
      }
    });
  }
}
