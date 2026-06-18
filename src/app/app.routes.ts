import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardLayoutComponent } from './components/layouts/dashboard-layout/dashboard-layout.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ClientHomeComponent } from './pages/client-home/client-home.component';
import { ClientMascotaComponent } from './pages/client-mascota/client-mascota.component';
import { ClientTurnosComponent } from './pages/client-turnos/client-turnos.component';
import { ClientHistorialComponent } from './pages/client-historial/client-historial.component';
import { ClientNotificacionesComponent } from './pages/client-notificaciones/client-notificaciones.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent 
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  { 
    path: 'cliente', 
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        component: ClientHomeComponent,
        pathMatch: 'full'
      },
      {
        path: 'productos',
        component: ProductListComponent
      },
      {
        path: 'mascota',
        component: ClientMascotaComponent
      },
      {
        path: 'turnos',
        component: ClientTurnosComponent
      },
      {
        path: 'historial',
        component: ClientHistorialComponent
      },
      {
        path: 'notificaciones',
        component: ClientNotificacionesComponent
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
