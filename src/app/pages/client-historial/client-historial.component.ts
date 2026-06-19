import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-client-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-historial.component.html'
})
export class ClientHistorialComponent implements OnInit {
  private productService = inject(ProductService);

  compras: any[] = [];
  isLoading = false;

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading = true;
    this.productService.getPurchaseHistory().subscribe({
      next: (data) => {
        this.compras = data;
        this.isLoading = false;
      },
      error: () => {
        toast.error('Error al cargar historial de compras');
        this.isLoading = false;
      }
    });
  }

  getProductNames(compra: any): string {
    if (!compra.productos || compra.productos.length === 0) {
      return 'Sin productos';
    }
    return compra.productos.map((item: any) => `${item.nombre} (x${item.cantidad})`).join(', ');
  }

  formatPago(pago?: string): string {
    if (!pago) return '-';
    return pago.toLowerCase() === 'transferencia' ? 'Transferencia' : 'Efectivo';
  }

  getEstadoClass(estado?: string): string {
    if (!estado) return 'bg-gray-100 text-gray-700';
    const st = estado.toLowerCase();
    if (st.includes('entregado') || st.includes('completado') || st.includes('exitoso')) {
      return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    }
    if (st.includes('cancelado') || st.includes('rechazado')) {
      return 'bg-red-50 text-red-600 border border-red-100';
    }
    return 'bg-yellow-50 text-yellow-600 border border-yellow-100';
  }
}
