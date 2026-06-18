import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { DashboardLayoutComponent } from './components/layouts/dashboard-layout/dashboard-layout.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent 
  },
  {
    path: 'productos',
    component: ProductListComponent
  },
  { 
    path: 'dashboard', 
    component: DashboardLayoutComponent
  },
  { path: '**', redirectTo: '' }
];
