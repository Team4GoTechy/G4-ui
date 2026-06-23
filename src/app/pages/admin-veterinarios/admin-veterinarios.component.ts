import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { VeterinarioService } from '../../services/veterinario.service';
import { VeterinarioResponse, HorarioResponse, BloqueoFechaResponse } from '../../models/veterinario.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-admin-veterinarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-black text-slate-800 tracking-tight">Staff Veterinario</h2>
          <p class="text-slate-500 font-semibold text-sm">Administra los profesionales, sus horarios y bloqueos de agenda</p>
        </div>
        <button (click)="openCreateModal()" class="bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-extrabold py-2.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-sky-500/20 flex items-center gap-2 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
          </svg>
          Agregar Profesional
        </button>
      </div>

      <!-- Spinner de carga -->
      <div *ngIf="cargando" class="flex flex-col items-center justify-center py-20">
        <svg class="animate-spin h-10 w-10 text-sky-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-slate-500 font-bold text-sm">Cargando profesionales...</span>
      </div>

      <!-- Grilla de Veterinarios -->
      <div *ngIf="!cargando" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div *ngFor="let vet of veterinarios" class="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-gray-100 hover:border-sky-100 transition-all duration-300 flex flex-col justify-between group">
          
          <div class="space-y-4">
            <!-- Header Card: Avatar + Badge + Nombre -->
            <div class="flex items-start gap-4">
              <img [src]="vet.avatar || '/assets/images/avatars/chico.jpg'" class="w-16 h-16 rounded-2xl border-2 border-slate-50 object-cover shadow-sm group-hover:scale-105 transition-transform duration-300">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="font-extrabold text-slate-800 text-lg truncate">{{ vet.nombreCompleto }}</h3>
                  <span [class]="vet.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'" class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0">
                    {{ vet.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
                <p class="text-sky-500 text-xs font-extrabold uppercase tracking-wide mt-0.5">{{ vet.especialidad }}</p>
                <p class="text-slate-400 text-[11px] font-bold mt-0.5">Matrícula: {{ vet.matricula }}</p>
              </div>
            </div>

            <!-- Bio -->
            <p class="text-slate-500 text-xs font-medium leading-relaxed italic bg-slate-50/50 p-3 rounded-2xl" *ngIf="vet.bio">
              "{{ vet.bio }}"
            </p>

            <!-- Datos de Contacto -->
            <div class="space-y-1.5 text-xs text-slate-600 font-semibold bg-gray-50/60 p-3 rounded-2xl border border-gray-100/50 text-ellipsis overflow-hidden">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="truncate">{{ vet.email }}</span>
              </div>
              <div class="flex items-center gap-2" *ngIf="vet.telefono">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 00.996.81H10a3 3 0 003 3v1a3 3 0 00-3 3H9.725a1 1 0 00-.81.996l-2.2.548a1 1 0 01-.725-.94V19a2 2 0 01-2-2V5z" />
                </svg>
                <span>{{ vet.telefono }}</span>
              </div>
            </div>

            <!-- Servicios -->
            <div class="space-y-1">
              <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Servicios Habilitados</span>
              <div class="flex flex-wrap gap-1">
                <span *ngFor="let serv of vet.serviciosHabilitados" class="bg-sky-50 text-sky-600 border border-sky-100 px-2 py-0.5 rounded-lg text-[10px] font-extrabold">
                  {{ serv }}
                </span>
                <span *ngIf="!vet.serviciosHabilitados || vet.serviciosHabilitados.length === 0" class="text-slate-400 text-xs italic">
                  Ninguno asignado
                </span>
              </div>
            </div>
          </div>

          <!-- Acciones de Tarjeta -->
          <div class="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
            <!-- Toggle Estado -->
            <button (click)="toggleActivo(vet)" [class]="vet.activo ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'" class="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl transition-all cursor-pointer">
              {{ vet.activo ? 'Desactivar' : 'Activar' }}
            </button>

            <!-- Botones Config -->
            <div class="flex items-center gap-2">
              <button (click)="openHorariosModal(vet)" title="Configurar Horarios" class="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors cursor-pointer border border-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button (click)="openBloqueosModal(vet)" title="Bloqueo de Agenda" class="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors cursor-pointer border border-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button (click)="openEditModal(vet)" title="Editar Perfil" class="p-2 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-xl transition-colors cursor-pointer border border-sky-100/50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button (click)="eliminarVet(vet)" title="Eliminar" class="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer border border-rose-100/50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
        </div>

        <!-- Empty State -->
        <div *ngIf="veterinarios.length === 0" class="col-span-full bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="text-lg font-extrabold text-slate-700">No hay veterinarios registrados</h3>
          <p class="text-slate-400 text-sm mt-1">Registra un nuevo profesional para empezar a gestionar citas y turnos.</p>
        </div>
      </div>
    </div>

    <!--======================= MODAL: REGISTRO / EDICIÓN DE VETERINARIO =======================-->
    <div *ngIf="showVetModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <h3 class="text-2xl font-black text-slate-800 mb-1">
          {{ isEditing ? 'Editar Perfil Veterinario' : 'Registrar Nuevo Veterinario' }}
        </h3>
        <p class="text-slate-400 text-xs font-bold mb-6">Completa la información profesional y credenciales de acceso</p>

        <form [formGroup]="vetForm" (ngSubmit)="guardarVet()" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Nombre</label>
              <input formControlName="nombre" type="text" placeholder="Ej. Juan" class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none font-bold text-gray-800 transition-colors">
              <p *ngIf="vetForm.get('nombre')?.invalid && vetForm.get('nombre')?.touched" class="text-red-500 text-[10px] mt-1 font-bold">El nombre es obligatorio.</p>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Apellido</label>
              <input formControlName="apellido" type="text" placeholder="Ej. Pérez" class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none font-bold text-gray-800 transition-colors">
              <p *ngIf="vetForm.get('apellido')?.invalid && vetForm.get('apellido')?.touched" class="text-red-500 text-[10px] mt-1 font-bold">El apellido es obligatorio.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Email (Usuario)</label>
              <input formControlName="email" type="email" placeholder="Ej. juan.perez@petshop.com" class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none font-bold text-gray-800 transition-colors">
              <p *ngIf="vetForm.get('email')?.invalid && vetForm.get('email')?.touched" class="text-red-500 text-[10px] mt-1 font-bold">Email inválido o vacío.</p>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">
                Contraseña {{ isEditing ? '(Opcional - solo para cambiar)' : '' }}
              </label>
              <input formControlName="password" type="password" placeholder="Ej. securePass123" class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none font-bold text-gray-800 transition-colors">
              <p *ngIf="!isEditing && vetForm.get('password')?.invalid && vetForm.get('password')?.touched" class="text-red-500 text-[10px] mt-1 font-bold">Contraseña obligatoria al crear.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Matrícula Profesional</label>
              <input formControlName="matricula" type="text" placeholder="Ej. VET-2024-001" class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none font-bold text-gray-800 transition-colors">
              <p *ngIf="vetForm.get('matricula')?.invalid && vetForm.get('matricula')?.touched" class="text-red-500 text-[10px] mt-1 font-bold">La matrícula es obligatoria.</p>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Especialidad</label>
              <input formControlName="especialidad" type="text" placeholder="Ej. Cirugía General" class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none font-bold text-gray-800 transition-colors">
              <p *ngIf="vetForm.get('especialidad')?.invalid && vetForm.get('especialidad')?.touched" class="text-red-500 text-[10px] mt-1 font-bold">La especialidad es obligatoria.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Celular / Teléfono</label>
              <input formControlName="telefono" type="text" placeholder="Ej. 351-555-1234" class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none font-bold text-gray-800 transition-colors">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Avatar (URL Opcional)</label>
              <input formControlName="avatar" type="text" placeholder="Ej. https://res.cloudinary.com/..." class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none font-bold text-gray-800 transition-colors">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">Biografía / Presentación</label>
            <textarea formControlName="bio" rows="2" placeholder="Describe brevemente su experiencia o enfoque médico..." class="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none font-bold text-gray-800 transition-colors resize-none"></textarea>
          </div>

          <!-- Servicios Checklist -->
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-2">Servicios Habilitados</label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <label *ngFor="let s of serviciosList" class="flex items-center gap-2 text-xs font-extrabold text-slate-700 cursor-pointer select-none">
                <input type="checkbox" [(ngModel)]="s.checked" [ngModelOptions]="{standalone: true}" class="rounded text-sky-500 focus:ring-sky-400 h-4 w-4">
                {{ s.name }}
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <button type="button" (click)="showVetModal = false" class="bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-600 font-extrabold py-2.5 px-6 rounded-xl transition-all text-sm cursor-pointer">
              Cancelar
            </button>
            <button type="submit" [disabled]="vetForm.invalid" class="bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-extrabold py-2.5 px-6 rounded-xl transition-all text-sm shadow-md hover:shadow-sky-500/20 cursor-pointer">
              {{ isEditing ? 'Guardar Cambios' : 'Registrar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!--======================= MODAL: CONFIGURAR HORARIOS =======================-->
    <div *ngIf="showHorariosModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-lg w-full p-8 relative">
        <h3 class="text-2xl font-black text-slate-800 mb-1">Horarios de Atención</h3>
        <p class="text-slate-500 font-bold text-xs mb-6">
          Establece los días de la semana y rango de horas de atención para: <span class="text-sky-500">{{ selectedVet?.nombreCompleto }}</span>
        </p>

        <div class="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1">
          <div *ngFor="let dia of horariosConfig" class="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 gap-3">
            <div class="flex items-center gap-2">
              <input type="checkbox" [(ngModel)]="dia.trabaja" class="rounded text-sky-500 focus:ring-sky-400 h-4.5 w-4.5 cursor-pointer">
              <span class="text-xs font-black text-slate-800 w-20">{{ dia.nombreDia }}</span>
            </div>
            
            <div class="flex items-center gap-2 text-xs font-bold text-slate-500" *ngIf="dia.trabaja">
              <input type="time" [(ngModel)]="dia.horaInicio" class="px-2 py-1.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-sky-400 text-slate-800 font-extrabold">
              <span>a</span>
              <input type="time" [(ngModel)]="dia.horaFin" class="px-2 py-1.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-sky-400 text-slate-800 font-extrabold">
            </div>
            <div class="text-xs font-extrabold text-slate-400 italic" *ngIf="!dia.trabaja">
              No trabaja este día
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-50">
          <button type="button" (click)="showHorariosModal = false" class="bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-600 font-extrabold py-2.5 px-6 rounded-xl transition-all text-sm cursor-pointer">
            Cancelar
          </button>
          <button type="button" (click)="guardarHorarios()" class="bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-extrabold py-2.5 px-6 rounded-xl transition-all text-sm shadow-md hover:shadow-sky-500/20 cursor-pointer">
            Guardar Horarios
          </button>
        </div>
      </div>
    </div>

    <!--======================= MODAL: GESTIÓN DE BLOQUEOS =======================-->
    <div *ngIf="showBloqueosModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-xl w-full p-8 relative">
        <h3 class="text-2xl font-black text-slate-800 mb-1">Ausencias y Bloqueos</h3>
        <p class="text-slate-500 font-bold text-xs mb-6">
          Gestiona las vacaciones y bloqueos de agenda para: <span class="text-sky-500">{{ selectedVet?.nombreCompleto }}</span>
        </p>

        <!-- Bloqueos Activos -->
        <div class="mb-6">
          <h4 class="text-xs font-black text-slate-400 uppercase tracking-wider mb-2.5">Bloqueos de Fecha Activos</h4>
          <div class="space-y-2 max-h-[30vh] overflow-y-auto pr-1">
            <div *ngFor="let bl of bloqueos" class="flex items-center justify-between p-3.5 bg-rose-50/50 rounded-2xl border border-rose-100/50 text-xs font-semibold">
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="font-extrabold text-rose-700">Desde: {{ bl.fechaInicio }}</span>
                  <span class="text-slate-400">|</span>
                  <span class="font-extrabold text-rose-700">Hasta: {{ bl.fechaFin }}</span>
                </div>
                <p class="text-slate-500 mt-1 font-bold">Motivo: {{ bl.motivo || 'No especificado' }}</p>
              </div>
              <button (click)="eliminarBloqueo(bl.id)" title="Eliminar Bloqueo" class="text-rose-600 hover:text-rose-700 p-2 hover:bg-rose-100/50 rounded-xl transition-all cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <div *ngIf="bloqueos.length === 0" class="text-center py-4 bg-slate-50 rounded-2xl text-slate-400 text-xs font-bold italic">
              No hay bloqueos activos actualmente
            </div>
          </div>
        </div>

        <!-- Formulario Nuevo Bloqueo -->
        <div class="border-t border-slate-100 pt-5">
          <h4 class="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Registrar Nueva Ausencia</h4>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-extrabold text-slate-500 mb-1">Fecha Inicio</label>
                <input type="date" [(ngModel)]="newBlock.fechaInicio" class="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-sky-400 outline-none font-bold text-gray-800">
              </div>
              <div>
                <label class="block text-[10px] font-extrabold text-slate-500 mb-1">Fecha Fin</label>
                <input type="date" [(ngModel)]="newBlock.fechaFin" class="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-sky-400 outline-none font-bold text-gray-800">
              </div>
            </div>
            <div>
              <label class="block text-[10px] font-extrabold text-slate-500 mb-1">Motivo / Descripción</label>
              <input type="text" [(ngModel)]="newBlock.motivo" placeholder="Ej. Vacaciones, Congreso..." class="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-sky-400 outline-none font-bold text-gray-800">
            </div>
            <button type="button" (click)="agregarBloqueo()" class="w-full bg-rose-500 hover:bg-rose-600 active:scale-98 text-white font-extrabold py-2 px-4 rounded-xl transition-all text-xs shadow-sm flex items-center justify-center gap-1 cursor-pointer">
              Agregar Bloqueo de Agenda
            </button>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-50">
          <button type="button" (click)="showBloqueosModal = false" class="bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-600 font-extrabold py-2.5 px-6 rounded-xl transition-all text-sm cursor-pointer">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  `
})
export class AdminVeterinariosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(VeterinarioService);

  veterinarios: VeterinarioResponse[] = [];
  cargando = true;

  // Modales
  showVetModal = false;
  showHorariosModal = false;
  showBloqueosModal = false;
  isEditing = false;
  selectedVet?: VeterinarioResponse;

  // Perfil Vet Form
  vetForm!: FormGroup;

  // Lista de servicios para checkbox
  serviciosList = [
    { name: 'Consulta General', value: 'CONSULTA', checked: false },
    { name: 'Vacunación', value: 'VACUNACION', checked: false },
    { name: 'Cirugía', value: 'CIRUGIA', checked: false },
    { name: 'Grooming / Peluquería', value: 'GROOMING', checked: false },
    { name: 'Control Clínico', value: 'CONTROL', checked: false }
  ];

  // Horarios de atención config
  horariosConfig: HorarioResponse[] = [];

  // Bloqueos activos
  bloqueos: BloqueoFechaResponse[] = [];
  newBlock = {
    fechaInicio: '',
    fechaFin: '',
    motivo: ''
  };

  ngOnInit() {
    this.inicializarForm();
    this.cargarVeterinarios();
  }

  inicializarForm() {
    this.vetForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellido: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      telefono: [''],
      matricula: ['', [Validators.required, Validators.maxLength(50)]],
      especialidad: ['', [Validators.required, Validators.maxLength(100)]],
      bio: [''],
      avatar: ['']
    });
  }

  cargarVeterinarios() {
    this.cargando = true;
    this.service.listarTodos().subscribe({
      next: (data) => {
        this.veterinarios = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar veterinarios', err);
        toast.error('No se pudo cargar la lista de veterinarios.');
        this.cargando = false;
      }
    });
  }

  toggleActivo(vet: VeterinarioResponse) {
    const nuevoEstado = !vet.activo;
    this.service.cambiarEstado(vet.id, nuevoEstado).subscribe({
      next: (res) => {
        vet.activo = res.activo;
        toast.success(`Veterinario ${vet.nombreCompleto} ${res.activo ? 'activado' : 'desactivado'} con éxito.`);
      },
      error: (err) => {
        console.error(err);
        toast.error('Error al cambiar el estado del veterinario.');
      }
    });
  }

  openCreateModal() {
    this.isEditing = false;
    this.selectedVet = undefined;
    this.vetForm.reset();
    this.vetForm.get('password')?.setValidators([Validators.required]);
    this.vetForm.get('password')?.updateValueAndValidity();
    
    // Reset checked services
    this.serviciosList.forEach(s => s.checked = false);
    
    this.showVetModal = true;
  }

  openEditModal(vet: VeterinarioResponse) {
    this.isEditing = true;
    this.selectedVet = vet;
    
    // Separamos el nombre del apellido si el backend nos devuelve nombreCompleto
    const nameParts = vet.nombreCompleto.split(' ');
    const nombre = nameParts[0] || '';
    const apellido = nameParts.slice(1).join(' ') || '';

    this.vetForm.patchValue({
      nombre: nombre,
      apellido: apellido,
      email: vet.email,
      password: '',
      telefono: vet.telefono || '',
      matricula: vet.matricula,
      especialidad: vet.especialidad,
      bio: vet.bio || '',
      avatar: vet.avatar || ''
    });

    this.vetForm.get('password')?.clearValidators();
    this.vetForm.get('password')?.updateValueAndValidity();

    // Map checked services
    const enabled = vet.serviciosHabilitados || [];
    this.serviciosList.forEach(s => {
      s.checked = enabled.includes(s.value);
    });

    this.showVetModal = true;
  }

  guardarVet() {
    if (this.vetForm.invalid) return;

    // Obtener servicios marcados
    const serviciosHabilitados = this.serviciosList
      .filter(s => s.checked)
      .map(s => s.value);

    const dto = {
      ...this.vetForm.value,
      serviciosHabilitados
    };

    if (this.isEditing && this.selectedVet) {
      this.service.actualizar(this.selectedVet.id, dto).subscribe({
        next: (res) => {
          toast.success(`Veterinario ${res.nombreCompleto} actualizado con éxito.`);
          this.showVetModal = false;
          this.cargarVeterinarios();
        },
        error: (err) => {
          console.error(err);
          toast.error(err.error?.message || 'Error al actualizar el veterinario.');
        }
      });
    } else {
      this.service.crear(dto).subscribe({
        next: (res) => {
          toast.success(`Veterinario ${res.nombreCompleto} registrado con éxito.`);
          this.showVetModal = false;
          this.cargarVeterinarios();
        },
        error: (err) => {
          console.error(err);
          toast.error(err.error?.message || 'Error al registrar el veterinario.');
        }
      });
    }
  }

  eliminarVet(vet: VeterinarioResponse) {
    if (confirm(`¿Estás seguro de que deseas dar de baja al veterinario ${vet.nombreCompleto}? (Su perfil se inactivará)`)) {
      this.service.eliminar(vet.id).subscribe({
        next: () => {
          toast.success(`Veterinario ${vet.nombreCompleto} dado de baja.`);
          this.cargarVeterinarios();
        },
        error: (err) => {
          console.error(err);
          toast.error('Error al dar de baja el veterinario.');
        }
      });
    }
  }

  // ================= HORARIOS =================
  openHorariosModal(vet: VeterinarioResponse) {
    this.selectedVet = vet;
    this.service.listarHorarios(vet.id).subscribe({
      next: (data) => {
        this.horariosConfig = data;
        // Ajustamos formato de horas a HH:mm para el input type="time"
        this.horariosConfig.forEach(h => {
          if (h.horaInicio) h.horaInicio = h.horaInicio.substring(0, 5);
          if (h.horaFin) h.horaFin = h.horaFin.substring(0, 5);
        });
        this.showHorariosModal = true;
      },
      error: (err) => {
        console.error(err);
        toast.error('Error al cargar horarios del veterinario.');
      }
    });
  }

  guardarHorarios() {
    if (!this.selectedVet) return;

    // Validación básica de horarios
    for (const h of this.horariosConfig) {
      if (h.trabaja) {
        if (!h.horaInicio || !h.horaFin) {
          toast.error(`Debe especificar hora de inicio y fin para el ${h.nombreDia}.`);
          return;
        }
        if (h.horaInicio >= h.horaFin) {
          toast.error(`La hora de inicio debe ser menor que la de fin en el ${h.nombreDia}.`);
          return;
        }
      }
    }

    const payload = this.horariosConfig.map(h => ({
      diaSemana: h.diaSemana,
      trabaja: h.trabaja,
      horaInicio: h.trabaja ? h.horaInicio + ':00' : null,
      horaFin: h.trabaja ? h.horaFin + ':00' : null
    }));

    this.service.actualizarHorarios(this.selectedVet.id, payload as any).subscribe({
      next: () => {
        toast.success('Horarios actualizados exitosamente.');
        this.showHorariosModal = false;
      },
      error: (err) => {
        console.error(err);
        toast.error(err.error?.message || 'Error al actualizar horarios.');
      }
    });
  }

  // ================= BLOQUEOS =================
  openBloqueosModal(vet: VeterinarioResponse) {
    this.selectedVet = vet;
    this.newBlock = { fechaInicio: '', fechaFin: '', motivo: '' };
    this.cargarBloqueos();
    this.showBloqueosModal = true;
  }

  cargarBloqueos() {
    if (!this.selectedVet) return;
    this.service.listarBloqueos(this.selectedVet.id).subscribe({
      next: (data) => {
        this.bloqueos = data;
      },
      error: (err) => {
        console.error(err);
        toast.error('Error al obtener los bloqueos.');
      }
    });
  }

  agregarBloqueo() {
    if (!this.selectedVet) return;
    if (!this.newBlock.fechaInicio || !this.newBlock.fechaFin) {
      toast.error('Debe seleccionar las fechas de inicio y fin.');
      return;
    }
    if (this.newBlock.fechaFin < this.newBlock.fechaInicio) {
      toast.error('La fecha de fin debe ser igual o posterior a la fecha de inicio.');
      return;
    }

    this.service.crearBloqueo(this.selectedVet.id, this.newBlock).subscribe({
      next: () => {
        toast.success('Período de ausencia bloqueado exitosamente.');
        this.newBlock = { fechaInicio: '', fechaFin: '', motivo: '' };
        this.cargarBloqueos();
      },
      error: (err) => {
        console.error(err);
        toast.error(err.error?.message || 'Error al crear el bloqueo.');
      }
    });
  }

  eliminarBloqueo(bloqueoId: number) {
    if (!this.selectedVet) return;
    if (confirm('¿Deseas eliminar este bloqueo de fecha? El veterinario volverá a estar disponible.')) {
      this.service.eliminarBloqueo(this.selectedVet.id, bloqueoId).subscribe({
        next: () => {
          toast.success('Bloqueo eliminado exitosamente.');
          this.cargarBloqueos();
        },
        error: (err) => {
          console.error(err);
          toast.error('Error al eliminar el bloqueo.');
        }
      });
    }
  }
}
