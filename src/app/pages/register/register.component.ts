import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  avatars = ['chica.jpg', 'chico.jpg', 'señor.jpg'];

  ngOnInit() {
    this.registerForm = this.fb.group({
      // Datos Personales
      avatar: ['chico.jpg', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18)]],
      direccion: ['', Validators.required],
      celular: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      
      // Datos de Mascota
      cantidadMascotas: [1, [Validators.required, Validators.min(1)]],
      mascotas: this.fb.array([this.createMascotaGroup()]),
      
      // Lógica de Familia
      familyName: ['']
    });

    // Detectar cambios en la cantidad de mascotas
    this.registerForm.get('cantidadMascotas')?.valueChanges.subscribe(val => {
      this.updateMascotasArray(val);
    });

    // Detectar cambios en el array de mascotas para auto-nombrar la familia
    this.mascotasArray.valueChanges.subscribe(() => {
      this.evaluateFamilyName();
    });
  }

  get mascotasArray(): FormArray {
    return this.registerForm.get('mascotas') as FormArray;
  }

  createMascotaGroup(): FormGroup {
    return this.fb.group({
      tipo: ['', Validators.required],
      nombre: ['', Validators.required],
      sexo: ['Macho', Validators.required]
    });
  }

  updateMascotasArray(cantidad: number) {
    if (!cantidad || cantidad < 1) return;
    const currentLength = this.mascotasArray.length;
    
    if (cantidad > currentLength) {
      for (let i = currentLength; i < cantidad; i++) {
        this.mascotasArray.push(this.createMascotaGroup());
      }
    } else if (cantidad < currentLength) {
      for (let i = currentLength - 1; i >= cantidad; i--) {
        this.mascotasArray.removeAt(i);
      }
    }
    this.evaluateFamilyName();
  }

  evaluateFamilyName() {
    const cantidad = this.registerForm.get('cantidadMascotas')?.value || 0;
    if (cantidad > 2) {
      const mascotas = this.mascotasArray.value;
      const tipos = mascotas.map((m: any) => m.tipo).filter((t: string) => t !== '');
      
      if (tipos.length === cantidad) {
        const todosPerros = tipos.every((t: string) => t === 'Perro');
        const todosGatos = tipos.every((t: string) => t === 'Gato');

        let familyName = 'Familia Mixta';
        if (todosPerros) familyName = 'Familia Perruna';
        else if (todosGatos) familyName = 'Familia Gatuna';

        // Solo sobreescribe si el usuario no ha puesto un nombre personalizado, 
        // o si queremos forzar el auto-nombre. Por ahora auto-nombramos si cambió la mezcla.
        this.registerForm.patchValue({ familyName }, { emitEvent: false });
      }
    } else {
      this.registerForm.patchValue({ familyName: '' }, { emitEvent: false });
    }
  }

  setAvatar(avatar: string) {
    this.registerForm.patchValue({ avatar });
  }

  setMascotaTipo(index: number, tipo: string) {
    this.mascotasArray.at(index).patchValue({ tipo });
  }

  nextStep() {
    // Validar manualmente campos del paso 1
    const p1Controls = ['nombre', 'apellido', 'edad', 'direccion', 'celular', 'email', 'password'];
    let isValid = true;
    for (let control of p1Controls) {
      if (this.registerForm.get(control)?.invalid) {
        this.registerForm.get(control)?.markAsTouched();
        isValid = false;
      }
    }

    if (isValid) {
      this.currentStep = 2;
    }
  }

  prevStep() {
    this.currentStep = 1;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      // Simulamos que el registro fue exitoso
      setTimeout(() => {
        // En una app real, aquí llamaríamos a un servicio para crear el usuario con su familia de mascotas.
        // Para mock, simplemente iniciamos sesión con el email que puso
        const email = this.registerForm.value.email;
        this.authService.login(email, 'mockPassword123');
        this.router.navigate(['/cliente']);
      }, 1500);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
