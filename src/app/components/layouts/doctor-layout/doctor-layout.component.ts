import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DoctorSidebarComponent } from '../../doctor-sidebar/doctor-sidebar.component';

@Component({
  selector: 'app-doctor-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DoctorSidebarComponent],
  template: `
    <div class="flex h-screen bg-slate-50 font-nunito overflow-hidden">
      <app-doctor-sidebar></app-doctor-sidebar>
      <main class="flex-1 overflow-y-auto py-4 pr-4 pl-0">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class DoctorLayoutComponent {}

