import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Base de datos de usuarios en memoria
  private mockUsers: User[] = [
    {
      id: 1,
      email: 'maurih46322945@gmail.com',
      password: 'password123',
      nombre: 'Mauricio',
      apellido: 'Heredia',
      tipoMascota: 'Gato',
      cantidadMascotas: 1,
      celular: '3705022130',
      direccion: 'Barrio Republica Argentina',
      rol: 'CLIENT'
    },
    {
      id: 2,
      email: 'admin@gmail.com',
      password: '12345678',
      nombre: 'Jefe',
      apellido: 'Admin',
      avatar: 'señor.jpg',
      celular: '11111111',
      direccion: 'Clínica Principal',
      rol: 'ADMIN',
      tipoMascota: '',
      nombreMascota: ''
    },
    {
      id: 3,
      email: 'doctor@gmail.com',
      password: '12345678',
      nombre: 'Dr. Vet',
      apellido: 'Peludo',
      avatar: 'chico.jpg',
      celular: '22222222',
      direccion: 'Consultorio 1',
      rol: 'DOCTOR',
      tipoMascota: '',
      nombreMascota: ''
    }
  ];

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  login(email: string, password: string): Observable<boolean> {
    return new Observable(subscriber => {
      setTimeout(() => {
        const foundUser = this.mockUsers.find(u => u.email === email && u.password === password);
        if (foundUser) {
          this.currentUserSubject.next(foundUser);
          subscriber.next(true);
        } else {
          subscriber.next(false);
        }
        subscriber.complete();
      }, 1000);
    });
  }

  register(user: User): Observable<boolean> {
    return new Observable(subscriber => {
      setTimeout(() => {
        // En una app real, acá haríamos POST. Por ahora simulamos que se guarda y se autologuea
        const newUser = { ...user, id: this.mockUsers.length + 1, rol: 'CLIENT' as const };
        this.mockUsers.push(newUser);
        this.currentUserSubject.next(newUser);
        subscriber.next(true);
        subscriber.complete();
      }, 1000);
    });
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
