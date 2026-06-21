import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
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
      return '/assets/images/avatars/chico.jpg';
    }
    if (avatar.startsWith('http') || avatar.startsWith('/')) {
      return avatar;
    }
    return `/assets/images/avatars/${avatar}`;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
