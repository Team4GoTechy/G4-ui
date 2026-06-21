import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MascotaService } from '../../services/mascota.service';
import { InternacionService } from '../../services/internacion.service';
import { InternacionResponse } from '../../models/internacion.model';
import { MascotaResponse } from '../../models/mascota.model';

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto my-8 px-4 font-nunito flex flex-col gap-6">
      
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

      <!-- Dashboard de Bienvenida -->
      <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-4 animate-fade-in w-full">
        <div *ngIf="user$ | async as user" class="flex flex-col items-center">
          
          <!-- Foto de Perfil -->
          <div class="w-28 h-28 rounded-full border-4 border-sky-100 shadow-md overflow-hidden mb-6 flex items-center justify-center bg-gray-50">
            <img [src]="getAvatarUrl(user.avatar)" alt="Foto de perfil" class="w-full h-full object-cover">
          </div>

          <h1 class="text-3xl font-black text-gray-800 mb-2">¡Bienvenido, {{ user.nombre }}!</h1>
          
          <!-- Nombre de la Mascota -->
          <div *ngIf="user.nombreMascota" class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 text-sky-600 font-extrabold text-sm border border-sky-100 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Dueño de {{ user.nombreMascota }} ({{ user.tipoMascota || 'Mascota' }})</span>
          </div>

          <p class="text-gray-500 font-bold max-w-md">
            Estamos felices de tenerte de vuelta. Aquí puedes gestionar los turnos, consultar el historial médico y comprar productos para tu mascota.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-8">
            <a routerLink="/cliente/turnos" class="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-extrabold py-3 px-6 rounded-2xl transition-all shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Reservar Turno
            </a>
            <a routerLink="/cliente/mascota" class="flex items-center justify-center gap-2 border-2 border-sky-500 hover:bg-sky-50 text-sky-600 font-extrabold py-3 px-6 rounded-2xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Ver Expediente
            </a>
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
  `]
})
export class ClientHomeComponent implements OnInit {
  private authService = inject(AuthService);
  private mascotaService = inject(MascotaService);
  private internacionService = inject(InternacionService);

  user$ = this.authService.currentUser$;
  activeHospitalAlerts: InternacionResponse[] = [];
  dischargeAlerts: InternacionResponse[] = [];
  misMascotas: MascotaResponse[] = [];

  ngOnInit() {
    this.cargarAlertas();
  }

  cargarAlertas() {
    this.mascotaService.obtenerMisMascotas().subscribe({
      next: (mascotas) => {
        this.misMascotas = mascotas || [];
        this.activeHospitalAlerts = [];
        this.dischargeAlerts = [];

        const dismissed = this.getDismissedDischarges();

        this.misMascotas.forEach(pet => {
          this.internacionService.obtenerPorMascota(pet.id).subscribe({
            next: (internaciones) => {
              if (internaciones) {
                // Filtrar activas
                const activas = internaciones.filter(i => i.estado === 'ACTIVA');
                this.activeHospitalAlerts.push(...activas);

                // Filtrar altas no archivadas
                const altas = internaciones.filter(i => i.estado === 'ALTA' && !dismissed.includes(i.id));
                this.dischargeAlerts.push(...altas);
              }
            },
            error: (err) => console.error('Error cargando internación para mascota', pet.id, err)
          });
        });
      },
      error: (err) => console.error('Error cargando mis mascotas', err)
    });
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
}
