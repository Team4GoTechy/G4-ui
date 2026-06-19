import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from '../../admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminSidebarComponent],
  template: `
    <div class="flex h-screen bg-slate-50 font-nunito overflow-hidden">
      <app-admin-sidebar></app-admin-sidebar>
      <main class="flex-1 overflow-y-auto py-4 pr-4 pl-0">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {}

