import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm!: FormGroup;
  isLoading = false;
  currentStep = 1;
  showPassword = false;
  emailExists = false;
  checkingEmail = false;
  avatars = [
    '/assets/images/avatars/chico.jpg',
    '/assets/images/avatars/chica.jpg',
    '/assets/images/avatars/señor.jpg'
  ];

  ngOnInit() {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(1)]],
      avatar: [this.avatars[0]],
      direccion: ['', Validators.required],
      celular: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      cantidadMascotas: [1, [Validators.required, Validators.min(0)]],
      familyName: [''],
      mascotas: this.fb.array([])
    });

    // Check email uniqueness on value changes
    this.registerForm.get('email')?.valueChanges.subscribe(val => {
      this.emailExists = false;
      if (this.registerForm.get('email')?.valid && val) {
        this.checkingEmail = true;
        this.authService.checkEmail(val).subscribe({
          next: (exists) => {
            this.emailExists = exists;
            this.checkingEmail = false;
            if (exists) {
              this.registerForm.get('email')?.setErrors({ emailTaken: true });
            }
          },
          error: () => {
            this.checkingEmail = false;
          }
        });
      }
    });

    // Inicializar con una mascota por defecto
    this.addMascota();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  get mascotasArray() {
    return this.registerForm.get('mascotas') as FormArray;
  }

  addMascota() {
    this.mascotasArray.push(this.fb.group({
      nombre: ['', Validators.required],
      sexo: ['Macho', Validators.required],
      tipo: ['Perro', Validators.required],
      raza: ['']
    }));
    this.syncCantidadMascotas();
  }

  removeMascota(index: number) {
    if (this.mascotasArray.length > 0) {
      this.mascotasArray.removeAt(index);
      this.syncCantidadMascotas();
    }
  }

  private syncCantidadMascotas() {
    const cantidad = this.mascotasArray.length;
    this.registerForm.get('cantidadMascotas')?.setValue(cantidad);
    this.updateFamilyNameValidation(cantidad);
  }

  private updateFamilyNameValidation(cantidad: number) {
    const familyNameControl = this.registerForm.get('familyName');
    if (cantidad >= 3) {
      familyNameControl?.setValidators([Validators.required]);
    } else {
      familyNameControl?.clearValidators();
    }
    familyNameControl?.updateValueAndValidity();
  }

  selectAvatar(url: string) {
    this.registerForm.patchValue({ avatar: url });
  }

  nextStep() {
    // Validar solo los campos del primer paso (datos personales)
    const step1Fields = ['nombre', 'apellido', 'edad', 'direccion', 'celular', 'email', 'password'];
    let isValid = true;
    
    for (const field of step1Fields) {
      const control = this.registerForm.get(field);
      control?.markAsTouched();
      if (control?.invalid) {
        isValid = false;
      }
    }
    
    if (isValid) {
      this.currentStep = 2;
    } else {
      toast.warning('Campos incompletos', {
        description: 'Por favor completa todos tus datos personales antes de continuar.'
      });
    }
  }

  prevStep() {
    this.currentStep = 1;
  }

  onSubmit() {
    if (this.emailExists) {
      toast.error('Correo duplicado', {
        description: 'El correo electrónico ya se encuentra registrado.'
      });
      return;
    }

    if (this.registerForm.valid) {
      this.isLoading = true;
      
      const registerData = this.registerForm.value;
      
      this.authService.register(registerData).subscribe({
        next: () => {
          this.isLoading = false;
          toast.success('¡Registro Exitoso!', {
            description: 'Tu cuenta y tus mascotas han sido registradas correctamente.'
          });
          this.router.navigate(['/cliente']);
        },
        error: (err) => {
          this.isLoading = false;
          toast.error('Error al registrarse', {
            description: err.error?.message || 'Hubo un error en el registro. Verifica los datos.'
          });
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      toast.warning('Campos incompletos', {
        description: 'Revisa que todos los campos de tus mascotas estén llenos.'
      });
    }
  }
}
