import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private API_URL = 'http://localhost:8080/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const storedUser = this.cookieService.get('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, credentials).pipe(
      map(response => {
        let rol = response.rol || response.role || 'CLIENT';
        const emailLower = response.email?.toLowerCase() || '';
        if (emailLower === 'admin@gmail.com' || emailLower.includes('admin')) {
          rol = 'ADMIN';
        } else if (emailLower === 'doctor@gmail.com' || emailLower.includes('doctor') || emailLower.includes('veterinario')) {
          rol = 'DOCTOR';
        }

        const user: User = {
          id: response.id,
          nombre: response.nombre,
          apellido: response.apellido,
          email: response.email,
          celular: response.celular,
          direccion: response.direccion,
          rol: rol as any,
          avatar: response.avatar,
          nombreMascota: response.nombreMascota,
          tipoMascota: response.tipoMascota,
          cantidadMascotas: response.cantidadMascotas
        };

        // Guardar token y user en cookies por seguridad
        this.cookieService.set('token', response.token, { path: '/', secure: true, sameSite: 'Strict' });
        this.cookieService.set('currentUser', JSON.stringify(user), { path: '/', secure: true, sameSite: 'Strict' });
        
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/register`, userData).pipe(
      map(response => {
        let rol = response.rol || response.role || 'CLIENT';
        const emailLower = response.email?.toLowerCase() || '';
        if (emailLower === 'admin@gmail.com' || emailLower.includes('admin')) {
          rol = 'ADMIN';
        } else if (emailLower === 'doctor@gmail.com' || emailLower.includes('doctor') || emailLower.includes('veterinario')) {
          rol = 'DOCTOR';
        }

        const user: User = {
          id: response.id,
          nombre: response.nombre,
          apellido: response.apellido,
          email: response.email,
          celular: response.celular,
          direccion: response.direccion,
          rol: rol as any,
          avatar: response.avatar,
          nombreMascota: response.nombreMascota,
          tipoMascota: response.tipoMascota,
          cantidadMascotas: response.cantidadMascotas
        };

        this.cookieService.set('token', response.token, { path: '/', secure: true, sameSite: 'Strict' });
        this.cookieService.set('currentUser', JSON.stringify(user), { path: '/', secure: true, sameSite: 'Strict' });
        
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  logout() {
    this.cookieService.delete('token', '/');
    this.cookieService.delete('currentUser', '/');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  listarTodosLosUsuarios(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/usuario/list');
  }

  actualizarUsuarioLocal(user: User) {
    this.cookieService.set('currentUser', JSON.stringify(user), { path: '/', secure: true, sameSite: 'Strict' });
    this.currentUserSubject.next(user);
  }

  checkEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/check-email`, { params: { email } });
  }
}
