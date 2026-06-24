import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CitaService } from '../../services/cita.service';
import { MascotaService } from '../../services/mascota.service';
import { VeterinarioService } from '../../services/veterinario.service';
import { ServicioService } from '../../services/servicio.service';
import { CitaResponse } from '../../models/cita.model';
import { MascotaResponse } from '../../models/mascota.model';
import { VeterinarioResponse, HorarioResponse } from '../../models/veterinario.model';
import { ServicioResponse } from '../../models/servicio.model';
@Component({
  selector: 'app-client-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-turnos.component.html'
})
export class ClientTurnosComponent implements OnInit {
  private citaService = inject(CitaService);
  private mascotaService = inject(MascotaService);
  private veterinarioService = inject(VeterinarioService);
  private servicioService = inject(ServicioService);
  private route = inject(ActivatedRoute);

  citas: CitaResponse[] = [];
  mascotas: MascotaResponse[] = [];
  veterinarios: VeterinarioResponse[] = [];
  servicios: ServicioResponse[] = [];
  veterinariosFiltrados: VeterinarioResponse[] = [];
  horariosDoctor: HorarioResponse[] = [];

  loadingCitas = false;
  loadingVets = false;
  loadingMascotas = false;
  loadingSlots = false;
  submitting = false;

  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  // Form State
  mascotaSeleccionadaId: number | null = null;
  servicioSeleccionado: ServicioResponse | null = null;
  doctorSeleccionado: VeterinarioResponse | null = null;
  fechaSeleccionada = '';
  slotSeleccionado: string | null = null;
  notas = '';

  horasDisponibles: { hora: string; disponible: boolean }[] = [];

  slotsDefecto = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', 
    '16:00', '16:30', '17:00'
  ];

  ngOnInit(): void {
    this.cargarCitas();
    this.cargarMascotas();
    this.cargarVeterinarios();
    this.cargarServicios();
  }

  cargarCitas(): void {
    this.loadingCitas = true;
    this.citaService.obtenerMisCitas().subscribe({
      next: (data) => {
        this.citas = data || [];
        this.loadingCitas = false;
      },
      error: (err) => {
        console.error('Error cargando citas del cliente', err);
        this.loadingCitas = false;
      }
    });
  }

  cargarMascotas(): void {
    this.loadingMascotas = true;
    this.mascotaService.obtenerMisMascotas().subscribe({
      next: (data) => {
        this.mascotas = data || [];
        this.loadingMascotas = false;
      },
      error: (err) => {
        console.error('Error cargando mascotas del cliente', err);
        this.loadingMascotas = false;
      }
    });
  }

  cargarVeterinarios(): void {
    this.loadingVets = true;
    this.veterinarioService.listarActivos().subscribe({
      next: (data) => {
        this.veterinarios = (data || []).filter(v => v.activo);
        this.loadingVets = false;
        this.checkQueryParams();
      },
      error: (err) => {
        console.error('Error cargando veterinarios', err);
        this.loadingVets = false;
      }
    });
  }

  cargarServicios(): void {
    this.servicioService.listarTodos().subscribe({
      next: (data) => {
        this.servicios = data || [];
        this.checkQueryParams();
      },
      error: (err) => console.error('Error cargando servicios', err)
    });
  }

  checkQueryParams(): void {
    if (this.veterinarios.length === 0 || this.servicios.length === 0) return;

    const vetIdParam = this.route.snapshot.queryParams['vetId'];
    const tipoCitaParam = this.route.snapshot.queryParams['tipoCita'];

    if (vetIdParam) {
      const vetId = parseInt(vetIdParam, 10);
      
      let matchingService = null;
      if (tipoCitaParam) {
        matchingService = this.servicios.find(s => {
          const nameLower = s.nombre.toLowerCase();
          const tipoLower = tipoCitaParam.toLowerCase();
          return nameLower.includes(tipoLower) || tipoLower.includes(nameLower) ||
                 (tipoLower === 'consulta' && nameLower.includes('consulta')) ||
                 (tipoLower === 'vacunacion' && nameLower.includes('vacun')) ||
                 (tipoLower === 'cirugia' && nameLower.includes('cirug')) ||
                 (tipoLower === 'grooming' && nameLower.includes('groom'));
        });
      }

      if (!matchingService) {
        matchingService = this.servicios.find(s => s.veterinarios.some(v => v.id === vetId));
      }

      if (matchingService) {
        this.servicioSeleccionado = matchingService;
        this.onServicioChange();

        const matchingVet = this.veterinariosFiltrados.find(v => v.id === vetId);
        if (matchingVet) {
          this.seleccionarDoctor(matchingVet);
        }
      }
    }
  }

  onServicioChange(): void {
    this.doctorSeleccionado = null;
    this.slotSeleccionado = null;
    this.horasDisponibles = [];
    
    if (this.servicioSeleccionado) {
      const associatedIds = this.servicioSeleccionado.veterinarios.map(v => v.id);
      this.veterinariosFiltrados = this.veterinarios.filter(v => associatedIds.includes(v.id));
    } else {
      this.veterinariosFiltrados = [];
    }
  }

  seleccionarDoctor(vet: VeterinarioResponse): void {
    this.doctorSeleccionado = vet;
    this.slotSeleccionado = null;
    this.horariosDoctor = [];
    this.cargarHorariosDoctor(vet.id);
    this.actualizarSlotsDisponibles();
  }

  cargarHorariosDoctor(vetId: number): void {
    this.veterinarioService.listarHorarios(vetId).subscribe({
      next: (data) => {
        this.horariosDoctor = (data || []).filter(h => h.trabaja);
      },
      error: (err) => {
        console.error('Error cargando horarios del doctor', err);
        this.horariosDoctor = [];
      }
    });
  }

  onFechaChange(): void {
    this.slotSeleccionado = null;
    this.actualizarSlotsDisponibles();
  }

  actualizarSlotsDisponibles(): void {
    if (!this.doctorSeleccionado || !this.fechaSeleccionada) {
      this.horasDisponibles = [];
      return;
    }

    this.loadingSlots = true;
    this.citaService.obtenerAgendaDia(this.doctorSeleccionado.usuarioId, this.fechaSeleccionada).subscribe({
      next: (citasExistentes) => {
        const bookedHours = (citasExistentes || [])
          .filter(c => c.estado !== 'CANCELADA' && c.estado !== 'NO_ASISTIO')
          .map(c => {
            const timePart = c.fechaHora.split('T')[1];
            return timePart ? timePart.substring(0, 5) : '';
          });

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const localTodayStr = `${year}-${month}-${day}`;
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();

        this.horasDisponibles = this.slotsDefecto.map(slot => {
          let disponible = !bookedHours.includes(slot);

          // Si es hoy, inhabilitar horarios que ya pasaron
          if (this.fechaSeleccionada === localTodayStr) {
            const [slotHour, slotMin] = slot.split(':').map(Number);
            if (slotHour < currentHour || (slotHour === currentHour && slotMin <= currentMin)) {
              disponible = false;
            }
          }

          return {
            hora: slot,
            disponible: disponible
          };
        });
        this.loadingSlots = false;
      },
      error: (err) => {
        console.error('Error cargando agenda del doctor', err);
        this.horasDisponibles = this.slotsDefecto.map(slot => ({ hora: slot, disponible: true }));
        this.loadingSlots = false;
      }
    });
  }

  seleccionarSlot(hora: string): void {
    this.slotSeleccionado = hora;
  }

  reservarTurno(): void {
    if (!this.mascotaSeleccionadaId || !this.servicioSeleccionado || !this.doctorSeleccionado || !this.fechaSeleccionada || !this.slotSeleccionado) {
      this.mensajeError = 'Por favor complete todos los pasos de la reserva.';
      return;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const localTodayStr = `${year}-${month}-${day}`;
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();

    // Validar por si acaso que el slot no haya pasado en tiempo real
    if (this.fechaSeleccionada === localTodayStr) {
      const [slotHour, slotMin] = this.slotSeleccionado.split(':').map(Number);
      if (slotHour < currentHour || (slotHour === currentHour && slotMin <= currentMin)) {
        this.mensajeError = 'El horario seleccionado ya ha pasado en el día de hoy. Por favor elige otro horario.';
        return;
      }
    }

    this.submitting = true;
    this.mensajeExito = null;
    this.mensajeError = null;

    const fechaHora = `${this.fechaSeleccionada}T${this.slotSeleccionado}:00`;

    // Map service name to Cita enum
    let tipoCita = 'CONSULTA';
    if (this.servicioSeleccionado) {
      const nombre = this.servicioSeleccionado.nombre.toLowerCase();
      if (nombre.includes('vacuna')) {
        tipoCita = 'VACUNACION';
      } else if (nombre.includes('cirug') || nombre.includes('operac')) {
        tipoCita = 'CIRUGIA';
      } else if (nombre.includes('baño') || nombre.includes('peluquer') || nombre.includes('groom')) {
        tipoCita = 'GROOMING';
      } else if (nombre.includes('control') || nombre.includes('seguim')) {
        tipoCita = 'CONTROL';
      }
    }

    const notasCompletas = `Servicio: ${this.servicioSeleccionado.nombre} ($ ${this.servicioSeleccionado.precio})` + (this.notas.trim() ? ` - Notas: ${this.notas}` : '');

    const payload = {
      mascotaId: this.mascotaSeleccionadaId,
      veterinarioId: this.doctorSeleccionado.usuarioId,
      tipoCita: tipoCita,
      fechaHora: fechaHora,
      duracionMinutos: 30,
      notas: notasCompletas
    };

    this.citaService.crearCita(payload).subscribe({
      next: () => {
        this.mensajeExito = '¡Turno solicitado correctamente! El veterinario revisará tu solicitud.';
        this.submitting = false;
        // Reset Form
        this.mascotaSeleccionadaId = null;
        this.servicioSeleccionado = null;
        this.doctorSeleccionado = null;
        this.fechaSeleccionada = '';
        this.slotSeleccionado = null;
        this.notas = '';
        this.horasDisponibles = [];
        this.veterinariosFiltrados = [];
        // Reload List
        this.cargarCitas();
      },
      error: (err) => {
        console.error('Error al reservar turno', err);
        this.mensajeError = 'Ocurrió un error al reservar el turno. Por favor intenta con otro horario.';
        this.submitting = false;
      }
    });
  }

  getEstadoClase(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CONFIRMADA':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'EN_PROGRESO':
        return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'COMPLETADA':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'CANCELADA':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'NO_ASISTIO':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'Pendiente';
      case 'CONFIRMADA': return 'Confirmado';
      case 'EN_PROGRESO': return 'En Progreso';
      case 'COMPLETADA': return 'Completado';
      case 'CANCELADA': return 'Cancelado';
      case 'NO_ASISTIO': return 'No Asistió';
      default: return estado;
    }
  }

  get fechaMinima(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().split('T')[0];
  }

  getDoctorAvatar(avatar: any): string {
    if (!avatar) return '/assets/images/avatars/chico.jpg';
    if (avatar.startsWith('http') || avatar.startsWith('/') || avatar.startsWith('assets/')) {
      return avatar;
    }
    return '/assets/images/avatars/' + avatar;
  }

  // Clases de color dinámicas según el doctor para UI Premium
  getDoctorColorClasses(vetId: number, isSelected: boolean): string {
    const colors = [
      {
        selected: 'border-orange-400 bg-orange-50/70 text-orange-600 font-black shadow-sm',
        hover: 'border-slate-200 text-slate-700 hover:border-orange-200 hover:bg-orange-50/20 bg-white'
      },
      {
        selected: 'border-emerald-400 bg-emerald-50/70 text-emerald-600 font-black shadow-sm',
        hover: 'border-slate-200 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/20 bg-white'
      },
      {
        selected: 'border-sky-400 bg-sky-50/70 text-sky-600 font-black shadow-sm',
        hover: 'border-slate-200 text-slate-700 hover:border-sky-200 hover:bg-sky-50/20 bg-white'
      },
      {
        selected: 'border-rose-400 bg-rose-50/70 text-rose-600 font-black shadow-sm',
        hover: 'border-slate-200 text-slate-700 hover:border-rose-200 hover:bg-rose-50/20 bg-white'
      },
      {
        selected: 'border-violet-400 bg-violet-50/70 text-violet-600 font-black shadow-sm',
        hover: 'border-slate-200 text-slate-700 hover:border-violet-200 hover:bg-violet-50/20 bg-white'
      }
    ];
    const index = vetId % colors.length;
    const colorTheme = colors[index] || colors[0];
    return isSelected ? colorTheme.selected : colorTheme.hover;
  }

  getDoctorCardClasses(vetId: number, isSelected: boolean): string {
    const cardColors = [
      {
        selected: 'border-orange-400 bg-orange-50/20',
        hover: 'border-slate-100 hover:border-orange-200 bg-slate-50/50 shadow-sm'
      },
      {
        selected: 'border-emerald-400 bg-emerald-50/20',
        hover: 'border-slate-100 hover:border-emerald-200 bg-slate-50/50 shadow-sm'
      },
      {
        selected: 'border-sky-400 bg-sky-50/20',
        hover: 'border-slate-100 hover:border-sky-200 bg-slate-50/50 shadow-sm'
      },
      {
        selected: 'border-rose-400 bg-rose-50/20',
        hover: 'border-slate-100 hover:border-rose-200 bg-slate-50/50 shadow-sm'
      },
      {
        selected: 'border-violet-400 bg-violet-50/20',
        hover: 'border-slate-100 hover:border-violet-200 bg-slate-50/50 shadow-sm'
      }
    ];
    const index = vetId % cardColors.length;
    const theme = cardColors[index] || cardColors[0];
    return isSelected ? theme.selected : theme.hover;
  }

  getDoctorScheduleCardClasses(vetId: number): string {
    const cardColors = [
      'bg-orange-50/30 border-orange-100',
      'bg-emerald-50/30 border-emerald-100',
      'bg-sky-50/30 border-sky-100',
      'bg-rose-50/30 border-rose-100',
      'bg-violet-50/30 border-violet-100'
    ];
    const index = vetId % cardColors.length;
    return cardColors[index] || cardColors[2];
  }

  getDoctorScheduleTextClasses(vetId: number): string {
    const textColors = [
      'text-orange-800',
      'text-emerald-800',
      'text-sky-800',
      'text-rose-800',
      'text-violet-800'
    ];
    const index = vetId % textColors.length;
    return textColors[index] || textColors[2];
  }

  getDoctorNameTextClasses(vetId: number): string {
    const nameColors = [
      'text-orange-600',
      'text-emerald-600',
      'text-sky-600',
      'text-rose-600',
      'text-violet-600'
    ];
    const index = vetId % nameColors.length;
    return nameColors[index] || nameColors[2];
  }

  getDoctorScheduleRowClasses(vetId: number): string {
    const rowColors = [
      'border-orange-50/50 text-orange-700',
      'border-emerald-50/50 text-emerald-700',
      'border-sky-50/50 text-sky-700',
      'border-rose-50/50 text-rose-700',
      'border-violet-50/50 text-violet-700'
    ];
    const index = vetId % rowColors.length;
    return rowColors[index] || rowColors[2];
  }
}
