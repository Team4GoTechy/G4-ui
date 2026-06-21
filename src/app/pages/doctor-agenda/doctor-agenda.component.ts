import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitaService } from '../../services/cita.service';
import { MascotaService } from '../../services/mascota.service';
import { AuthService } from '../../services/auth.service';
import { CitaResponse } from '../../models/cita.model';
import { MascotaResponse } from '../../models/mascota.model';

@Component({
  selector: 'app-doctor-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-agenda.component.html'
})
export class DoctorAgendaComponent implements OnInit {
  private citaService = inject(CitaService);
  private mascotaService = inject(MascotaService);
  private authService = inject(AuthService);

  user = this.authService.getCurrentUser();
  loading = false;

  // View Mode
  vistaModo: 'dia' | 'mes' = 'dia';

  // State for Daily View
  fechaActual: string = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  citasDelDia: CitaResponse[] = [];

  // State for Monthly View
  mesActual: Date = new Date(); // El día 1 del mes que estamos viendo
  citasDelMes: CitaResponse[] = [];
  diasCalendario: { fecha: Date; citas: CitaResponse[]; isCurrentMonth: boolean }[] = [];

  // Mascotas Disponibles para el Select
  mascotasDisponibles: MascotaResponse[] = [];

  // Estado del Modal Nueva Cita
  isModalOpen = false;
  
  // Estado del Modal Detalle
  isDetalleModalOpen = false;
  citaSeleccionada: CitaResponse | null = null;
  
  // Modelo para la nueva cita
  nuevaCita = {
    mascotaId: 0,
    tipoCita: 'CONSULTA',
    fechaHora: '',
    duracionMinutos: 30,
    notas: ''
  };

  tiposCita = ['CONSULTA', 'CONTROL', 'VACUNACION', 'URGENCIA'];

  ngOnInit(): void {
    this.cargarMascotas();
    this.mesActual = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.cargarAgenda();
  }

  cargarMascotas() {
    this.mascotaService.obtenerTodas().subscribe({
      next: (res) => this.mascotasDisponibles = res || [],
      error: (err) => console.error('Error cargando mascotas', err)
    });
  }

  cambiarVista(modo: 'dia' | 'mes') {
    this.vistaModo = modo;
    this.cargarAgenda();
  }

  cargarAgenda() {
    if (!this.user?.id) return;
    this.loading = true;

    if (this.vistaModo === 'dia') {
      this.citaService.obtenerAgendaDia(this.user.id, this.fechaActual).subscribe({
        next: (data) => {
          this.citasDelDia = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar la agenda del día', err);
          this.loading = false;
        }
      });
    } else {
      const yearMonth = `${this.mesActual.getFullYear()}-${String(this.mesActual.getMonth() + 1).padStart(2, '0')}`;
      this.citaService.obtenerAgendaMes(this.user.id, yearMonth).subscribe({
        next: (data) => {
          this.citasDelMes = data;
          this.generarCalendario();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar la agenda del mes', err);
          this.loading = false;
        }
      });
    }
  }

  // --- Lógica del Calendario Mensual ---

  cambiarMes(delta: number) {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + delta, 1);
    this.cargarAgenda();
  }

  generarCalendario() {
    const year = this.mesActual.getFullYear();
    const month = this.mesActual.getMonth();
    
    // Primer día del mes
    const firstDayOfMonth = new Date(year, month, 1);
    // Último día del mes
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // En JS, getDay() devuelve 0 para Domingo, 1 para Lunes. Queremos que la semana empiece en Lunes (o Domingo, como prefieras, hagamos Domingo 0).
    const startDayIndex = firstDayOfMonth.getDay();

    const dias = [];
    
    // Días del mes anterior (padding)
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayIndex - 1; i >= 0; i--) {
      dias.push({
        fecha: new Date(year, month - 1, prevMonthLastDay - i),
        citas: [],
        isCurrentMonth: false
      });
    }

    // Días del mes actual
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      // Filtrar citas de este día
      const dateString = currentDate.toISOString().split('T')[0];
      const citasDelDia = this.citasDelMes.filter(c => c.fechaHora.startsWith(dateString));
      
      dias.push({
        fecha: currentDate,
        citas: citasDelDia,
        isCurrentMonth: true
      });
    }

    // Días del mes siguiente (padding para completar grilla 7x6 o 7x5)
    const remainingDays = (7 - (dias.length % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
      dias.push({
        fecha: new Date(year, month + 1, i),
        citas: [],
        isCurrentMonth: false
      });
    }

    this.diasCalendario = dias;
  }

  seleccionarDiaDesdeCalendario(fecha: Date) {
    // Para no lidiar con zonas horarias conflictivas en ISOString:
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    this.fechaActual = `${year}-${month}-${day}`;
    this.cambiarVista('dia');
  }

  // --- Lógica Diaria ---

  cambiarFecha(event: any) {
    this.fechaActual = event.target.value;
    this.cargarAgenda();
  }

  // --- Lógica Modal y Citas ---

  abrirModal() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.nuevaCita.fechaHora = now.toISOString().slice(0, 16);
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.nuevaCita = {
      mascotaId: 0,
      tipoCita: 'CONSULTA',
      fechaHora: '',
      duracionMinutos: 30,
      notas: ''
    };
  }

  abrirDetalleCita(cita: CitaResponse) {
    this.citaSeleccionada = cita;
    this.isDetalleModalOpen = true;
  }

  cerrarDetalleCita() {
    this.isDetalleModalOpen = false;
    this.citaSeleccionada = null;
  }

  guardarCita() {
    if (!this.user?.id || !this.nuevaCita.mascotaId || !this.nuevaCita.fechaHora) {
      alert("Por favor complete los campos obligatorios.");
      return;
    }

    const fechaSeleccionada = new Date(this.nuevaCita.fechaHora);
    if (fechaSeleccionada < new Date()) {
      alert("No se puede agendar una cita en el pasado.");
      return;
    }
    
    const payload = {
      ...this.nuevaCita,
      veterinarioId: this.user.id,
      fechaHora: this.nuevaCita.fechaHora
    };

    this.citaService.crearCita(payload).subscribe({
      next: (res) => {
        this.cerrarModal();
        this.cargarAgenda();
      },
      error: (err) => {
        console.error('Error creando cita', err);
        alert("Ocurrió un error al crear la cita. Verifique si el horario está disponible.");
      }
    });
  }

  cambiarEstado(cita: CitaResponse, event: any) {
    const nuevoEstado = event.target.value;
    if (cita.estado === nuevoEstado) return;

    this.citaService.actualizarEstado(cita.id, nuevoEstado).subscribe({
      next: (res) => {
        cita.estado = res.estado; 
      },
      error: (err) => {
        console.error('Error actualizando estado', err);
        alert("No se pudo actualizar el estado de la cita.");
        event.target.value = cita.estado;
      }
    });
  }

  formatHora(isoString: string): string {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getTurno(isoString: string): string {
    if (!isoString) return '';
    const hour = new Date(isoString).getHours();
    return hour < 12 ? 'Mañana' : 'Tarde';
  }

  getNombreMesActual(): string {
    return this.mesActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  }

  // --- Kanban Drag & Drop ---
  getCitasPorEstado(estado: string): CitaResponse[] {
    return this.citasDelDia.filter(c => c.estado === estado);
  }

  drag(event: any, cita: CitaResponse) {
    event.dataTransfer.setData('citaId', cita.id.toString());
  }

  allowDrop(event: any) {
    event.preventDefault();
  }

  drop(event: any, nuevoEstado: string) {
    event.preventDefault();
    const citaIdStr = event.dataTransfer.getData('citaId');
    if (!citaIdStr) return;
    
    const citaId = parseInt(citaIdStr, 10);
    const cita = this.citasDelDia.find(c => c.id === citaId);
    
    if (cita && cita.estado !== nuevoEstado) {
      // Optimistic UI Update
      const oldEstado = cita.estado;
      cita.estado = nuevoEstado;
      
      this.citaService.actualizarEstado(cita.id, nuevoEstado).subscribe({
        next: (res) => {
          cita.estado = res.estado;
        },
        error: (err) => {
          console.error('Error actualizando estado', err);
          cita.estado = oldEstado; // Revert
          alert("No se pudo actualizar el estado de la cita.");
        }
      });
    }
  }

  get fechaMinima(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }
}
