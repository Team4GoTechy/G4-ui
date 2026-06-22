import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  user$ = this.authService.currentUser$;

  products: Product[] = [];
  categories: any[] = [];
  selectedCategory: number | null = null;
  isLoading = false;
  
  // Carrito de Compras
  cart: { product: Product, quantity: number }[] = [];
  isCartOpen = false;
  isCheckoutModalOpen = false;
  productForm: FormGroup;

  constructor() {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      codigo: ['', Validators.required],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: () => {
        toast.error('Error al cargar categorías');
      }
    });
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts(this.selectedCategory || undefined).subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: () => {
        toast.error('Error al cargar productos');
        this.isLoading = false;
      }
    });
  }

  filterByCategory(catId: number | null) {
    this.selectedCategory = catId;
    this.loadProducts();
  }

  // Lógica del Carrito
  addToCart(product: Product, quantity: number = 1) {
    if (product.stock > 0) {
      const item = this.cart.find(i => i.product.id === product.id);
      const currentQty = item ? item.quantity : 0;
      if (currentQty + quantity <= product.stock) {
        if (item) {
          item.quantity += quantity;
          toast.success(`Se añadieron ${quantity} unidades más de ${product.nombre}`);
        } else {
          this.cart.push({ product, quantity });
          toast.success(`${quantity} x ${product.nombre} agregado al carrito`);
        }
      } else {
        toast.warning(`No hay suficiente stock disponible. Stock: ${product.stock}`);
      }
    }
  }

  removeFromCart(productId: number) {
    this.cart = this.cart.filter(i => i.product.id !== productId);
    toast.info('Producto removido del carrito');
  }

  get cartTotal() {
    return this.cart.reduce((total, item) => total + (item.product.precio * item.quantity), 0);
  }

  get cartItemsCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }

  openCheckout() {
    this.isCartOpen = false;
    this.isCheckoutModalOpen = true;
  }

  closeCheckout() {
    this.isCheckoutModalOpen = false;
  }

  processPayment(method: 'EFECTIVO' | 'TRANSFERENCIA') {
    if (this.cart.length === 0) return;

    this.isLoading = true;
    
    // Preparar el cuerpo de la compra según DTO backend CompraRequest
    const purchaseRequest = {
      metodoPago: method,
      productos: this.cart.map(item => ({
        productoId: item.product.id,
        cantidad: item.quantity
      }))
    };

    this.productService.createPurchase(purchaseRequest).subscribe({
      next: () => {
        this.isLoading = false;
        toast.success('¡Compra realizada con éxito!', {
          description: `Tu pedido ha sido registrado con método de pago: ${method}`
        });
        this.cart = [];
        this.isCheckoutModalOpen = false;
        this.loadProducts(); // Recargar productos para actualizar stock
      },
      error: (err) => {
        this.isLoading = false;
        toast.error('Error al procesar la compra', {
          description: err.error?.message || 'Hubo un error de comunicación con el servidor.'
        });
      }
    });
  }

  isRecommended(product: Product, user: any): boolean {
    if (!user || !user.tipoMascota) return false;
    const petType = user.tipoMascota.toLowerCase();
    const prodCat = (product.categoria || '').toLowerCase();
    const prodName = (product.nombre || '').toLowerCase();
    const prodDesc = (product.descripcion || '').toLowerCase();

    return prodCat.includes(petType) || prodName.includes(petType) || prodDesc.includes(petType);
  }
}
