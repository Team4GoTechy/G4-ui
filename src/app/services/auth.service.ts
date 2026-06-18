import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Simulamos al usuario mockeado en memoria
  private mockUser: User = {
    id: 1,
    nombre: 'Mauricio',
    apellido: 'Heredia',
    direccion: 'Barrio Republica Argentina',
    celular: '3705022130',
    email: 'usuario@gmail.com',
    password: '12345678',
    tipoMascota: 'Gato',
    nombreMascota: 'Dandi'
  };

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  login(email: string, password: string): Observable<boolean> {
    // Simulamos un delay de red de 1 segundo
    return new Observable(subscriber => {
      setTimeout(() => {
        if (email === this.mockUser.email && password === this.mockUser.password) {
          this.currentUserSubject.next(this.mockUser);
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
        this.mockUser = { ...user, id: 2 }; 
        this.currentUserSubject.next(this.mockUser);
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
