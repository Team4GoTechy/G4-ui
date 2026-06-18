import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  products: Product[] = [];
  
  // Modal Crear/Editar
  isModalOpen = false;
  isEditMode = false;
  editingProductId: number | null = null;
  productForm: FormGroup;

  // Modal Eliminar
  isDeleteModalOpen = false;
  productToDelete: Product | null = null;

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
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error fetching products', err)
    });
  }

  openModal() {
    this.isEditMode = false;
    this.editingProductId = null;
    this.productForm.reset({ precio: 0, stock: 0 });
    this.isModalOpen = true;
  }

  openEditModal(product: Product) {
    this.isEditMode = true;
    this.editingProductId = product.id!;
    this.productForm.patchValue({
      nombre: product.nombre,
      codigo: product.codigo,
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock
    });
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.editingProductId = null;
    this.productForm.reset({ precio: 0, stock: 0 });
  }

  openDeleteModal(product: Product) {
    this.productToDelete = product;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.productToDelete = null;
  }

  confirmDelete() {
    if (this.productToDelete && this.productToDelete.id) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== this.productToDelete!.id);
          this.closeDeleteModal();
        },
        error: (err) => console.error('Error al eliminar producto', err)
      });
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      if (this.isEditMode && this.editingProductId) {
        this.productService.updateProduct(this.editingProductId, this.productForm.value).subscribe({
          next: (updatedProduct) => {
            const index = this.products.findIndex(p => p.id === this.editingProductId);
            if (index !== -1) this.products[index] = updatedProduct;
            this.closeModal();
          },
          error: (err) => console.error('Error actualizando producto', err)
        });
      } else {
        this.productService.createProduct(this.productForm.value).subscribe({
          next: (newProduct) => {
            this.products.push(newProduct);
            this.closeModal();
          },
          error: (err) => console.error('Error creando producto', err)
        });
      }
    }
  }
}
