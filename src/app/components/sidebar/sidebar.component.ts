import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user$ = this.authService.currentUser$;
  isCollapsed = false;

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
