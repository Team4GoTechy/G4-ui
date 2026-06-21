import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsultaService } from '../../services/consulta.service';
import { AuthService } from '../../services/auth.service';
import { ConsultaResponse, ConsultaRequest } from '../../models/consulta.model';
import { PrescripcionService } from '../../services/prescripcion.service';
import { PrescripcionRequest, PrescripcionResponse, DetallePrescripcionRequest } from '../../models/prescripcion.model';
import { MascotaService } from '../../services/mascota.service';
import { MascotaResponse } from '../../models/mascota.model';
import { InsumoService } from '../../services/insumo.service';
import { Insumo, StockInsumoResponse } from '../../models/insumo.model';

@Component({
  selector: 'app-doctor-historias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-historias.component.html'
})
export class DoctorHistoriasComponent {
  private consultaService = inject(ConsultaService);
  private prescripcionService = inject(PrescripcionService);
  private mascotaService = inject(MascotaService);
  private authService = inject(AuthService);
  private insumoService = inject(InsumoService);

  user = this.authService.getCurrentUser();
  insumosDisponibles: StockInsumoResponse[] = [];
  
  // Búsqueda
  busquedaId: number = 0;
  mascotasDisponibles: MascotaResponse[] = [];
  mascotaActualId: number | null = null;
  consultas: ConsultaResponse[] = [];
  loading = false;
  hasSearched = false;

  // Modal buscador de medicamentos
  isBuscadorMedicamentosOpen = false;
  medicamentoIndexActual: number = -1;
  filtroMedicamento: string = '';

  get medicamentosFiltrados(): StockInsumoResponse[] {
    let meds = this.insumosDisponibles;

    if (this.filtroMedicamento) {
      const term = this.filtroMedicamento.toLowerCase();
      meds = meds.filter(m => m.nombreInsumo.toLowerCase().includes(term));
    }
    return meds;
  }

  abrirBuscadorMedicamento(index: number) {
    this.medicamentoIndexActual = index;
    this.filtroMedicamento = '';
    this.isBuscadorMedicamentosOpen = true;
  }

  cerrarBuscadorMedicamento() {
    this.isBuscadorMedicamentosOpen = false;
    this.medicamentoIndexActual = -1;
  }

  seleccionarMedicamento(med: StockInsumoResponse) {
    if (this.medicamentoIndexActual >= 0 && med.insumoId) {
      this.nuevaReceta.detalles[this.medicamentoIndexActual].insumoId = med.insumoId;
      (this.nuevaReceta.detalles[this.medicamentoIndexActual] as any)['_nombreSeleccionado'] = med.nombreInsumo;
    }
    this.cerrarBuscadorMedicamento();
  }

  ngOnInit() {
    this.mascotaService.obtenerTodas().subscribe({
      next: (res) => this.mascotasDisponibles = res || [],
      error: (err) => console.error('Error al cargar mascotas', err)
    });
    this.insumoService.listarStock().subscribe({
      next: (res) => this.insumosDisponibles = res || [],
      error: (err) => console.error('Error al cargar insumos', err)
    });
  }

  // Modal Nueva Consulta
  isModalOpen = false;
  
  nuevaConsulta: ConsultaRequest = {
    mascotaId: 0,
    veterinarioId: 0,
    motivo: '',
    anamnesis: '',
    examenFisico: '',
    diagnostico: '',
    tratamiento: '',
    peso: 0,
    temperatura: 0,
    frecuenciaCardiaca: 0,
    frecuenciaRespiratoria: 0,
    trc: '',
    notas: ''
  };

  // --- Lógica de Recetas (Prescripciones) ---
  isRecetaModalOpen = false;
  loadingReceta = false;
  consultaSeleccionada: ConsultaResponse | null = null;
  recetaActual: PrescripcionResponse | null = null; // Si ya tiene receta
  
  nuevaReceta: PrescripcionRequest = {
    consultaId: 0,
    observaciones: '',
    detalles: []
  };

  buscarHistorial() {
    if (!this.busquedaId || this.busquedaId <= 0) {
      alert('Por favor seleccione una mascota válida.');
      return;
    }

    const id = this.busquedaId;
    this.mascotaActualId = id;
    this.loading = true;
    this.hasSearched = true;

    this.consultaService.historialPorMascota(id).subscribe({
      next: (res) => {
        this.consultas = res.content || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error buscando historial', err);
        this.consultas = [];
        this.loading = false;
        alert('Ocurrió un error o la mascota no existe.');
      }
    });
  }

  abrirModal() {
    if (!this.mascotaActualId || !this.user?.id) return;
    
    this.nuevaConsulta = {
      mascotaId: this.mascotaActualId,
      veterinarioId: this.user.id,
      motivo: '',
      anamnesis: '',
      examenFisico: '',
      diagnostico: '',
      tratamiento: '',
      peso: 0,
      temperatura: 0,
      frecuenciaCardiaca: 0,
      frecuenciaRespiratoria: 0,
      trc: '',
      notas: ''
    };
    
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  guardarConsulta() {
    if (!this.nuevaConsulta.motivo || !this.nuevaConsulta.diagnostico) {
      alert("Motivo y Diagnóstico son obligatorios.");
      return;
    }

    this.consultaService.registrarConsulta(this.nuevaConsulta).subscribe({
      next: (res) => {
        this.cerrarModal();
        this.buscarHistorial(); // Refrescar historial
      },
      error: (err) => {
        console.error('Error guardando consulta', err);
        alert('Ocurrió un error al registrar la consulta.');
      }
    });
  }

  // --- Métodos de Receta ---

  abrirModalReceta(consulta: ConsultaResponse) {
    this.consultaSeleccionada = consulta;
    this.isRecetaModalOpen = true;
    this.loadingReceta = true;
    this.recetaActual = null;
    
    // Preparar el formulario de nueva receta por defecto
    this.nuevaReceta = {
      consultaId: consulta.id,
      observaciones: '',
      detalles: []
    };
    // Agregar una fila vacía por defecto
    this.agregarMedicamento();

    // Buscar si ya existe una receta para esta consulta
    this.prescripcionService.verPrescripcion(consulta.id).subscribe({
      next: (res) => {
        this.recetaActual = res; // Ya existe, la mostramos en modo Vista
        this.loadingReceta = false;
      },
      error: (err) => {
        // Error 404 significa que no tiene receta, está bien
        this.loadingReceta = false;
      }
    });
  }

  cerrarModalReceta() {
    this.isRecetaModalOpen = false;
    this.consultaSeleccionada = null;
    this.recetaActual = null;
  }

  agregarMedicamento() {
    this.nuevaReceta.detalles.push({
      insumoId: 0,
      dosis: '',
      frecuencia: '',
      duracion: '',
      viaAdministracion: '',
      instrucciones: ''
    });
  }

  eliminarMedicamento(index: number) {
    this.nuevaReceta.detalles.splice(index, 1);
  }

  guardarReceta() {
    if (!this.consultaSeleccionada) return;
    
    // Validar que haya al menos un medicamento y que los campos requeridos estén llenos
    const detallesValidos = this.nuevaReceta.detalles.filter(d => 
      d.insumoId > 0 && d.dosis && d.frecuencia && d.duracion
    );

    if (detallesValidos.length === 0) {
      alert('Debe completar al menos un medicamento con ID, Dosis, Frecuencia y Duración.');
      return;
    }

    // Actualizamos los detalles con solo los válidos
    const payload: PrescripcionRequest = {
      ...this.nuevaReceta,
      detalles: detallesValidos
    };

    this.loadingReceta = true;
    this.prescripcionService.crearPrescripcion(this.consultaSeleccionada.id, payload).subscribe({
      next: (res) => {
        this.recetaActual = res; // Cambia a modo vista
        this.loadingReceta = false;
      },
      error: (err) => {
        console.error('Error creando receta', err);
        alert('Error al guardar la receta. Asegúrate de que el ID del medicamento sea válido.');
        this.loadingReceta = false;
      }
    });
  }
}
