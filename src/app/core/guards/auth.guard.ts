import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();

  if (user && user.rol === 'ADMIN') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const doctorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();

  if (user && user.rol === 'DOCTOR') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const clienteGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();

  if (user && user.rol === 'CLIENT') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();

  if (user) {
    if (user.rol === 'ADMIN') {
      router.navigate(['/admin']);
    } else if (user.rol === 'DOCTOR') {
      router.navigate(['/doctor']);
    } else {
      router.navigate(['/cliente']);
    }
    return false;
  }

  return true;
};
