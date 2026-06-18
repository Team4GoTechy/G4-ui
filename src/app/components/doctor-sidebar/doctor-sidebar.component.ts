import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-doctor-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="h-full py-4 pl-4 font-nunito w-72">
      <div class="bg-white h-full rounded-3xl shadow-xl flex flex-col overflow-hidden border border-gray-100">
        
        <!-- Logo -->
        <div class="p-6 border-b border-gray-50 flex items-center justify-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
          </svg>
          <span class="text-2xl font-extrabold text-gray-800 tracking-wide">Clínica</span>
        </div>

        <!-- User Profile -->
        <div class="p-6 flex items-center gap-4 border-b border-gray-50">
          <img [src]="'/assets/images/avatars/' + (user?.avatar || 'chico.jpg')" class="w-14 h-14 rounded-full border-4 border-orange-100 shadow-sm object-cover">
          <div>
            <p class="text-lg font-extrabold text-gray-800">{{ user?.nombre }} {{ user?.apellido }}</p>
            <p class="text-xs text-orange-500 font-bold tracking-wider">MÉDICO VETERINARIO</p>
          </div>
        </div>

        <!-- Nav Links -->
        <div class="p-4 flex-1 overflow-y-auto no-scrollbar">
          <ul class="space-y-2">
            <li class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 px-2">Panel Médico</li>
            
            <li>
              <a routerLink="/doctor" routerLinkActive="bg-orange-50 text-orange-500 font-bold" [routerLinkActiveOptions]="{exact: true}"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <span>Mi Agenda</span>
              </a>
            </li>
            
            <li class="text-xs text-gray-400 font-bold uppercase tracking-wider mt-6 mb-2 px-2">Salud Animal</li>
            <li>
              <a routerLink="/doctor/historias" routerLinkActive="bg-orange-50 text-orange-500 font-bold"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <span>Historias Clínicas</span>
              </a>
            </li>
            <li>
              <a routerLink="/doctor/vacunacion" routerLinkActive="bg-orange-50 text-orange-500 font-bold"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                <span>Vacunación</span>
              </a>
            </li>
            
            <li class="text-xs text-gray-400 font-bold uppercase tracking-wider mt-6 mb-2 px-2">Farmacia</li>
            <li>
              <a routerLink="/doctor/inventario" routerLinkActive="bg-orange-50 text-orange-500 font-bold"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                <span>Inventario Médico</span>
              </a>
            </li>
            <li>
              <a routerLink="/doctor/solicitudes" routerLinkActive="bg-orange-50 text-orange-500 font-bold"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                <span>Solicitar Insumo</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Logout -->
        <div class="p-4 border-t border-gray-50">
          <button (click)="logout()" class="w-full flex items-center px-4 py-3 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-colors justify-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>

      </div>
    </div>
  `
})
export class DoctorSidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  user = this.authService.getCurrentUser();

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
