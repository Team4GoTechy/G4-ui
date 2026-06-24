import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CitaService } from '../../services/cita.service';
import { InternacionService } from '../../services/internacion.service';
import { CitaResponse } from '../../models/cita.model';
import { InternacionResponse } from '../../models/internacion.model';
import { gsap } from 'gsap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8 font-nunito flex flex-col gap-6">
      
      <!-- Welcome Header -->
      <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform duration-500 ease-out z-0"></div>
        <div class="relative z-10">
          <h1 class="text-3xl font-black text-emerald-950">Buen día, Dr. {{ user?.nombre }} {{ user?.apellido }} 🩺</h1>
          <p class="text-emerald-600 font-bold mt-1">¡Que tengas una excelente jornada en el cuidado de tus pacientes!</p>
        </div>
        <div class="relative z-10 text-center sm:text-right">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha de Hoy</p>
          <p class="text-lg font-black text-emerald-800">{{ hoy | date:'fullDate' }}</p>
        </div>
      </div>

      <!-- Bento Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Bento Card 1: Próximo Paciente (Col-Span 2) -->
        <div class="bento-card bg-emerald-600 text-white p-6 rounded-3xl shadow-lg shadow-emerald-100 lg:col-span-2 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
          <div class="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-emerald-500 group-hover:scale-110 transition-transform duration-500 ease-out z-0"></div>
          
          <div class="flex items-center gap-5 z-10">
            <div class="w-20 h-20 rounded-full border-4 border-emerald-400 bg-white/10 shadow-inner flex items-center justify-center shrink-0 text-3xl">
              🐶
            </div>
            <div *ngIf="siguienteCita; else noSiguiente">
              <span class="text-[10px] uppercase font-black tracking-widest bg-emerald-700/60 px-3 py-1 rounded-full border border-emerald-500/50">Próximo Turno</span>
              <h2 class="text-2xl font-black mt-3">{{ siguienteCita.mascotaNombre }}</h2>
              <p class="text-xs text-emerald-100 font-bold mt-1">
                Especie/Motivo: {{ siguienteCita.tipoCita }} • Propietario: {{ siguienteCita.clienteNombre }}
              </p>
              <div class="mt-2 text-sm font-extrabold text-emerald-200 flex items-center gap-1.5">
                <span>⏰ Hora: {{ siguienteCita.fechaHora.split('T')[1].substring(0, 5) }} hs</span>
              </div>
            </div>
            <ng-template #noSiguiente>
              <div>
                <span class="text-[10px] uppercase font-black tracking-widest bg-emerald-700/60 px-3 py-1 rounded-full border border-emerald-500/50">Próximo Turno</span>
                <h2 class="text-xl font-black mt-3">Sin citas próximas confirmadas</h2>
                <p class="text-xs text-emerald-100 font-bold mt-1">No tienes más citas agendadas y confirmadas en el día de hoy.</p>
              </div>
            </ng-template>
          </div>

          <div *ngIf="siguienteCita" class="w-full md:w-auto shrink-0 z-10">
            <button (click)="iniciarConsulta(siguienteCita)" class="w-full text-center bg-white hover:bg-emerald-50 text-emerald-700 font-black py-3 px-6 rounded-2xl transition-all shadow-md text-sm whitespace-nowrap">
              Atender Cita
            </button>
          </div>
        </div>

        <!-- Bento Card 2: Resumen KPIs (Col-Span 1) -->
        <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between gap-4">
          <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Actividad Hoy</span>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
              <span class="text-xs text-slate-400 font-black uppercase">Pendientes</span>
              <p class="text-2xl font-black text-amber-500 mt-1">{{ citasPendientesCount }}</p>
            </div>
            <div class="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
              <span class="text-xs text-slate-400 font-black uppercase">Internados</span>
              <p class="text-2xl font-black text-rose-500 mt-1">{{ activeHospitalizations.length }}</p>
            </div>
          </div>
          <div class="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3 text-center">
            <span class="text-xs text-emerald-600 font-black uppercase">Total Turnos Hoy</span>
            <p class="text-3xl font-black text-emerald-700 mt-1">{{ citasHoy.length }}</p>
          </div>
        </div>

        <!-- Bento Card 3: Timeline de Turnos (Col-Span 2) -->
        <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col gap-4">
          <div class="flex justify-between items-center border-b border-slate-50 pb-2">
            <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Agenda de Pacientes de Hoy</span>
            <span class="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">Hoy</span>
          </div>

          <div class="flex-1 flex gap-4 min-h-[300px] relative pr-1 overflow-y-auto max-h-80 custom-scrollbar">
            <!-- Timeline vertical line -->
            <div class="w-1 bg-slate-150 rounded-full h-full absolute left-5 top-0 z-0 timeline-line"></div>
            
            <div class="w-full flex flex-col gap-5 pl-10 relative z-10">
              <div *ngIf="citasHoy.length === 0" class="flex flex-col items-center justify-center py-20 text-slate-400 text-center w-full pr-10">
                <span class="text-3xl mb-1">📅</span>
                <p class="text-xs font-bold">No hay consultas programadas para el día de hoy.</p>
              </div>

              <div *ngFor="let cita of citasHoy" class="flex items-start justify-between gap-4 border border-slate-50 rounded-2xl p-4 bg-slate-50/20 shadow-sm hover:border-slate-200 transition-all duration-300">
                <div class="flex items-start gap-4">
                  <!-- Time circle on timeline -->
                  <div class="absolute left-3 w-5 h-5 rounded-full border-4 border-white shadow-md z-20 flex items-center justify-center"
                       [ngClass]="cita.estado === 'PENDIENTE' ? 'bg-amber-500' : cita.estado === 'CONFIRMADA' ? 'bg-emerald-500' : 'bg-slate-400'">
                  </div>
                  
                  <div class="min-w-0">
                    <span class="text-[10px] font-black text-slate-400 tracking-wider block">Hora: {{ cita.fechaHora.split('T')[1].substring(0, 5) }} hs</span>
                    <h4 class="font-extrabold text-slate-800 text-sm mt-1">Paciente: {{ cita.mascotaNombre }}</h4>
                    <p class="text-[10px] text-slate-500 font-bold">Dueño: {{ cita.clienteNombre }} • Práctica: {{ cita.tipoCita }}</p>
                    <p class="text-xs text-slate-400 italic mt-2" *ngIf="cita.notas">Nota: {{ cita.notas }}</p>
                  </div>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-2 shrink-0 items-center">
                  <!-- Acciones del estado PENDIENTE -->
                  <ng-container *ngIf="cita.estado === 'PENDIENTE'">
                    <button (click)="confirmarCita(cita.id)" class="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] px-3 py-2 rounded-xl transition-all shadow-sm">
                      Aceptar
                    </button>
                    <button (click)="cancelarCita(cita.id)" class="border border-red-300 hover:bg-red-50 text-red-500 font-extrabold text-[10px] px-3 py-2 rounded-xl transition-all">
                      Rechazar
                    </button>
                  </ng-container>

                  <!-- Badge si ya está CONFIRMADA -->
                  <ng-container *ngIf="cita.estado === 'CONFIRMADA'">
                    <span class="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full shadow-sm">
                      Confirmado
                    </span>
                    <button (click)="iniciarConsulta(cita)" class="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] px-3 py-2 rounded-xl transition-all">
                      Atender
                    </button>
                    <button (click)="cancelarCita(cita.id)" class="border border-red-300 hover:bg-red-50 text-red-500 font-extrabold text-[10px] px-3 py-2 rounded-xl transition-all">
                      Cancelar
                    </button>
                  </ng-container>

                  <!-- Badge si es COMPLETADA o CANCELADA -->
                  <span *ngIf="cita.estado !== 'PENDIENTE' && cita.estado !== 'CONFIRMADA'" 
                        class="text-[9px] font-black uppercase px-3 py-1 rounded-full border shadow-sm"
                        [ngClass]="cita.estado === 'COMPLETADA' ? 'text-slate-600 bg-slate-50 border-slate-200' : 'text-rose-600 bg-rose-50 border-rose-100'">
                    {{ getEstadoTexto(cita.estado) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bento Card 4: Pacientes Internados (Col-Span 1) -->
        <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
          <div class="flex justify-between items-center border-b border-slate-50 pb-2">
            <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Hospitalización Activa</span>
            <span class="text-xs font-black text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">{{ activeHospitalizations.length }}</span>
          </div>

          <div class="flex-1 flex flex-col gap-3 overflow-y-auto max-h-80 pr-1 custom-scrollbar">
            <div *ngIf="activeHospitalizations.length === 0" class="flex flex-col items-center justify-center py-20 text-slate-400 text-center">
              <span class="text-2xl mb-1">🏥</span>
              <p class="text-xs font-bold">No hay mascotas internadas actualmente.</p>
            </div>

            <div *ngFor="let h of activeHospitalizations" 
                 class="p-3 rounded-2xl border border-rose-100 bg-rose-50/10 shadow-sm flex items-center justify-between gap-3">
              <div>
                <span class="text-[9px] font-black text-rose-500 uppercase tracking-wide block">Jaula: {{ h.jaulaId || 'Sin asignar' }}</span>
                <h4 class="font-extrabold text-slate-800 text-xs mt-1">Paciente: {{ h.mascotaNombre }}</h4>
                <p class="text-[9px] text-slate-400 font-bold truncate max-w-[150px]">Motivo: {{ h.motivo || 'Bajo observación' }}</p>
              </div>
              <a routerLink="/doctor/internaciones" class="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[9px] px-3 py-2 rounded-xl transition-all shadow-sm whitespace-nowrap">
                Revisar
              </a>
            </div>
          </div>
        </div>

        <!-- Bento Card 5: Consultas Semanales (Col-Span 2) -->
        <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col gap-4">
          <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Carga Semanal de Consultas</span>
          
          <div class="flex-1 flex items-end justify-between h-40 pt-4 px-4 bg-slate-50/30 border border-slate-100 rounded-2xl">
            <div *ngFor="let day of ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']; let i = index" class="flex flex-col items-center flex-1 gap-2">
              <span class="text-[9px] text-slate-700 font-black">{{ weeklyCitasCount[i] }}</span>
              <div class="w-7 bg-emerald-500/20 border-t-2 border-emerald-500 rounded-t-lg transition-all duration-700"
                   [style.height.px]="getMaxBarHeight(weeklyCitasCount[i])">
              </div>
              <span class="text-[9px] font-extrabold text-slate-400">{{ day.substring(0, 3) }}</span>
            </div>
          </div>
        </div>

        <!-- Bento Card 6: Breakdown de Prácticas (Col-Span 1) -->
        <div class="bento-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
          <span class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Distribución de Prácticas</span>
          
          <div class="flex-1 flex flex-col justify-center gap-3">
            <div *ngFor="let type of practiceTypes">
              <div class="flex justify-between items-center text-[10px] font-extrabold text-slate-600 mb-1">
                <span>{{ type.name }}</span>
                <span>{{ type.count }} ({{ type.percentage }}%)</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div class="stat-progress-bar h-full rounded-full" [ngClass]="type.color" [style.width.%]="type.percentage"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .timeline-line {
      transform-origin: top center;
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
export class DoctorHomeComponent implements OnInit {
  private authService = inject(AuthService);
  private citaService = inject(CitaService);
  private internacionService = inject(InternacionService);
  private router = inject(Router);

  user = this.authService.getCurrentUser();
  hoy = new Date();

  citasHoy: CitaResponse[] = [];
  citasPendientesCount = 0;
  activeHospitalizations: InternacionResponse[] = [];
  siguienteCita: CitaResponse | null = null;

  // Stats for charts
  weeklyCitasCount = [0, 0, 0, 0, 0]; // Lunes a Viernes
  practiceTypes = [
    { name: 'Consulta General', key: 'CONSULTA', count: 0, percentage: 0, color: 'bg-emerald-500' },
    { name: 'Vacunación', key: 'VACUNACION', count: 0, percentage: 0, color: 'bg-sky-500' },
    { name: 'Cirugía', key: 'CIRUGIA', count: 0, percentage: 0, color: 'bg-rose-500' },
    { name: 'Grooming', key: 'GROOMING', count: 0, percentage: 0, color: 'bg-amber-500' }
  ];

  ngOnInit() {
    this.cargarDatosDashboard();
  }

  cargarDatosDashboard() {
    if (!this.user?.id) return;

    const todayStr = `${this.hoy.getFullYear()}-${String(this.hoy.getMonth() + 1).padStart(2, '0')}-${String(this.hoy.getDate()).padStart(2, '0')}`;

    // Cargar citas de hoy
    this.citaService.obtenerAgendaDia(this.user.id, todayStr).subscribe({
      next: (data) => {
        this.citasHoy = data || [];
        
        // Contar citas pendientes de hoy
        this.citasPendientesCount = this.citasHoy.filter(c => c.estado === 'PENDIENTE').length;
        
        // Buscar siguiente cita hoy
        this.findSiguienteCita();

        // Lanzar animaciones GSAP
        this.animateDashboard();
      },
      error: (err) => console.error('Error al cargar agenda del día para el médico', err)
    });

    // Cargar todas las citas del médico para estadísticas generales
    this.citaService.obtenerTodasLasCitas(this.user.id).subscribe({
      next: (allCitas) => {
        const activeCitas = allCitas || [];
        this.calculateWeeklyStats(activeCitas);
        this.calculatePracticeStats(activeCitas);
      },
      error: (err) => console.error('Error al cargar todas las citas del médico', err)
    });

    // Cargar internaciones activas
    this.internacionService.listarActivas().subscribe({
      next: (data) => {
        this.activeHospitalizations = data || [];
      },
      error: (err) => console.error('Error al cargar internaciones activas', err)
    });
  }

  findSiguienteCita() {
    const now = new Date();
    const confirmedToday = this.citasHoy
      .filter(c => c.estado === 'CONFIRMADA')
      .map(c => ({
        ...c,
        dateObj: new Date(c.fechaHora)
      }))
      .filter(c => c.dateObj > now)
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    this.siguienteCita = confirmedToday.length > 0 ? confirmedToday[0] : null;
  }

  calculateWeeklyStats(citas: CitaResponse[]) {
    this.weeklyCitasCount = [0, 0, 0, 0, 0];
    const today = new Date();
    
    // Buscar el Lunes de la semana actual
    const currentDay = today.getDay(); // 0 es Domingo, 1 es Lunes
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday);
    monday.setHours(0, 0, 0, 0);

    const nextSaturday = new Date(monday);
    nextSaturday.setDate(monday.getDate() + 5); // Lunes a Viernes

    citas.forEach(c => {
      const cDate = new Date(c.fechaHora);
      if (cDate >= monday && cDate < nextSaturday && c.estado !== 'CANCELADA' && c.estado !== 'CANCELADA_POR_MEDICO') {
        const dayIndex = cDate.getDay() - 1; // 0 para Lunes, 4 para Viernes
        if (dayIndex >= 0 && dayIndex < 5) {
          this.weeklyCitasCount[dayIndex]++;
        }
      }
    });
  }

  calculatePracticeStats(citas: CitaResponse[]) {
    // Resetear contadores
    this.practiceTypes.forEach(p => p.count = 0);

    let totalVal = 0;
    citas.forEach(c => {
      if (c.estado !== 'CANCELADA' && c.estado !== 'CANCELADA_POR_MEDICO') {
        const type = c.tipoCita || 'CONSULTA';
        const pType = this.practiceTypes.find(p => p.key === type);
        if (pType) {
          pType.count++;
          totalVal++;
        } else {
          this.practiceTypes[0].count++;
          totalVal++;
        }
      }
    });

    this.practiceTypes.forEach(p => {
      p.percentage = totalVal > 0 ? Math.round((p.count / totalVal) * 100) : 0;
    });
  }

  confirmarCita(id: number) {
    this.citaService.actualizarEstado(id, 'CONFIRMADA').subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Turno Confirmado',
          text: 'Se ha confirmado la cita y se notificó al cliente.',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-3xl font-nunito shadow-xl'
          }
        });
        this.cargarDatosDashboard();
      },
      error: (err) => console.error('Error al confirmar cita', err)
    });
  }

  cancelarCita(id: number) {
    Swal.fire({
      title: '¿Cómo deseas cancelar este turno?',
      icon: 'warning',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonColor: '#ef4444',
      denyButtonColor: '#f59e0b',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Médico ausente (Reprogramable)',
      denyButtonText: 'Cancelación regular (Cliente)',
      cancelButtonText: 'Volver',
      customClass: {
        popup: 'rounded-3xl font-nunito shadow-xl',
        confirmButton: 'rounded-xl font-bold px-4 py-2.5 text-xs',
        denyButton: 'rounded-xl font-bold px-4 py-2.5 text-xs',
        cancelButton: 'rounded-xl font-bold px-4 py-2.5 text-xs'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Veterinario no asiste (CANCELADA_POR_MEDICO)
        Swal.fire({
          title: 'Motivo de la inasistencia',
          input: 'text',
          inputPlaceholder: 'Ej: Urgencia médica, enfermedad, imprevisto...',
          showCancelButton: true,
          confirmButtonColor: '#ef4444',
          cancelButtonColor: '#94a3b8',
          confirmButtonText: 'Confirmar cancelación',
          cancelButtonText: 'Volver',
          inputValidator: (value) => {
            if (!value) {
              return '¡Debes escribir un motivo!';
            }
            return null;
          },
          customClass: {
            popup: 'rounded-3xl font-nunito shadow-xl',
            confirmButton: 'rounded-xl font-bold px-6 py-2.5',
            cancelButton: 'rounded-xl font-bold px-6 py-2.5'
          }
        }).then((motivoResult) => {
          if (motivoResult.isConfirmed) {
            const motivo = motivoResult.value;
            this.citaService.actualizarEstado(id, 'CANCELADA_POR_MEDICO', motivo).subscribe({
              next: () => {
                Swal.fire({
                  icon: 'success',
                  title: 'Turno Cancelado',
                  text: 'Se canceló el turno y se notificó al cliente para que pueda reprogramar.',
                  timer: 2500,
                  showConfirmButton: false,
                  customClass: {
                    popup: 'rounded-3xl font-nunito shadow-xl'
                  }
                });
                this.cargarDatosDashboard();
              },
              error: (err) => console.error('Error al cancelar cita por inasistencia médica', err)
            });
          }
        });
      } else if (result.isDenied) {
        // Cancelación estándar (CANCELADA)
        this.citaService.actualizarEstado(id, 'CANCELADA').subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Turno Cancelado',
              text: 'Se ha cancelado la cita correctamente.',
              timer: 2000,
              showConfirmButton: false,
              customClass: {
                popup: 'rounded-3xl font-nunito shadow-xl'
              }
            });
            this.cargarDatosDashboard();
          },
          error: (err) => console.error('Error al cancelar cita', err)
        });
      }
    });
  }

  iniciarConsulta(cita: CitaResponse) {
    this.router.navigate(['/doctor/historias']);
  }

  getMaxBarHeight(count: number): number {
    const maxVal = Math.max(...this.weeklyCitasCount, 1);
    return (count / maxVal) * 90; // Escalar a un alto máximo de 90px
  }

  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'Pendiente';
      case 'CONFIRMADA': return 'Confirmada';
      case 'EN_PROGRESO': return 'En Curso';
      case 'COMPLETADA': return 'Completado';
      case 'CANCELADA': return 'Cancelada';
      case 'CANCELADA_POR_MEDICO': return 'Cancelada (Médico)';
      case 'NO_ASISTIO': return 'No Asistió';
      default: return estado;
    }
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

      // Entrada progresiva de las barras de estadísticas
      gsap.set('.stat-progress-bar', { width: '0%' });
      gsap.from('.stat-progress-bar', {
        duration: 1.2,
        width: '0%',
        ease: 'power2.out',
        stagger: 0.12
      });

      // Animación de escala vertical para la línea de timeline
      gsap.from('.timeline-line', {
        duration: 1.2,
        scaleY: 0,
        ease: 'power2.out'
      });
    }, 50);
  }
}
