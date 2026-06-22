import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InternacionService } from '../../services/internacion.service';
import { MascotaService } from '../../services/mascota.service';
import { AuthService } from '../../services/auth.service';
import { InternacionResponse, InternacionRequest, EvolucionRequest } from '../../models/internacion.model';
import { MascotaResponse } from '../../models/mascota.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-doctor-internaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-internaciones.component.html'
})
export class DoctorInternacionesComponent implements OnInit {
  private internacionService = inject(InternacionService);
  private mascotaService = inject(MascotaService);
  private authService = inject(AuthService);

  user = this.authService.getCurrentUser();
  internacionesActivas: InternacionResponse[] = [];
  solicitudesReingreso: InternacionResponse[] = [];
  mascotasDisponibles: MascotaResponse[] = [];
  loading = false;

  // Modal Nuevo Ingreso
  isIngresoModalOpen = false;
  nuevoIngreso: InternacionRequest = {
    mascotaId: 0,
    veterinarioId: 0,
    motivo: '',
    jaulaId: '',
    notas: ''
  };

  // Modal Evolución
  isEvolucionModalOpen = false;
  internacionSeleccionada: InternacionResponse | null = null;
  nuevaEvolucion: EvolucionRequest = {
    observacion: '',
    peso: 0,
    temperatura: 0
  };

  // Modal Alta Médica con Cuidados
  isAltaModalOpen = false;
  internacionAltaSeleccionada: InternacionResponse | null = null;
  indicacionesAlta = '';

  // Modal Aprobar Reingreso Solicitado por Cliente
  isAprobarReingresoModalOpen = false;
  reingresoSeleccionado: InternacionResponse | null = null;
  jaulaReingreso = '';

  // Estado para desplegar historial de evoluciones en la tarjeta
  evolucionesAbiertas: { [key: number]: boolean } = {};

  ngOnInit() {
    this.cargarInternaciones();
    this.cargarSolicitudes();
    this.cargarMascotas();
  }

  cargarMascotas() {
    this.mascotaService.obtenerTodas().subscribe({
      next: (res) => this.mascotasDisponibles = res || [],
      error: (err) => console.error('Error al cargar mascotas', err)
    });
  }

  cargarInternaciones() {
    this.loading = true;
    this.internacionService.listarActivas().subscribe({
      next: (res) => {
        this.internacionesActivas = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar internaciones', err);
        this.loading = false;
      }
    });
  }

  cargarSolicitudes() {
    this.internacionService.listarPendientesReingreso().subscribe({
      next: (res) => {
        this.solicitudesReingreso = res || [];
      },
      error: (err) => console.error('Error al cargar solicitudes de reingreso', err)
    });
  }

  toggleEvoluciones(id: number) {
    this.evolucionesAbiertas[id] = !this.evolucionesAbiertas[id];
  }

  // --- Ingreso ---

  abrirIngresoModal() {
    if (!this.user?.id) return;
    this.nuevoIngreso = {
      mascotaId: 0,
      veterinarioId: this.user.id,
      motivo: '',
      jaulaId: '',
      notas: ''
    };
    this.isIngresoModalOpen = true;
  }

  cerrarIngresoModal() {
    this.isIngresoModalOpen = false;
  }

  guardarIngreso() {
    if (!this.nuevoIngreso.mascotaId || !this.nuevoIngreso.motivo || !this.nuevoIngreso.jaulaId) {
      toast.warning('Por favor, complete todos los campos obligatorios.');
      return;
    }

    this.internacionService.ingresar(this.nuevoIngreso).subscribe({
      next: () => {
        toast.success('Ingreso registrado correctamente.');
        this.cerrarIngresoModal();
        this.cargarInternaciones();
      },
      error: (err) => {
        console.error('Error al ingresar paciente', err);
        toast.error('Ocurrió un error al registrar el ingreso.');
      }
    });
  }

  // --- Evolución ---

  abrirEvolucionModal(internacion: InternacionResponse) {
    this.internacionSeleccionada = internacion;
    this.nuevaEvolucion = {
      observacion: '',
      peso: 0,
      temperatura: 0
    };
    this.isEvolucionModalOpen = true;
  }

  cerrarEvolucionModal() {
    this.isEvolucionModalOpen = false;
    this.internacionSeleccionada = null;
  }

  guardarEvolucion() {
    if (!this.internacionSeleccionada || !this.nuevaEvolucion.observacion) {
      toast.warning('La observación es obligatoria.');
      return;
    }

    this.internacionService.registrarEvolucion(this.internacionSeleccionada.id, this.nuevaEvolucion).subscribe({
      next: () => {
        toast.success('Evolución guardada correctamente.');
        this.cerrarEvolucionModal();
        this.cargarInternaciones(); // Recargar para obtener la nueva evolución
      },
      error: (err) => {
        console.error('Error registrando evolución', err);
        toast.error('Ocurrió un error al guardar la evolución.');
      }
    });
  }

  // --- Alta Médica ---

  abrirAltaModal(internacion: InternacionResponse) {
    this.internacionAltaSeleccionada = internacion;
    this.indicacionesAlta = '';
    this.isAltaModalOpen = true;
  }

  cerrarAltaModal() {
    this.isAltaModalOpen = false;
    this.internacionAltaSeleccionada = null;
  }

  guardarAlta() {
    if (!this.internacionAltaSeleccionada) return;
    if (!this.indicacionesAlta.trim()) {
      toast.warning('Las indicaciones de cuidado post-alta son obligatorias.');
      return;
    }

    this.internacionService.darDeAlta(this.internacionAltaSeleccionada.id, this.indicacionesAlta).subscribe({
      next: () => {
        toast.success('Paciente dado de alta correctamente.');
        this.cerrarAltaModal();
        this.cargarInternaciones();
      },
      error: (err) => {
        console.error('Error dando de alta', err);
        toast.error('Ocurrió un error al dar de alta al paciente.');
      }
    });
  }

  // --- Confirmar Reingreso ---

  abrirAprobarReingresoModal(internacion: InternacionResponse) {
    this.reingresoSeleccionado = internacion;
    this.jaulaReingreso = '';
    this.isAprobarReingresoModalOpen = true;
  }

  cerrarAprobarReingresoModal() {
    this.isAprobarReingresoModalOpen = false;
    this.reingresoSeleccionado = null;
  }

  guardarConfirmacionReingreso() {
    if (!this.reingresoSeleccionado || !this.jaulaReingreso.trim()) {
      toast.warning('Debes ingresar un ID de jaula física para aceptar al paciente.');
      return;
    }

    this.internacionService.confirmarReingreso(this.reingresoSeleccionado.id, this.jaulaReingreso).subscribe({
      next: () => {
        toast.success('Reingreso confirmado exitosamente.');
        this.cerrarAprobarReingresoModal();
        this.cargarInternaciones();
        this.cargarSolicitudes();
      },
      error: (err) => {
        console.error('Error al confirmar reingreso', err);
        toast.error('Ocurrió un error al procesar el reingreso.');
      }
    });
  }

  // Utility para saber cuántos días lleva internado
  diasInternado(fechaIngreso: string): number {
    const inicio = new Date(fechaIngreso);
    const ahora = new Date();
    const diffTime = Math.abs(ahora.getTime() - inicio.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }
}
