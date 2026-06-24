import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private notificacionService = inject(NotificacionService);
  private router = inject(Router);

  user$ = this.authService.currentUser$;
  isCollapsed = false;
  unreadCount = 0;
  private notifSub?: Subscription;

  // Lógica del Perfil
  isPerfilModalOpen = false;
  avataresDisponibles = ['/usuario/usuario1.jpg', '/usuario/usuario2.jpg', '/usuario/usuario3.jpg'];
  avatarSeleccionado = '';

  currentUser: any = null;
  nombrePerfil = '';
  apellidoPerfil = '';
  celularPerfil = '';
  direccionPerfil = '';

  ngOnInit() {
    // Escuchar el contador reactivo de notificaciones
    this.notifSub = this.notificacionService.unreadCount$.subscribe({
      next: (count) => this.unreadCount = count
    });

    // Cargar cantidad inicial
    this.notificacionService.actualizarCantidadSinLeer();
  }

  ngOnDestroy() {
    if (this.notifSub) {
      this.notifSub.unsubscribe();
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  getAvatarUrl(avatar?: string): string {
    if (!avatar) {
      return '/usuario/usuario1.jpg';
    }
    if (avatar.startsWith('http') || avatar.startsWith('/')) {
      return avatar;
    }
    return `/assets/images/avatars/${avatar}`;
  }

  abrirModalPerfil(user: any) {
    this.currentUser = user;
    this.nombrePerfil = user.nombre || '';
    this.apellidoPerfil = user.apellido || '';
    this.celularPerfil = user.celular || '';
    this.direccionPerfil = user.direccion || '';
    this.avatarSeleccionado = user.avatar || '/usuario/usuario1.jpg';
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
      next: () => {
        this.cerrarModalPerfil();
      },
      error: (err) => {
        console.error('Error al actualizar el perfil del cliente', err);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
