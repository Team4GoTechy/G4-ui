import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InternacionService } from '../../services/internacion.service';
import { MascotaService } from '../../services/mascota.service';
import { AuthService } from '../../services/auth.service';
import { InternacionResponse, InternacionRequest, EvolucionRequest } from '../../models/internacion.model';
import { MascotaResponse } from '../../models/mascota.model';

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

  // Estado para desplegar historial de evoluciones en la tarjeta
  evolucionesAbiertas: { [key: number]: boolean } = {};

  ngOnInit() {
    this.cargarInternaciones();
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
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    this.internacionService.ingresar(this.nuevoIngreso).subscribe({
      next: () => {
        this.cerrarIngresoModal();
        this.cargarInternaciones();
      },
      error: (err) => {
        console.error('Error al ingresar paciente', err);
        alert('Ocurrió un error al registrar el ingreso.');
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
      alert('La observación es obligatoria.');
      return;
    }

    this.internacionService.registrarEvolucion(this.internacionSeleccionada.id, this.nuevaEvolucion).subscribe({
      next: () => {
        this.cerrarEvolucionModal();
        this.cargarInternaciones(); // Recargar para obtener la nueva evolución
      },
      error: (err) => {
        console.error('Error registrando evolución', err);
        alert('Ocurrió un error al guardar la evolución.');
      }
    });
  }

  // --- Alta Médica ---

  darDeAlta(internacionId: number) {
    if (!confirm('¿Está seguro de que desea dar de alta a este paciente?')) {
      return;
    }

    this.internacionService.darDeAlta(internacionId).subscribe({
      next: () => {
        this.cargarInternaciones();
      },
      error: (err) => {
        console.error('Error dando de alta', err);
        alert('Ocurrió un error al dar de alta al paciente.');
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
