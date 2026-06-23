import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MascotaService } from '../../services/mascota.service';
import { InternacionService } from '../../services/internacion.service';
import { CitaService } from '../../services/cita.service';
import { InternacionResponse } from '../../models/internacion.model';
import { MascotaResponse } from '../../models/mascota.model';
import { CitaResponse } from '../../models/cita.model';
import { gsap } from 'gsap';

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8 font-nunito flex flex-col gap-6">
      
      <!-- Banners de Alerta URGENTE (Internación Activa) -->
      <ng-container *ngFor="let alert of activeHospitalAlerts">
        <div class="bg-red-50 border-2 border-red-200 rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse-slow">
          <div class="flex items-center gap-4 text-center sm:text-left col-span-2">
            <div class="bg-red-100 text-red-500 p-4 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 class="text-lg font-black text-red-800 uppercase tracking-wide">INGRESO URGENTE A INTERNACIÓN</h4>
              <p class="text-red-700 font-bold mt-1">
                Tu mascota <span class="text-red-900 font-extrabold">{{ alert.mascotaNombre }}</span> ha sido ingresada en internación.
              </p>
              <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-red-600 font-bold justify-center sm:justify-start">
                <span>📍 Jaula: {{ alert.jaulaId || 'No asignada' }}</span>
                <span>Fecha: {{ alert.fechaIngreso | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <p class="text-sm text-red-600 mt-1 italic font-medium" *ngIf="alert.motivo">Motivo: {{ alert.motivo }}</p>
            </div>
          </div>
          <a routerLink="/cliente/mascota" class="bg-red-500 hover:bg-red-600 text-white font-extrabold px-6 py-3 rounded-2xl shadow-sm transition-all whitespace-nowrap flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Ver Expediente
          </a>
        </div>
      </ng-container>

      <!-- Banners de Alerta (Alta Médica con Cuidados) -->
      <ng-container *ngFor="let alert of dischargeAlerts">
        <div class="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-6 shadow-md flex flex-col justify-between gap-4">
          <div class="flex items-start gap-4">
            <div class="bg-emerald-100 text-emerald-500 p-4 rounded-full flex items-center justify-center mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1">
              <h4 class="text-lg font-black text-emerald-800 uppercase tracking-wide">¡ALTA MÉDICA DISPONIBLE!</h4>
              <p class="text-emerald-700 font-bold mt-1">
                Tu mascota <span class="text-emerald-900 font-extrabold">{{ alert.mascotaNombre }}</span> ha recibido el alta médica el {{ alert.fechaAlta | date:'dd/MM/yyyy HH:mm' }}.
              </p>
              <div class="mt-4 bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm" *ngIf="alert.indicacionesAlta">
                <span class="text-xs uppercase font-extrabold text-emerald-600 tracking-wide block mb-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Indicaciones de Cuidado en Casa:
                </span>
                <p class="text-gray-700 font-bold text-sm whitespace-pre-line">{{ alert.indicacionesAlta }}</p>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-2">
            <button (click)="dismissDischarge(alert.id)" class="border-2 border-emerald-500 hover:bg-emerald-50 text-emerald-700 font-extrabold px-5 py-2.5 rounded-2xl transition-all text-sm flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Entendido, archivar aviso
            </button>
            <a routerLink="/cliente/mascota" class="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-5 py-2.5 rounded-2xl shadow-sm transition-all text-sm flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Ver Historial
            </a>
          </div>
        </div>
      </ng-container>

      <!-- Grid Bento -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Bento Card 1: Bienvenido (Col-Span 2) -->
        <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
          <div class="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-sky-50 group-hover:scale-110 transition-transform duration-500 ease-out z-0"></div>
          <div *ngIf="user$ | async as user" class="flex items-center gap-5 z-10">
            <div class="w-20 h-20 rounded-full border-4 border-sky-100 shadow-md overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
              <img [src]="getAvatarUrl(user.avatar)" alt="Avatar" class="w-full h-full object-cover">
            </div>
            <div>
              <h1 class="text-2xl font-black text-gray-800">¡Hola, {{ user.nombre }}! 👋</h1>
              <p class="text-xs text-sky-500 font-extrabold uppercase tracking-widest mt-0.5">Portal de Clientes</p>
              <p class="text-sm text-gray-500 font-bold mt-2 max-w-md">
                Administra el cuidado, agenda turnos y haz seguimiento a la salud de tus compañeros de vida.
              </p>
            </div>
          </div>
          <div class="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0 z-10">
            <a routerLink="/cliente/turnos" class="flex-1 text-center bg-sky-500 hover:bg-sky-600 text-white font-extrabold py-3 px-5 rounded-2xl transition-all shadow-md shadow-sky-100 text-sm whitespace-nowrap">
              Reservar Turno
            </a>
            <a routerLink="/cliente/productos" class="flex-1 text-center border-2 border-sky-500 hover:bg-sky-50 text-sky-600 font-extrabold py-2.5 px-5 rounded-2xl transition-all text-sm whitespace-nowrap">
              Ir a la Tienda
            </a>
          </div>
        </div>

        <!-- Bento Card 2: Estado de Notificaciones (Col-Span 1) -->
        <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between gap-4">
          <div class="flex justify-between items-center">
            <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Centro de Mensajes</span>
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          </div>
          <div>
            <h3 class="text-lg font-black text-gray-800">Alertas de Salud</h3>
            <p class="text-sm text-gray-500 font-bold mt-1">
              Tienes alertas pendientes de internación o altas de tus mascotas. Haz clic aquí para revisarlas.
            </p>
          </div>
          <a routerLink="/cliente/notificaciones" class="flex items-center gap-1 text-sky-500 font-extrabold text-sm hover:gap-2 transition-all">
            Ver todas las notificaciones
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>

        <!-- Bento Card 3: Mis Mascotas (Col-Span 1) -->
        <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Mis Compañeros</span>
            <span class="text-xs font-extrabold text-sky-500">{{ misMascotas.length }} Registrados</span>
          </div>
          
          <div class="flex-1 flex flex-col gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
            <div *ngIf="loadingMascotas" class="flex justify-center items-center py-8">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-500"></div>
            </div>
            
            <div *ngFor="let pet of misMascotas" 
                 (click)="seleccionarMascota(pet)"
                 class="p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group"
                 [ngClass]="mascotaSeleccionada?.id === pet.id ? 'border-sky-400 bg-sky-50/10' : 'border-slate-100 hover:border-sky-200 bg-slate-50/50'">
              <div class="flex items-center gap-3">
                <span class="text-2xl">🐾</span>
                <div>
                  <h4 class="font-extrabold text-slate-800 text-sm truncate">{{ pet.nombre }}</h4>
                  <p class="text-[10px] text-slate-500 font-bold truncate">{{ pet.tipo }} • {{ pet.sexo }}</p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 group-hover:text-sky-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </div>

        <!-- Bento Card 4: Historial de Peso (Col-Span 2) -->
        <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Seguimiento Clínico</span>
            <span class="text-xs font-black text-sky-500 uppercase tracking-widest bg-sky-50 border border-sky-100 px-3 py-1 rounded-full">
              Peso de: {{ mascotaSeleccionada?.nombre || 'Mascota' }}
            </span>
          </div>

          <div class="flex-1 flex flex-col md:flex-row items-center justify-between gap-6 py-2">
            <!-- Gráfico SVG -->
            <div class="w-full md:w-3/5 h-44 relative bg-slate-50/30 rounded-2xl p-2 border border-slate-100 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 300 120" class="w-full h-full">
                <!-- Grids -->
                <line x1="20" y1="25" x2="280" y2="25" stroke="#f1f5f9" stroke-width="1"></line>
                <line x1="20" y1="65" x2="280" y2="65" stroke="#f1f5f9" stroke-width="1"></line>
                <line x1="20" y1="105" x2="280" y2="105" stroke="#e2e8f0" stroke-width="1.5"></line>

                <!-- Gradient Area -->
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.25"></stop>
                    <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.00"></stop>
                  </linearGradient>
                  <!-- Mask / Clip-Path for GSAP animate reveal -->
                  <clipPath id="chart-clip">
                    <rect x="0" y="0" width="0" height="120" id="chart-rect"></rect>
                  </clipPath>
                </defs>

                <!-- Gradient Fill -->
                <path [attr.d]="chartGradientPath" fill="url(#chart-grad)" clip-path="url(#chart-clip)"></path>

                <!-- Line -->
                <path [attr.d]="chartPath" fill="none" stroke="#0ea5e9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" clip-path="url(#chart-clip)"></path>

                <!-- Dots -->
                <g clip-path="url(#chart-clip)">
                  <circle *ngFor="let c of chartCoords" 
                          [attr.cx]="c.x" 
                          [attr.cy]="c.y" 
                          r="4" 
                          fill="#ffffff" 
                          stroke="#0ea5e9" 
                          stroke-width="2.5"
                          class="chart-dot origin-center transition-all duration-300 hover:r-6 cursor-pointer">
                  </circle>
                </g>

                <!-- Labels -->
                <text *ngFor="let c of chartCoords" 
                      [attr.x]="c.x" 
                      y="117" 
                      text-anchor="middle" 
                      fill="#94a3b8" 
                      font-size="7.5" 
                      font-weight="bold">
                  {{ c.label }}
                </text>

                <!-- Values above dots -->
                <text *ngFor="let c of chartCoords" 
                      [attr.x]="c.x" 
                      [attr.y]="c.y - 8" 
                      text-anchor="middle" 
                      fill="#334155" 
                      font-size="8" 
                      font-weight="black">
                  {{ c.val }} kg
                </text>
              </svg>
            </div>

            <!-- Stats Details -->
            <div class="w-full md:w-2/5 flex flex-col gap-3 justify-center">
              <div class="bg-sky-50/50 border border-sky-100 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Peso Actual</p>
                  <p class="text-2xl font-black text-sky-600 mt-1">
                    {{ (weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].value : 0) | number:'1.1-1' }} kg
                  </p>
                </div>
                <span class="text-3xl">⚖️</span>
              </div>
              <div class="text-[11px] text-slate-500 font-semibold leading-normal">
                🐾 El control de peso es crucial para diagnosticar a tiempo desbalances nutricionales o patologías. Consulta con tu veterinario de confianza.
              </div>
            </div>
          </div>
        </div>

        <!-- Bento Card 5: Calendario de Turnos (Col-Span 1.5 en layout personalizado) -->
        <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Mi Calendario</span>
            <div class="flex items-center gap-1.5">
              <button (click)="prevMonth()" class="p-1 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span class="text-xs font-black text-slate-700 min-w-[90px] text-center">{{ nombreMes }}</span>
              <button (click)="nextMonth()" class="p-1 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          <!-- Calendario Grid -->
          <div>
            <div class="grid grid-cols-7 text-center text-[10px] font-black text-slate-400 mb-2">
              <span>D</span><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span>
            </div>
            <div class="grid grid-cols-7 gap-1">
              <button type="button" *ngFor="let d of daysInMonth"
                      (click)="seleccionarDia(d)"
                      class="aspect-square rounded-xl text-xs font-bold transition-all relative flex flex-col items-center justify-center"
                      [ngClass]="{
                        'text-slate-300': !d.isCurrentMonth,
                        'text-slate-800 hover:bg-slate-50': d.isCurrentMonth && !esDiaSeleccionado(d.date) && !esHoy(d.date),
                        'bg-sky-500 text-white shadow-md shadow-sky-100': esDiaSeleccionado(d.date),
                        'border border-sky-400 text-sky-600': esHoy(d.date) && !esDiaSeleccionado(d.date)
                      }">
                {{ d.day }}
                <!-- Dot indicator -->
                <span *ngIf="d.appointments.length > 0 && !esDiaSeleccionado(d.date)" 
                      class="absolute bottom-1 w-1.5 h-1.5 rounded-full"
                      [ngClass]="getDoctorDotColor(d.appointments[0].veterinarioId)"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Bento Card 6: Detalle de Citas del Día Seleccionado (Col-Span 2 en layout) -->
        <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 lg:col-span-2">
          <div class="flex justify-between items-center border-b border-slate-50 pb-2">
            <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Citas del día</span>
            <span class="text-xs font-black text-slate-700">{{ selectedDayLabel }}</span>
          </div>

          <div class="flex-1 flex flex-col gap-3 overflow-y-auto max-h-56 pr-1 custom-scrollbar">
            <div *ngIf="selectedDayAppointments.length === 0" class="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-300 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p class="text-xs font-bold">No tienes citas programadas para esta fecha.</p>
            </div>

            <div *ngFor="let cita of selectedDayAppointments" 
                 class="appointment-item p-3.5 rounded-2xl border-2 flex items-center justify-between gap-4"
                 [ngClass]="getDoctorColorClasses(cita.veterinarioId)">
              <div class="flex items-center gap-3">
                <img [src]="getDoctorAvatar(cita.veterinarioAvatar)" 
                     class="w-10 h-10 rounded-full border border-white shadow-md object-cover bg-white shrink-0">
                <div>
                  <h4 class="font-extrabold text-sm text-slate-800">{{ cita.tipoCita }} con el Dr. {{ cita.veterinarioNombre }}</h4>
                  <p class="text-[10px] text-slate-500 font-bold mt-0.5">
                    Paciente: {{ cita.mascotaNombre }} • Hora: {{ cita.fechaHora.split('T')[1]?.substring(0, 5) }} hs
                  </p>
                </div>
              </div>
              <span class="text-xs font-black uppercase px-3 py-1 rounded-full border border-white shadow-sm bg-white/70">
                {{ getEstadoTexto(cita.estado) }}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out forwards;
    }
    .animate-pulse-slow {
      animation: pulseSlow 3s infinite ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulseSlow {
      0%, 100% { border-color: rgba(239, 68, 68, 0.2); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
      50% { border-color: rgba(239, 68, 68, 0.6); box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.15); }
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
  `]
})
export class ClientHomeComponent implements OnInit {
  private authService = inject(AuthService);
  private mascotaService = inject(MascotaService);
  private internacionService = inject(InternacionService);
  private citaService = inject(CitaService);

  user$ = this.authService.currentUser$;
  activeHospitalAlerts: InternacionResponse[] = [];
  dischargeAlerts: InternacionResponse[] = [];
  
  misMascotas: MascotaResponse[] = [];
  mascotaSeleccionada: MascotaResponse | null = null;
  citas: CitaResponse[] = [];

  loadingMascotas = false;
  loadingCitas = false;

  // Lógica del Gráfico de Peso
  weightHistory: { date: string; value: number }[] = [];
  chartCoords: { x: number; y: number; label: string; val: number }[] = [];
  chartPath = '';
  chartGradientPath = '';

  // Lógica del Calendario
  currentDate = new Date();
  daysInMonth: { day: number; date: Date; appointments: any[]; isCurrentMonth: boolean }[] = [];
  selectedDate: Date = new Date();
  selectedDayAppointments: any[] = [];
  selectedDayLabel = '';

  ngOnInit() {
    this.cargarAlertasAndMascotas();
  }

  cargarAlertasAndMascotas() {
    this.loadingMascotas = true;
    this.mascotaService.obtenerMisMascotas().subscribe({
      next: (mascotas) => {
        this.misMascotas = mascotas || [];
        this.loadingMascotas = false;
        
        if (this.misMascotas.length > 0) {
          this.seleccionarMascota(this.misMascotas[0]);
        }

        // Cargar alertas de internación
        this.activeHospitalAlerts = [];
        this.dischargeAlerts = [];
        const dismissed = this.getDismissedDischarges();

        this.misMascotas.forEach(pet => {
          this.internacionService.obtenerPorMascota(pet.id).subscribe({
            next: (internaciones) => {
              if (internaciones) {
                const activas = internaciones.filter(i => i.estado === 'ACTIVA');
                this.activeHospitalAlerts.push(...activas);

                const altas = internaciones.filter(i => i.estado === 'ALTA' && !dismissed.includes(i.id));
                this.dischargeAlerts.push(...altas);
              }
            }
          });
        });

        // Cargar citas y generar calendario
        this.cargarCitas();
      },
      error: (err) => {
        console.error('Error al cargar mascotas del cliente', err);
        this.loadingMascotas = false;
      }
    });
  }

  cargarCitas() {
    this.loadingCitas = true;
    this.citaService.obtenerMisCitas().subscribe({
      next: (data) => {
        this.citas = data || [];
        this.loadingCitas = false;
        this.generarCalendario();
        
        // Seleccionar hoy por defecto en el panel de detalles del calendario
        const today = new Date();
        this.seleccionarDia({
          date: today,
          appointments: this.getAppointmentsForDate(today)
        });

        // Lanzar animaciones GSAP
        this.animateDashboard();
      },
      error: (err) => {
        console.error('Error al cargar citas del cliente', err);
        this.loadingCitas = false;
        this.generarCalendario();
      }
    });
  }

  seleccionarMascota(pet: MascotaResponse) {
    this.mascotaSeleccionada = pet;
    this.cargarHistorialPeso(pet.id);
  }

  cargarHistorialPeso(petId: number) {
    this.mascotaService.obtenerHistorialClinico(petId).subscribe({
      next: (res) => {
        const consultas = res?.content || [];
        
        // Mapear pesos del historial clínico
        let points = consultas
          .filter((c: any) => c.peso)
          .map((c: any) => ({
            date: new Date(c.fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
            value: Number(c.peso)
          }))
          .reverse();

        if (points.length === 0) {
          // Mocking data si está vacío
          const baseWeight = this.mascotaSeleccionada?.peso || 6.5;
          points = [
            { date: 'Ene', value: baseWeight - 0.6 },
            { date: 'Feb', value: baseWeight - 0.3 },
            { date: 'Mar', value: baseWeight },
            { date: 'Abr', value: baseWeight - 0.2 },
            { date: 'May', value: baseWeight + 0.4 }
          ];
        }

        this.weightHistory = points;
        this.generateChartCoords();
      },
      error: (err) => {
        console.error('Error al cargar historial clínico de peso', err);
        const baseWeight = this.mascotaSeleccionada?.peso || 6.5;
        this.weightHistory = [
          { date: 'Ene', value: baseWeight - 0.6 },
          { date: 'Feb', value: baseWeight - 0.3 },
          { date: 'Mar', value: baseWeight },
          { date: 'Abr', value: baseWeight - 0.2 },
          { date: 'May', value: baseWeight + 0.4 }
        ];
        this.generateChartCoords();
      }
    });
  }

  generateChartCoords() {
    const N = this.weightHistory.length;
    if (N === 0) return;

    const values = this.weightHistory.map(p => p.value);
    const minVal = Math.min(...values) - 0.5;
    const maxVal = Math.max(...values) + 0.5;
    const range = maxVal - minVal || 1;

    this.chartCoords = this.weightHistory.map((p, i) => {
      const x = N === 1 ? 150 : 30 + i * (240 / (N - 1));
      const y = 105 - ((p.value - minVal) / range) * 80;
      return { x, y, label: p.date, val: p.value };
    });

    if (this.chartCoords.length > 0) {
      this.chartPath = 'M ' + this.chartCoords.map(c => `${c.x} ${c.y}`).join(' L ');
      this.chartGradientPath = `${this.chartPath} L ${this.chartCoords[N - 1].x} 115 L ${this.chartCoords[0].x} 115 Z`;
    } else {
      this.chartPath = '';
      this.chartGradientPath = '';
    }

    this.animateChart();
  }

  // Calendario Lógica
  generarCalendario() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startOfWeek = firstDay.getDay(); // 0: Sunday, 1: Monday, etc.
    
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    this.daysInMonth = [];
    
    // Relleno de mes anterior
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    const fillerStart = startOfWeek;
    for (let i = fillerStart; i > 0; i--) {
      const d = new Date(year, month - 1, prevMonthTotalDays - i + 1);
      this.daysInMonth.push({
        day: d.getDate(),
        date: d,
        appointments: this.getAppointmentsForDate(d),
        isCurrentMonth: false
      });
    }
    
    // Días del mes actual
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      this.daysInMonth.push({
        day: i,
        date: d,
        appointments: this.getAppointmentsForDate(d),
        isCurrentMonth: true
      });
    }

    // Rellenar días del mes siguiente para completar la grilla
    const totalSlots = this.daysInMonth.length;
    const remainingSlots = 42 - totalSlots; // 6 filas completas de 7 días
    for (let i = 1; i <= remainingSlots; i++) {
      const d = new Date(year, month + 1, i);
      this.daysInMonth.push({
        day: d.getDate(),
        date: d,
        appointments: this.getAppointmentsForDate(d),
        isCurrentMonth: false
      });
    }
  }

  getAppointmentsForDate(d: Date): any[] {
    const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return this.citas.filter(c => {
      const cDateStr = c.fechaHora.split('T')[0];
      return cDateStr === dStr && c.estado !== 'CANCELADA';
    });
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generarCalendario();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generarCalendario();
  }

  get nombreMes(): string {
    return this.currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase();
  }

  seleccionarDia(dayObj: any) {
    this.selectedDate = dayObj.date;
    this.selectedDayAppointments = dayObj.appointments || [];
    this.selectedDayLabel = dayObj.date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    
    setTimeout(() => {
      gsap.from('.appointment-item', {
        duration: 0.4,
        x: -15,
        opacity: 0,
        stagger: 0.08,
        ease: 'power1.out'
      });
    }, 50);
  }

  esDiaSeleccionado(d: Date): boolean {
    return d.getDate() === this.selectedDate.getDate() &&
           d.getMonth() === this.selectedDate.getMonth() &&
           d.getFullYear() === this.selectedDate.getFullYear();
  }

  esHoy(d: Date): boolean {
    const today = new Date();
    return d.getDate() === today.getDate() &&
           d.getMonth() === today.getMonth() &&
           d.getFullYear() === today.getFullYear();
  }

  getDismissedDischarges(): number[] {
    const data = localStorage.getItem('dismissed_discharges');
    return data ? JSON.parse(data) : [];
  }

  dismissDischarge(id: number) {
    const dismissed = this.getDismissedDischarges();
    if (!dismissed.includes(id)) {
      dismissed.push(id);
      localStorage.setItem('dismissed_discharges', JSON.stringify(dismissed));
    }
    this.dischargeAlerts = this.dischargeAlerts.filter(d => d.id !== id);
  }

  getAvatarUrl(avatar?: string): string {
    if (!avatar) {
      return '/assets/images/avatars/chico.jpg';
    }
    if (avatar.startsWith('http') || avatar.startsWith('/')) {
      return avatar;
    }
    return `/assets/images/avatars/${avatar}`;
  }

  getDoctorAvatar(avatar?: string): string {
    if (!avatar) {
      return '/assets/images/avatars/chico.jpg';
    }
    if (avatar.startsWith('http') || avatar.startsWith('/')) {
      return avatar;
    }
    return `/assets/images/avatars/${avatar}`;
  }

  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'Pendiente';
      case 'CONFIRMADA': return 'Confirmado';
      case 'EN_PROGRESO': return 'En Curso';
      case 'COMPLETADA': return 'Completado';
      case 'CANCELADA': return 'Cancelado';
      case 'NO_ASISTIO': return 'No Asistió';
      default: return estado;
    }
  }

  getDoctorDotColor(vetId: number): string {
    const colors = ['bg-orange-500', 'bg-emerald-500', 'bg-sky-500', 'bg-rose-500', 'bg-violet-500'];
    return colors[vetId % colors.length] || colors[2];
  }

  getDoctorColorClasses(vetId: number): string {
    const colors = [
      'border-orange-200 text-orange-700 bg-orange-50/20',
      'border-emerald-200 text-emerald-700 bg-emerald-50/20',
      'border-sky-200 text-sky-700 bg-sky-50/20',
      'border-rose-200 text-rose-700 bg-rose-50/20',
      'border-violet-200 text-violet-700 bg-violet-50/20'
    ];
    return colors[vetId % colors.length] || colors[2];
  }

  // Animaciones GSAP
  animateDashboard() {
    setTimeout(() => {
      // Entrada escalonada de tarjetas Bento
      gsap.from('.bento-card', {
        duration: 0.7,
        y: 35,
        opacity: 0,
        stagger: 0.08,
        ease: 'power2.out'
      });
    }, 50);
  }

  animateChart() {
    setTimeout(() => {
      // Animación de revelado del gráfico SVG (delimitador clipPath rect)
      gsap.set('#chart-rect', { width: 0 });
      gsap.to('#chart-rect', {
        duration: 1.2,
        width: 300,
        ease: 'power2.out'
      });

      // Animación de pop de los puntos del gráfico
      gsap.from('.chart-dot', {
        duration: 0.6,
        scale: 0,
        stagger: 0.07,
        ease: 'back.out(1.7)'
      });
    }, 100);
  }
}
