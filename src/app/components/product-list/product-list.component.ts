import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

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
    // Datos simulados (Mock) para ver la UI
    this.products = [
      { id: 1, nombre: 'Alimento Royal Canin Gatos', codigo: 'CAT-01', descripcion: 'Alimento premium para gatos adultos', precio: 25000, stock: 15, categoria: 'Gato' },
      { id: 2, nombre: 'Rascador Torre de 3 Pisos', codigo: 'CAT-02', descripcion: 'Rascador con cucha y juguetes colgantes', precio: 45000, stock: 5, categoria: 'Gato' },
      { id: 3, nombre: 'Piedras Sanitarias Aglomerantes', codigo: 'CAT-03', descripcion: 'Bolsa de 10kg sin olor', precio: 12000, stock: 30, categoria: 'Gato' },
      { id: 4, nombre: 'Alimento ProPlan Perros Raza Mediana', codigo: 'DOG-01', descripcion: 'Alimento super premium 15kg', precio: 32000, stock: 10, categoria: 'Perro' },
      { id: 5, nombre: 'Correa Extensible 5m', codigo: 'DOG-02', descripcion: 'Correa resistente hasta 25kg', precio: 15000, stock: 20, categoria: 'Perro' },
      { id: 6, nombre: 'Cama Acolchada Extra Grande', codigo: 'DOG-03', descripcion: 'Cama lavable para perros grandes', precio: 28000, stock: 8, categoria: 'Perro' }
    ];
  }

  // Lógica del Carrito
  addToCart(product: Product) {
    if (product.stock > 0) {
      const item = this.cart.find(i => i.product.id === product.id);
      if (item) {
        if (item.quantity < product.stock) {
          item.quantity++;
        }
      } else {
        this.cart.push({ product, quantity: 1 });
      }
    }
  }

  removeFromCart(productId: number) {
    this.cart = this.cart.filter(i => i.product.id !== productId);
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

  processPayment(method: 'efectivo' | 'transferencia') {
    // Simular el pago
    alert(`Pago procesado con ${method}. Total: $${this.cartTotal}`);
    this.cart = [];
    this.isCheckoutModalOpen = false;
  }
}
