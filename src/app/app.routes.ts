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
import { AdminLayoutComponent } from './components/layouts/admin-layout/admin-layout.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { DoctorLayoutComponent } from './components/layouts/doctor-layout/doctor-layout.component';
import { DoctorHomeComponent } from './pages/doctor-home/doctor-home.component';
import { AdminProductosComponent } from './pages/admin-productos/admin-productos.component';
import { AdminServiciosComponent } from './pages/admin-servicios/admin-servicios.component';
import { AdminVeterinariosComponent } from './pages/admin-veterinarios/admin-veterinarios.component';
import { AdminInsumosComponent } from './pages/admin-insumos/admin-insumos.component';
import { AdminProveedoresComponent } from './pages/admin-proveedores/admin-proveedores.component';
import { AdminSolicitudesComponent } from './pages/admin-solicitudes/admin-solicitudes.component';
import { DoctorHistoriasComponent } from './pages/doctor-historias/doctor-historias.component';
import { DoctorInternacionesComponent } from './pages/doctor-internaciones/doctor-internaciones.component';
import { DoctorInventarioComponent } from './pages/doctor-inventario/doctor-inventario.component';
import { DoctorSolicitudesComponent } from './pages/doctor-solicitudes/doctor-solicitudes.component';
import { DoctorAgendaComponent } from './pages/doctor-agenda/doctor-agenda.component';

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
      { path: '', component: ClientHomeComponent, pathMatch: 'full' },
      { path: 'productos', component: ProductListComponent },
      { path: 'mascota', component: ClientMascotaComponent },
      { path: 'turnos', component: ClientTurnosComponent },
      { path: 'historial', component: ClientHistorialComponent },
      { path: 'notificaciones', component: ClientNotificacionesComponent }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminHomeComponent, pathMatch: 'full' },
      { path: 'productos', component: AdminProductosComponent },
      { path: 'servicios', component: AdminServiciosComponent },
      { path: 'veterinarios', component: AdminVeterinariosComponent },
      { path: 'insumos', component: AdminInsumosComponent },
      { path: 'proveedores', component: AdminProveedoresComponent },
      { path: 'solicitudes', component: AdminSolicitudesComponent }
    ]
  },
  {
    path: 'doctor',
    component: DoctorLayoutComponent,
    children: [
      { path: '', component: DoctorHomeComponent, pathMatch: 'full' },
      { path: 'agenda', component: DoctorAgendaComponent },
      { path: 'historias', component: DoctorHistoriasComponent },
      { path: 'internaciones', component: DoctorInternacionesComponent },
      { path: 'inventario', component: DoctorInventarioComponent },
      { path: 'solicitudes', component: DoctorSolicitudesComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
