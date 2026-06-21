import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MascotaService } from '../../services/mascota.service';
import { InternacionService } from '../../services/internacion.service';
import { MascotaResponse } from '../../models/mascota.model';
import { InternacionResponse } from '../../models/internacion.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-client-mascota',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-mascota.component.html',
  styleUrls: ['./client-mascota.component.css']
})
export class ClientMascotaComponent implements OnInit {
  private authService = inject(AuthService);
  private mascotaService = inject(MascotaService);
  private internacionService = inject(InternacionService);

  user$ = this.authService.currentUser$;
  misMascotas: MascotaResponse[] = [];
  mascotaSeleccionada: MascotaResponse | null = null;

  // Signos vitales & consulta
  ultimoMedicamento: string = 'Ninguno';
  saludGeneral: string = 'Estable';
  peso: number = 0;
  temperatura: number = 0;
  frecuenciaCardiaca: number = 0;
  frecuenciaRespiratoria: number = 0;
  trc: string = 'Normal';
  ultimaConsultaFecha: string | null = null;

  // Historial clínico
  historialConsultas: any[] = [];
  isLoadingHistorial = false;

  // Recetas
  recetas: any[] = [];
  isLoadingRecetas = false;
  prescripcionParaImprimir: any | null = null;

  // Internación actual
  internacionActual: InternacionResponse | null = null;

  // Modal Reingreso
  isReingresoModalOpen = false;
  notasClienteReingreso = '';
  isEnviandoReingreso = false;

  // Modal Edición de Mascota
  isEditarModalOpen = false;
  mascotaEdicion: any = {
    nombre: '',
    tipo: 'Perro',
    sexo: 'Macho',
    raza: '',
    fechaNacimiento: '',
    peso: null
  };
  isGuardandoEdicion = false;

  ngOnInit() {
    this.cargarMascotas();
  }

  cargarMascotas() {
    this.mascotaService.obtenerMisMascotas().subscribe({
      next: (res) => {
        this.misMascotas = (res || []).map(m => ({
          ...m,
          especie: m.especie || m.tipo
        }));
        if (this.misMascotas.length > 0) {
          const currentId = this.mascotaSeleccionada?.id;
          const found = this.misMascotas.find(m => m.id === currentId);
          this.seleccionarMascota(found || this.misMascotas[0]);
        }
      },
      error: (err) => console.error('Error al cargar mascotas del cliente', err)
    });
  }

  seleccionarMascota(mascota: MascotaResponse) {
    this.mascotaSeleccionada = mascota;
    this.cargarSignosYConsultas();
    this.cargarRecetas();
    this.cargarEstadoInternacion();
  }

  cargarSignosYConsultas() {
    this.isLoadingHistorial = true;
    this.mascotaService.obtenerHistorialClinico(this.mascotaSeleccionada!.id).subscribe({
      next: (res) => {
        this.historialConsultas = res?.content || [];
        
        // Extraer signos vitales de la consulta más reciente
        if (this.historialConsultas.length > 0) {
          const ultima = this.historialConsultas[0];
          this.peso = ultima.peso || this.mascotaSeleccionada?.peso || 0;
          this.temperatura = ultima.temperatura || 0;
          this.frecuenciaCardiaca = ultima.frecuenciaCardiaca || 0;
          this.frecuenciaRespiratoria = ultima.frecuenciaRespiratoria || 0;
          this.trc = ultima.trc || 'Normal';
          this.ultimoMedicamento = ultima.tratamiento || 'Ninguno';
          this.ultimaConsultaFecha = ultima.fechaCreacion;
          
          // Evaluar salud general
          if (this.temperatura > 39.5 || this.frecuenciaCardiaca > 140) {
            this.saludGeneral = 'Fiebre / Taquicardia';
          } else if (this.temperatura < 37.5) {
            this.saludGeneral = 'Hipotermia';
          } else {
            this.saludGeneral = 'Favorable / Estable';
          }
        } else {
          // Valores por defecto
          this.peso = this.mascotaSeleccionada?.peso || 0;
          this.temperatura = 38.5; // normal promedio perro/gato
          this.frecuenciaCardiaca = 100;
          this.frecuenciaRespiratoria = 24;
          this.trc = 'Normal';
          this.ultimoMedicamento = 'Ninguno';
          this.saludGeneral = 'Estable';
          this.ultimaConsultaFecha = null;
        }
        
        this.isLoadingHistorial = false;
      },
      error: (err) => {
        console.error('Error al cargar historial clínico', err);
        this.isLoadingHistorial = false;
      }
    });
  }

  cargarRecetas() {
    this.isLoadingRecetas = true;
    this.mascotaService.obtenerPrescripciones(this.mascotaSeleccionada!.id).subscribe({
      next: (res) => {
        this.recetas = res || [];
        this.isLoadingRecetas = false;
      },
      error: (err) => {
        console.error('Error al cargar recetas de la mascota', err);
        this.isLoadingRecetas = false;
      }
    });
  }

  cargarEstadoInternacion() {
    this.internacionService.obtenerPorMascota(this.mascotaSeleccionada!.id).subscribe({
      next: (res) => {
        if (res) {
          // Buscar si hay alguna activa o reingreso solicitado
          const activaUrgente = res.find(i => i.estado === 'ACTIVA' || i.estado === 'REINGRESO_SOLICITADO');
          this.internacionActual = activaUrgente || null;
        } else {
          this.internacionActual = null;
        }
      },
      error: (err) => console.error('Error cargando estado de internación', err)
    });
  }

  // --- Imprimir y compartir WhatsApp ---

  imprimirReceta(receta: any) {
    this.prescripcionParaImprimir = receta;
    setTimeout(() => {
      window.print();
      this.prescripcionParaImprimir = null;
    }, 250);
  }

  compartirWhatsApp(receta: any) {
    const user = this.authService.getCurrentUser();
    const celular = user?.celular || '';
    
    // Crear el mensaje de WhatsApp estructurado y premium
    let medsText = '';
    receta.detalles.forEach((d: any, idx: number) => {
      medsText += `${idx + 1}. *${d.insumoNombre}*\n`;
      medsText += `   💊 Dosis: ${d.dosis}\n`;
      medsText += `   ⏰ Frecuencia: ${d.frecuencia}\n`;
      medsText += `   📅 Duración: ${d.duracion}\n`;
      if (d.viaAdministracion) medsText += `   📍 Vía: ${d.viaAdministracion}\n`;
      if (d.instrucciones) medsText += `   📝 Instrucciones: ${d.instrucciones}\n`;
      medsText += '\n';
    });

    const texto = `🐾 *PET HOUSE - RECETA MÉDICA DIGITAL* 🐾\n` +
      `-----------------------------------------\n` +
      `👉 Receta para tu perro: *${this.mascotaSeleccionada?.nombre}*\n` +
      `👨‍⚕️ Veterinario: *${receta.veterinarioNombre}*\n` +
      `📅 Fecha de Emisión: ${receta.fecha}\n\n` +
      `*MEDICAMENTOS:* \n${medsText}` +
      (receta.observaciones ? `*Observaciones del Doctor:*\n${receta.observaciones}\n` : '') +
      `-----------------------------------------\n` +
      `¡Cuida mucho a ${this.mascotaSeleccionada?.nombre}! ❤️`;

    const cleanCelular = celular.replace(/\D/g, ''); // Deja solo números
    const encodedText = encodeURIComponent(texto);
    const url = `https://wa.me/${cleanCelular}?text=${encodedText}`;
    window.open(url, '_blank');
  }

  // --- Modal Reingreso ---

  abrirReingresoModal() {
    this.notasClienteReingreso = '';
    this.isReingresoModalOpen = true;
  }

  cerrarReingresoModal() {
    this.isReingresoModalOpen = false;
  }

  enviarSolicitudReingreso() {
    if (!this.notasClienteReingreso.trim()) {
      toast.error('Por favor, indica qué síntomas notaste en tu mascota.');
      return;
    }

    this.isEnviandoReingreso = true;
    this.internacionService.solicitarReingreso(this.mascotaSeleccionada!.id, this.notasClienteReingreso).subscribe({
      next: () => {
        this.isEnviandoReingreso = false;
        this.cerrarReingresoModal();
        this.cargarEstadoInternacion(); // Recargar estado actual
        toast.success('Solicitud enviada correctamente. El doctor ha sido notificado.');
      },
      error: (err) => {
        console.error('Error solicitando reingreso', err);
        this.isEnviandoReingreso = false;
        toast.error('Ocurrió un error al enviar la solicitud.');
      }
    });
  }

  getPetAvatar(mascota: MascotaResponse | null): string {
    if (!mascota) return '/assets/images/pets/3d_dog.png';
    const tipo = (mascota.especie || mascota.tipo || '').toLowerCase();
    if (tipo.includes('gato') || tipo.includes('cat')) {
      return '/assets/images/pets/3d_cat.png';
    }
    return '/assets/images/pets/3d_dog.png';
  }

  getDoctorAvatar(avatar?: string): string {
    if (!avatar) {
      return '/assets/images/avatars/señor.jpg';
    }
    if (avatar.startsWith('http') || avatar.startsWith('/')) {
      return avatar;
    }
    return `/assets/images/avatars/${avatar}`;
  }

  abrirEditarModal() {
    if (!this.mascotaSeleccionada) return;
    this.mascotaEdicion = {
      nombre: this.mascotaSeleccionada.nombre || '',
      tipo: this.mascotaSeleccionada.tipo || this.mascotaSeleccionada.especie || 'Perro',
      sexo: this.mascotaSeleccionada.sexo || 'Macho',
      raza: this.mascotaSeleccionada.raza || '',
      fechaNacimiento: this.mascotaSeleccionada.fechaNacimiento || '',
      peso: this.mascotaSeleccionada.peso || null
    };
    this.isEditarModalOpen = true;
  }

  cerrarEditarModal() {
    this.isEditarModalOpen = false;
  }

  guardarEdicionMascota() {
    if (!this.mascotaSeleccionada) return;
    if (!this.mascotaEdicion.nombre.trim()) {
      toast.error('El nombre de la mascota es obligatorio.');
      return;
    }
    this.isGuardandoEdicion = true;
    
    const data: MascotaResponse = {
      id: this.mascotaSeleccionada.id,
      nombre: this.mascotaEdicion.nombre,
      sexo: this.mascotaEdicion.sexo,
      tipo: this.mascotaEdicion.tipo,
      especie: this.mascotaEdicion.tipo,
      raza: this.mascotaEdicion.raza,
      fechaNacimiento: this.mascotaEdicion.fechaNacimiento,
      peso: this.mascotaEdicion.peso
    };

    this.mascotaService.actualizarMascota(this.mascotaSeleccionada.id, data).subscribe({
      next: (res) => {
        this.isGuardandoEdicion = false;
        this.isEditarModalOpen = false;
        toast.success('Mascota actualizada correctamente.');
        
        if (this.mascotaSeleccionada) {
          Object.assign(this.mascotaSeleccionada, res);
          this.mascotaSeleccionada.especie = res.especie || res.tipo;
        }
        
        this.cargarMascotas();
      },
      error: (err) => {
        console.error('Error al actualizar mascota', err);
        this.isGuardandoEdicion = false;
        toast.error('Ocurrió un error al actualizar los datos.');
      }
    });
  }
}
