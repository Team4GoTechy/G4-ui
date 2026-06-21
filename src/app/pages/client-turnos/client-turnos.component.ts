import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitaService } from '../../services/cita.service';
import { MascotaService } from '../../services/mascota.service';
import { VeterinarioService } from '../../services/veterinario.service';
import { CitaResponse } from '../../models/cita.model';
import { MascotaResponse } from '../../models/mascota.model';
import { VeterinarioResponse } from '../../models/veterinario.model';

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

  citas: CitaResponse[] = [];
  mascotas: MascotaResponse[] = [];
  veterinarios: VeterinarioResponse[] = [];

  loadingCitas = false;
  loadingVets = false;
  loadingMascotas = false;
  loadingSlots = false;
  submitting = false;

  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  // Form State
  mascotaSeleccionadaId: number | null = null;
  doctorSeleccionado: VeterinarioResponse | null = null;
  tipoCitaSeleccionado = 'CONSULTA';
  fechaSeleccionada = '';
  slotSeleccionado: string | null = null;
  notas = '';

  tiposCita = ['CONSULTA', 'VACUNACION', 'CIRUGIA', 'GROOMING', 'CONTROL'];
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
    this.veterinarioService.listarTodos().subscribe({
      next: (data) => {
        this.veterinarios = (data || []).filter(v => v.activo);
        this.loadingVets = false;
      },
      error: (err) => {
        console.error('Error cargando veterinarios', err);
        this.loadingVets = false;
      }
    });
  }

  seleccionarDoctor(vet: VeterinarioResponse): void {
    this.doctorSeleccionado = vet;
    this.slotSeleccionado = null;
    this.actualizarSlotsDisponibles();
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

        this.horasDisponibles = this.slotsDefecto.map(slot => {
          return {
            hora: slot,
            disponible: !bookedHours.includes(slot)
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
    if (!this.mascotaSeleccionadaId || !this.doctorSeleccionado || !this.fechaSeleccionada || !this.slotSeleccionado) {
      this.mensajeError = 'Por favor complete todos los pasos de la reserva.';
      return;
    }

    this.submitting = true;
    this.mensajeExito = null;
    this.mensajeError = null;

    const fechaHora = `${this.fechaSeleccionada}T${this.slotSeleccionado}:00`;

    const payload = {
      mascotaId: this.mascotaSeleccionadaId,
      veterinarioId: this.doctorSeleccionado.usuarioId,
      tipoCita: this.tipoCitaSeleccionado,
      fechaHora: fechaHora,
      duracionMinutos: 30,
      notas: this.notas
    };

    this.citaService.crearCita(payload).subscribe({
      next: () => {
        this.mensajeExito = '¡Turno solicitado correctamente! El veterinario revisará tu solicitud.';
        this.submitting = false;
        // Reset Form
        this.mascotaSeleccionadaId = null;
        this.doctorSeleccionado = null;
        this.fechaSeleccionada = '';
        this.slotSeleccionado = null;
        this.notas = '';
        this.horasDisponibles = [];
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

  getDoctorAvatar(avatar: string | null | undefined): string {
    if (!avatar) return '/assets/images/avatars/señor.jpg';
    if (avatar.startsWith('http') || avatar.startsWith('/') || avatar.startsWith('assets/')) {
      return avatar;
    }
    return '/assets/images/avatars/' + avatar;
  }
}
