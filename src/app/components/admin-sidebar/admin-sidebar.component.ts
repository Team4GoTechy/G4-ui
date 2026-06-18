import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="h-full py-4 pl-4 font-nunito w-72">
      <div class="bg-white h-full rounded-3xl shadow-xl flex flex-col overflow-hidden border border-gray-100">
        
        <!-- Logo -->
        <div class="p-6 border-b border-gray-50 flex items-center justify-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-sky-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd" />
          </svg>
          <span class="text-2xl font-extrabold text-gray-800 tracking-wide">Gerencia</span>
        </div>

        <!-- User Profile -->
        <div class="p-6 flex items-center gap-4 border-b border-gray-50">
          <img [src]="'/assets/images/avatars/' + (user?.avatar || 'señor.jpg')" class="w-14 h-14 rounded-full border-4 border-sky-100 shadow-sm object-cover">
          <div>
            <p class="text-lg font-extrabold text-gray-800">{{ user?.nombre }} {{ user?.apellido }}</p>
            <p class="text-xs text-sky-500 font-bold tracking-wider">ADMINISTRADOR</p>
          </div>
        </div>

        <!-- Nav Links -->
        <div class="p-4 flex-1 overflow-y-auto no-scrollbar">
          <ul class="space-y-2">
            <li class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 px-2">Panel Principal</li>
            
            <li>
              <a routerLink="/admin" routerLinkActive="bg-sky-50 text-sky-500 font-bold" [routerLinkActiveOptions]="{exact: true}"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                <span>Dashboard</span>
              </a>
            </li>
            
            <li class="text-xs text-gray-400 font-bold uppercase tracking-wider mt-6 mb-2 px-2">Gestión de Tienda</li>
            <li>
              <a routerLink="/admin/productos" routerLinkActive="bg-sky-50 text-sky-500 font-bold"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                <span>Productos</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/servicios" routerLinkActive="bg-sky-50 text-sky-500 font-bold"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/></svg>
                <span>Servicios</span>
              </a>
            </li>
            
            <li class="text-xs text-gray-400 font-bold uppercase tracking-wider mt-6 mb-2 px-2">Gestión Interna</li>
            <li>
              <a routerLink="/admin/veterinarios" routerLinkActive="bg-sky-50 text-sky-500 font-bold"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                <span>Veterinarios</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/clientes" routerLinkActive="bg-sky-50 text-sky-500 font-bold"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                <span>Clientes y Mascotas</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/solicitudes" routerLinkActive="bg-sky-50 text-sky-500 font-bold"
                 class="flex items-center justify-between px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
                  <span>Solicitudes</span>
                </div>
                <span class="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">3</span>
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
export class AdminSidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  user = this.authService.getCurrentUser();

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
