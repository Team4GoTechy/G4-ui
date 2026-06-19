import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      
      this.authService.login({ email, password }).subscribe({
        next: (user) => {
          this.isLoading = false;
          toast.success('¡Bienvenido de vuelta!', {
            description: `Has iniciado sesión correctamente.`
          });
          
          if (user.rol === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else if (user.rol === 'DOCTOR') {
            this.router.navigate(['/doctor']);
          } else {
            this.router.navigate(['/cliente']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          toast.error('Acceso denegado', {
            description: err.error?.message || 'Correo o contraseña incorrectos. Verifica tus credenciales e intenta de nuevo.'
          });
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      toast.warning('Formulario incompleto', {
        description: 'Por favor, llena todos los campos correctamente.'
      });
    }
  }
}
