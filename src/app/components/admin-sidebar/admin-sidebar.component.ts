import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <div class="relative h-full py-4 pl-4 font-nunito transition-all duration-300 ease-in-out shrink-0" 
         [ngClass]="isCollapsed ? 'w-24' : 'w-72'">
      <div class="bg-white h-full rounded-3xl shadow-xl flex flex-col overflow-hidden border border-gray-100">
        
        <!-- Botón para esconder/mostrar -->
        <button (click)="toggleSidebar()" 
                class="absolute top-8 -right-3 bg-white border border-gray-200 text-gray-500 hover:text-sky-500 rounded-full p-1.5 shadow-md z-10 transition-colors">
          <svg *ngIf="!isCollapsed" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          <svg *ngIf="isCollapsed" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>

        <!-- Logo -->
        <div class="p-6 border-b border-gray-50 flex items-center justify-center" [ngClass]="isCollapsed ? 'gap-0' : 'gap-3'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-sky-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd" />
          </svg>
          <span *ngIf="!isCollapsed" class="text-2xl font-extrabold text-gray-800 tracking-wide">Gerencia</span>
        </div>

        <!-- User Profile -->
        <div class="p-6 border-b border-gray-50">
          <div class="flex items-center" [ngClass]="isCollapsed ? 'flex-col justify-center gap-2' : 'gap-4'">
            
            <!-- Avatar interactivo con hover -->
            <div class="relative cursor-pointer group shrink-0" (click)="abrirModalPerfil()" [title]="'Editar Perfil'">
              <img [src]="getAvatarUrl(user?.avatar)" 
                   class="rounded-full border-4 border-sky-100 shadow-sm object-cover transition-all duration-300"
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
              <p class="text-xs text-sky-500 font-bold tracking-wider">ADMINISTRADOR</p>
            </div>
          </div>
        </div>

        <!-- Nav Links -->
        <div class="p-4 flex-1 overflow-y-auto no-scrollbar">
          <ul class="space-y-2">
            <li *ngIf="!isCollapsed" class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 px-2">Panel Principal</li>
            
            <li>
              <a routerLink="/admin" routerLinkActive="bg-sky-50 text-sky-500 font-bold" [routerLinkActiveOptions]="{exact: true}"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors"
                 [title]="isCollapsed ? 'Dashboard' : ''">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" [ngClass]="!isCollapsed ? 'mr-3' : 'mx-auto'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                <span *ngIf="!isCollapsed">Dashboard</span>
              </a>
            </li>
            
            <li *ngIf="!isCollapsed" class="text-xs text-gray-400 font-bold uppercase tracking-wider mt-6 mb-2 px-2">Gestión de Tienda</li>
            <li>
              <a routerLink="/admin/productos" routerLinkActive="bg-sky-50 text-sky-500 font-bold"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors"
                 [title]="isCollapsed ? 'Productos' : ''">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" [ngClass]="!isCollapsed ? 'mr-3' : 'mx-auto'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                <span *ngIf="!isCollapsed">Productos</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/servicios" routerLinkActive="bg-sky-50 text-sky-500 font-bold"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors"
                 [title]="isCollapsed ? 'Servicios' : ''">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" [ngClass]="!isCollapsed ? 'mr-3' : 'mx-auto'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/></svg>
                <span *ngIf="!isCollapsed">Servicios</span>
              </a>
            </li>
            
            <li *ngIf="!isCollapsed" class="text-xs text-gray-400 font-bold uppercase tracking-wider mt-6 mb-2 px-2">Gestión Interna</li>
            <li>
              <a routerLink="/admin/veterinarios" routerLinkActive="bg-sky-50 text-sky-500 font-bold"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors"
                 [title]="isCollapsed ? 'Veterinarios' : ''">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" [ngClass]="!isCollapsed ? 'mr-3' : 'mx-auto'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                <span *ngIf="!isCollapsed">Veterinarios</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/insumos" routerLinkActive="bg-sky-50 text-sky-500 font-bold"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors"
                 [title]="isCollapsed ? 'Gestión de Insumos' : ''">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" [ngClass]="!isCollapsed ? 'mr-3' : 'mx-auto'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                <span *ngIf="!isCollapsed">Gestión de Insumos</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/proveedores" routerLinkActive="bg-sky-50 text-sky-500 font-bold"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors"
                 [title]="isCollapsed ? 'Proveedores' : ''">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" [ngClass]="!isCollapsed ? 'mr-3' : 'mx-auto'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <span *ngIf="!isCollapsed">Proveedores</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/solicitudes" routerLinkActive="bg-sky-50 text-sky-500 font-bold"
                 class="flex items-center px-4 py-3 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors justify-between"
                 [title]="isCollapsed ? 'Solicitudes (3)' : ''">
                <div class="flex items-center min-w-0" [ngClass]="isCollapsed ? 'w-full justify-center' : ''">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" [ngClass]="!isCollapsed ? 'mr-3' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
                  <span *ngIf="!isCollapsed" class="truncate">Solicitudes</span>
                </div>
                <span *ngIf="!isCollapsed" class="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm shrink-0">3</span>
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
        <div class="bg-gradient-to-r from-sky-400 to-sky-500 h-24 relative">
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
          <p class="text-sm font-bold text-sky-500 uppercase tracking-wider mb-4">{{ user?.rol }}</p>
          
          <div class="space-y-3 mb-6 text-left">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nombre</label>
              <input type="text" [(ngModel)]="nombrePerfil" name="nombrePerfil" 
                     class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all">
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Apellido</label>
              <input type="text" [(ngModel)]="apellidoPerfil" name="apellidoPerfil" 
                     class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all">
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Celular</label>
              <input type="text" [(ngModel)]="celularPerfil" name="celularPerfil" 
                     class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all">
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Dirección</label>
              <input type="text" [(ngModel)]="direccionPerfil" name="direccionPerfil" 
                     class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all">
            </div>
          </div>

          <!-- Selector de Avatar Visual -->
          <div class="mb-6">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-left">Elegir Avatar</p>
            <div class="flex justify-center gap-4">
              <div *ngFor="let avatar of avataresDisponibles" 
                   (click)="seleccionarAvatar(avatar)"
                   class="cursor-pointer rounded-full p-1 border-2 transition-all"
                   [ngClass]="avatarSeleccionado === avatar ? 'border-sky-500 scale-110 shadow-md' : 'border-transparent hover:border-gray-200'">
                <img [src]="getAvatarUrl(avatar)" class="w-12 h-12 rounded-full object-cover">
              </div>
            </div>
          </div>

          <button (click)="guardarPerfil()" class="w-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-sky-200 transition-transform hover:-translate-y-0.5 active:translate-y-0">
            Guardar Cambios
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
  isCollapsed = false;

  // Lógica del Perfil
  isPerfilModalOpen = false;
  avataresDisponibles = ['/admin/admin1.png', '/admin/admin2.png', '/admin/admin3.png'];
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
      return '/admin/admin1.png';
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
      this.avatarSeleccionado = this.user.avatar || '/admin/admin1.png';
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
        console.error('Error al actualizar el perfil del administrador', err);
      }
    });
  }
}
