import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-turnos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-turnos.component.html'
})
export class ClientTurnosComponent {
  doctores = [
    { id: 1, nombre: 'Dr. Ramiro López', especialidad: 'Clínica Médica' },
    { id: 2, nombre: 'Dra. Sofía Martínez', especialidad: 'Cirugía General' },
    { id: 3, nombre: 'Dr. Alejandro Silva', especialidad: 'Cardiología Veterinaria' }
  ];

  doctorSeleccionado: number | null = null;
  diaSeleccionado: number | null = null;
  turnoConfirmado = false;

  // Días simulados de la semana actual
  dias = [
    { num: 18, nombre: 'Lun', disponible: true },
    { num: 19, nombre: 'Mar', disponible: false },
    { num: 20, nombre: 'Mié', disponible: true },
    { num: 21, nombre: 'Jue', disponible: true },
    { num: 22, nombre: 'Vie', disponible: false },
  ];

  seleccionarDoctor(id: number) {
    this.doctorSeleccionado = id;
    this.turnoConfirmado = false;
    this.diaSeleccionado = null;
  }

  seleccionarDia(num: number) {
    this.diaSeleccionado = num;
  }

  confirmarTurno() {
    this.turnoConfirmado = true;
  }
}
