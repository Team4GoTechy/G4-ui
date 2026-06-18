import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe(success => {
        this.isLoading = false;
        
        if (success) {
          const user = this.authService.getCurrentUser();
          if (user?.rol === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else if (user?.rol === 'DOCTOR') {
            this.router.navigate(['/doctor']);
          } else {
            this.router.navigate(['/cliente']);
          }
        } else {
          this.errorMessage = 'Credenciales incorrectas. Para esta prueba usa admin@gmail.com o doctor@gmail.com con clave 12345678';
        }
      });
    }
  }
}
