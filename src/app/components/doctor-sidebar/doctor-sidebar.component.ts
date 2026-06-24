import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-doctor-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <div class="relative h-full py-4 pl-4 font-nunito transition-all duration-300 ease-in-out shrink-0" 
         [ngClass]="isCollapsed ? 'w-24' : 'w-72'">
      <div class="bg-white h-full rounded-3xl shadow-xl flex flex-col overflow-hidden border border-gray-100">
        
        <!-- Botón para esconder/mostrar -->
        <button (click)="toggleSidebar()" 
                class="absolute top-8 -right-3 bg-white border border-gray-200 text-gray-500 hover:text-orange-500 rounded-full p-1.5 shadow-md z-10 transition-colors">
          <svg *ngIf="!isCollapsed" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          <svg *ngIf="isCollapsed" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>

        <!-- Logo -->
        <div class="p-6 border-b border-gray-50 flex items-center justify-center" [ngClass]="isCollapsed ? 'gap-0' : 'gap-3'">
          <img src="/assets/images/logo/logo-pethouse.png" class="h-8 w-8 shrink-0 object-contain" alt="Pethouse Logo">
          <span *ngIf="!isCollapsed" class="text-2xl font-extrabold text-gray-800 tracking-wide">Clínica</span>
        </div>

        <!-- User Profile -->
        <div class="p-6 border-b border-gray-50">
          <div class="flex items-center" [ngClass]="isCollapsed ? 'flex-col justify-center gap-2' : 'gap-4'">
            
            <!-- Avatar interactivo con hover -->
            <div class="relative cursor-pointer group shrink-0" (click)="abrirModalPerfil()" [title]="'Editar Perfil'">
              <img [src]="getAvatarUrl(user?.avatar)" 
                   class="rounded-full border-4 border-orange-100 shadow-sm object-cover transition-all duration-300"
                   [ngClass]="isCollapsed ? 'w-10 h-10' : 'w-14 h-14'">
              
              <!-- Overlay y Lápiz -->
              <div class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
            </div>

            <div *ngIf="!isCollapsed" class="overflow-hidden">
              <p class="text-base font-extrabold text-gray-800 truncate">{{ user?.nombre }} {{ user?.apellido }}</p>
              <p class="text-xs text-orange-500 font-bold tracking-wider uppercase">{{ user?.rol || 'MÉDICO VETERINARIO' }}</p>
            </div>
          </div>
        </div>

        <!-- Nav Links -->
        <div class="p-4 flex-1 overflow-y-auto no-scrollbar">
          <ul class="space-y-2">
            <li *ngIf="!isCollapsed" class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 px-2">Panel Médico</li>
            
            <li>
              <a routerLink="/doctor" routerLinkActive="bg-emerald-50 text-emerald-600 font-bold" [routerLinkActiveOptions]="{exact: true}"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors"
                 [title]="isCollapsed ? 'Inicio' : ''">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" [ngClass]="!isCollapsed ? 'mr-3' : 'mx-auto'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                <span *ngIf="!isCollapsed">Inicio</span>
              </a>
            </li>

            <li>
              <a routerLink="/doctor/agenda" routerLinkActive="bg-emerald-50 text-emerald-600 font-bold" [routerLinkActiveOptions]="{exact: true}"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors"
                 [title]="isCollapsed ? 'Mi Agenda' : ''">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" [ngClass]="!isCollapsed ? 'mr-3' : 'mx-auto'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <span *ngIf="!isCollapsed">Mi Agenda</span>
              </a>
            </li>
            
            <li *ngIf="!isCollapsed" class="text-xs text-gray-400 font-bold uppercase tracking-wider mt-6 mb-2 px-2">Salud Animal</li>
            <li>
              <a routerLink="/doctor/historias" routerLinkActive="bg-orange-50 text-orange-500 font-bold"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors"
                 [title]="isCollapsed ? 'Historias Clínicas' : ''">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" [ngClass]="!isCollapsed ? 'mr-3' : 'mx-auto'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <span *ngIf="!isCollapsed">Historias Clínicas</span>
              </a>
            </li>
            <li>
              <a routerLink="/doctor/internaciones" routerLinkActive="bg-emerald-50 text-emerald-600 font-bold" [routerLinkActiveOptions]="{exact: true}"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors"
                 [title]="isCollapsed ? 'Internaciones' : ''">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" [ngClass]="!isCollapsed ? 'mr-3' : 'mx-auto'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span *ngIf="!isCollapsed">Internaciones</span>
              </a>
            </li>
            
            <li *ngIf="!isCollapsed" class="text-xs text-gray-400 font-bold uppercase tracking-wider mt-6 mb-2 px-2">Farmacia</li>
            <li>
              <a routerLink="/doctor/inventario" routerLinkActive="bg-orange-50 text-orange-500 font-bold"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors"
                 [title]="isCollapsed ? 'Inventario Médico' : ''">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" [ngClass]="!isCollapsed ? 'mr-3' : 'mx-auto'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                <span *ngIf="!isCollapsed">Inventario Médico</span>
              </a>
            </li>
            <li>
              <a routerLink="/doctor/solicitudes" routerLinkActive="bg-orange-50 text-orange-500 font-bold"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors"
                 [title]="isCollapsed ? 'Solicitar Insumo' : ''">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" [ngClass]="!isCollapsed ? 'mr-3' : 'mx-auto'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                <span *ngIf="!isCollapsed">Solicitar Insumo</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Logout -->
        <div class="p-4 border-t border-gray-50">
          <button (click)="logout()" class="w-full flex items-center px-4 py-3 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-colors" [ngClass]="isCollapsed ? 'justify-center' : 'justify-start'" [title]="isCollapsed ? 'Cerrar Sesión' : ''">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" [ngClass]="!isCollapsed ? 'mr-3' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            <span *ngIf="!isCollapsed">Cerrar Sesión</span>
          </button>
        </div>

      </div>
    </div>

    <!-- Modal de Perfil -->
    <div *ngIf="isPerfilModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" (click)="cerrarModalPerfil()"></div>
      <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in">
        
        <!-- Header con gradiente -->
        <div class="bg-gradient-to-r from-orange-400 to-orange-500 h-24 relative">
          <button (click)="cerrarModalPerfil()" class="absolute top-4 right-4 text-white/80 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Foto Principal -->
        <div class="flex justify-center -mt-12 relative z-10 px-6">
          <img [src]="getAvatarUrl(avatarSeleccionado)" 
               class="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover bg-white">
        </div>

        <div class="p-6 text-center">
          <h3 class="text-2xl font-extrabold text-gray-800">{{ user?.nombre }} {{ user?.apellido }}</h3>
          <p class="text-sm font-bold text-orange-500 uppercase tracking-wider mb-4">{{ user?.rol }}</p>
          
          <div class="space-y-3 mb-6 text-left">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nombre</label>
              <input type="text" [(ngModel)]="nombrePerfil" name="nombrePerfil" 
                     class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Apellido</label>
              <input type="text" [(ngModel)]="apellidoPerfil" name="apellidoPerfil" 
                     class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Celular</label>
              <input type="text" [(ngModel)]="celularPerfil" name="celularPerfil" 
                     class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Dirección</label>
              <input type="text" [(ngModel)]="direccionPerfil" name="direccionPerfil" 
                     class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
            </div>
          </div>

          <!-- Selector de Avatar Visual -->
          <div class="mb-6">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-left">Elegir Avatar</p>
            <div class="flex justify-center gap-4">
              <div *ngFor="let avatar of avataresDisponibles" 
                   (click)="seleccionarAvatar(avatar)"
                   class="cursor-pointer rounded-full p-1 border-2 transition-all"
                   [ngClass]="avatarSeleccionado === avatar ? 'border-orange-500 scale-110 shadow-md' : 'border-transparent hover:border-gray-200'">
                <img [src]="getAvatarUrl(avatar)" class="w-12 h-12 rounded-full object-cover">
              </div>
            </div>
          </div>

          <button (click)="guardarPerfil()" class="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-orange-200 transition-transform hover:-translate-y-0.5 active:translate-y-0">
            Guardar Cambios
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
  isCollapsed = false;

  // Lógica del Perfil
  isPerfilModalOpen = false;
  avataresDisponibles = ['/veterinario/veterinario1.png', '/veterinario/veterinario2.png', '/veterinario/veterinario3.png'];
  avatarSeleccionado = '';

  // Campos del formulario
  nombrePerfil = '';
  apellidoPerfil = '';
  celularPerfil = '';
  direccionPerfil = '';

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getAvatarUrl(avatar: string | undefined): string {
    if (!avatar) {
      return '/veterinario/veterinario1.png';
    }
    if (avatar.startsWith('/') || avatar.startsWith('http')) {
      return avatar;
    }
    return '/assets/images/avatars/' + avatar;
  }

  abrirModalPerfil() {
    if (this.user) {
      this.nombrePerfil = this.user.nombre || '';
      this.apellidoPerfil = this.user.apellido || '';
      this.celularPerfil = this.user.celular || '';
      this.direccionPerfil = this.user.direccion || '';
      this.avatarSeleccionado = this.user.avatar || '/veterinario/veterinario1.png';
    }
    this.isPerfilModalOpen = true;
  }

  cerrarModalPerfil() {
    this.isPerfilModalOpen = false;
  }

  seleccionarAvatar(avatar: string) {
    this.avatarSeleccionado = avatar;
  }

  guardarPerfil() {
    const payload = {
      nombre: this.nombrePerfil,
      apellido: this.apellidoPerfil,
      celular: this.celularPerfil,
      direccion: this.direccionPerfil,
      avatar: this.avatarSeleccionado
    };

    this.authService.actualizarPerfil(payload).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.cerrarModalPerfil();
      },
      error: (err) => {
        console.error('Error al actualizar el perfil', err);
      }
    });
  }
}
