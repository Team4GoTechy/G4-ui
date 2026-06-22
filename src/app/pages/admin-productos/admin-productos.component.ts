import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { toast } from 'ngx-sonner';
import { gsap } from 'gsap';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Modales fuera del contenedor de la tarjeta para evitar recortes y mantener blur completo en el viewport -->
    
    <!--======================= MODAL: CREAR/EDITAR PRODUCTO =======================-->
    <div *ngIf="isProductModalOpen" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 product-modal-backdrop opacity-0">
      <div class="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-3xl w-full p-8 relative product-modal-content opacity-0">
        <h3 class="text-2xl font-black text-slate-800 mb-2">
          {{ isEditingProduct ? 'Editar Producto' : 'Nuevo Producto' }}
        </h3>
        <p class="text-slate-400 text-sm font-bold mb-6">Completa los datos correspondientes al producto</p>

        <form [formGroup]="productForm" (ngSubmit)="onSubmitProduct()" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Columna Izquierda: Imagen y Descripción -->
            <div class="space-y-4">
              <!-- Subida de Imagen Premium con preview más grande y bonita -->
              <div>
                <label class="block text-xs font-bold text-slate-500 mb-2">Imagen del Producto</label>
                <div class="relative group rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50 flex flex-col items-center justify-center p-4 hover:border-sky-400 transition-colors min-h-[160px] cursor-pointer" (click)="fileInput.click()">
                  <input type="file" (change)="onFileSelected($event)" accept="image/*" class="hidden" #fileInput>
                  
                  <!-- Si hay imagen subida o seleccionada, mostramos la preview grande -->
                  <img *ngIf="productForm.get('imagenUrl')?.value" [src]="productForm.get('imagenUrl')?.value" class="absolute inset-0 w-full h-full object-cover">
                  
                  <!-- Si está cargando, mostramos spinner / indicador -->
                  <div *ngIf="isUploading" class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
                    <svg class="animate-spin h-8 w-8 text-white mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span class="text-xs font-bold">Subiendo imagen...</span>
                  </div>

                  <!-- Si no hay imagen, o encima de ella en hover (con efecto hover), mostramos el icono y texto -->
                  <div [class.opacity-0]="productForm.get('imagenUrl')?.value" [class.group-hover:opacity-100]="productForm.get('imagenUrl')?.value" class="flex flex-col items-center justify-center text-center relative z-10 transition-opacity bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100 w-11/12 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-sky-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                    </svg>
                    <span class="text-xs font-extrabold text-slate-700">Subir Imagen</span>
                    <span class="text-[9px] text-slate-400 mt-1 font-bold">JPG, PNG, WEBP de hasta 5MB</span>
                  </div>
                </div>
              </div>

              <!-- Descripción -->
              <div>
                <label class="block text-xs font-bold text-slate-500 mb-1">Descripción</label>
                <textarea formControlName="descripcion" rows="4" placeholder="Detalles de uso, componentes..." class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none font-bold text-gray-800 transition-colors resize-none h-[116px]"></textarea>
              </div>
            </div>

            <!-- Columna Derecha: Campos de Texto -->
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 mb-1">Nombre del Producto</label>
                <input formControlName="nombre" type="text" placeholder="Ej. Alimento Premium" class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none font-bold text-gray-800 transition-colors">
                <p *ngIf="productForm.get('nombre')?.invalid && productForm.get('nombre')?.touched" class="text-red-500 text-[10px] mt-1 font-bold">El nombre es obligatorio.</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-500 mb-1">Código Único</label>
                  <input formControlName="codigo" type="text" placeholder="Ej. ART-123" class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none font-bold text-gray-800 transition-colors">
                  <p *ngIf="productForm.get('codigo')?.invalid && productForm.get('codigo')?.touched" class="text-red-500 text-[10px] mt-1 font-bold">El código es obligatorio.</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-500 mb-1">Categoría</label>
                  <select formControlName="categoriaId" class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none font-bold text-gray-800 cursor-pointer">
                    <option value="" disabled>Seleccionar...</option>
                    <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.nombre }}</option>
                  </select>
                  <p *ngIf="productForm.get('categoriaId')?.invalid && productForm.get('categoriaId')?.touched" class="text-red-500 text-[10px] mt-1 font-bold">La categoría es obligatoria.</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-500 mb-1">Precio ($)</label>
                  <input formControlName="precio" type="number" min="0.01" step="0.01" class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none font-bold text-gray-800 transition-colors">
                  <p *ngIf="productForm.get('precio')?.invalid && productForm.get('precio')?.touched" class="text-red-500 text-[10px] mt-1 font-bold">Mínimo 0.01.</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-500 mb-1">Stock Inicial</label>
                  <input formControlName="stock" type="number" min="0" class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none font-bold text-gray-800 transition-colors">
                  <p *ngIf="productForm.get('stock')?.invalid && productForm.get('stock')?.touched" class="text-red-500 text-[10px] mt-1 font-bold">Mínimo 0.</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-500 mb-1">Peso (Kg) (Opcional)</label>
                  <input formControlName="pesoKg" type="number" step="0.01" min="0" placeholder="Ej. 15.5" class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none font-bold text-gray-800 transition-colors">
                  <p *ngIf="productForm.get('pesoKg')?.invalid && productForm.get('pesoKg')?.touched" class="text-red-500 text-[10px] mt-1 font-bold">El peso debe ser positivo.</p>
                </div>
                <div></div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <button type="button" (click)="closeProductModal()" class="bg-gray-100 hover:bg-gray-200 active:scale-95 hover:scale-[1.02] text-gray-600 font-extrabold py-2.5 px-6 rounded-xl transition-all duration-200 text-sm cursor-pointer">
              Cancelar
            </button>
            <button type="submit" [disabled]="productForm.invalid || isUploading" class="bg-sky-500 hover:bg-sky-600 active:scale-95 hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none text-white font-extrabold py-2.5 px-6 rounded-xl transition-all duration-200 text-sm shadow-md hover:shadow-sky-500/30 cursor-pointer">
              {{ isEditingProduct ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!--======================= MODAL: CREAR/EDITAR CATEGORÍA =======================-->
    <div *ngIf="isCategoryModalOpen" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 category-modal-backdrop opacity-0">
      <div class="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-sm w-full p-8 relative category-modal-content opacity-0">
        <h3 class="text-2xl font-black text-slate-800 mb-2">
          {{ isEditingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}
        </h3>
        <p class="text-slate-400 text-sm font-bold mb-6">
          {{ isEditingCategory ? 'Modifica los datos de la categoría' : 'Registra una nueva categoría de productos' }}
        </p>

        <form [formGroup]="categoryForm" (ngSubmit)="onSubmitCategory()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">Nombre de la Categoría</label>
            <input formControlName="nombre" type="text" placeholder="Ej. Juguetes, Farmacia" class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none font-bold text-gray-800 transition-colors">
            <p *ngIf="categoryForm.get('nombre')?.invalid && categoryForm.get('nombre')?.touched" class="text-red-500 text-[10px] mt-1 font-bold">El nombre es obligatorio.</p>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">Descripción (Opcional)</label>
            <textarea formControlName="descripcion" rows="3" placeholder="Ej. Accesorios recreativos para mascotas" class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none font-bold text-gray-800 transition-colors resize-none"></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <button type="button" (click)="closeCategoryModal()" class="bg-gray-100 hover:bg-gray-200 active:scale-95 hover:scale-[1.02] text-gray-600 font-extrabold py-2.5 px-6 rounded-xl transition-all duration-200 text-sm cursor-pointer">
              Cancelar
            </button>
            <button type="submit" [disabled]="categoryForm.invalid" class="bg-orange-500 hover:bg-orange-600 active:scale-95 hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none text-white font-extrabold py-2.5 px-6 rounded-xl transition-all duration-200 text-sm shadow-md hover:shadow-orange-500/30 cursor-pointer">
              {{ isEditingCategory ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!--======================= MODAL: CONFIRMACIÓN DE ELIMINACIÓN =======================-->
    <div *ngIf="isDeleteModalOpen" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 delete-modal-backdrop opacity-0">
      <div class="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-sm w-full p-8 relative delete-modal-content opacity-0">
        <div class="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h3 class="text-xl font-black text-slate-800 mb-2 text-center">¿Estás seguro?</h3>
        <p class="text-slate-500 text-sm font-bold text-center mb-6">
          Vas a eliminar "{{ deleteName }}" <span *ngIf="deleteTarget === 'product' && deleteCode">[{{ deleteCode }}]</span>. Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-center gap-3">
          <button type="button" (click)="closeDeleteModal()" class="bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-600 font-extrabold py-2.5 px-6 rounded-xl transition-all duration-200 text-sm cursor-pointer">
            Cancelar
          </button>
          <button type="button" (click)="executeDelete()" class="bg-red-500 hover:bg-red-600 active:scale-95 text-white font-extrabold py-2.5 px-6 rounded-xl transition-all duration-200 text-sm shadow-md shadow-red-500/20 cursor-pointer">
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Contenedor Principal (Tarjeta redondeada flotante) -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8 page-container opacity-0 space-y-6">
      
      <!-- Encabezado -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-3xl font-black text-slate-800">Panel de Inventario</h2>
          <p class="text-slate-500 font-bold text-sm">Administra los productos y categorías disponibles en la tienda</p>
        </div>
        
        <div class="flex gap-3">
          <button (click)="openCategoryModal()" 
                  class="bg-orange-500 hover:bg-orange-600 active:scale-95 hover:scale-[1.02] text-white font-extrabold py-2.5 px-5 rounded-xl transition-all duration-200 shadow-md hover:shadow-orange-500/30 text-sm hover:brightness-105 transform cursor-pointer">
            + Nueva Categoría
          </button>
          <button (click)="openProductModal()" 
                  class="bg-sky-500 hover:bg-sky-600 active:scale-95 hover:scale-[1.02] text-white font-extrabold py-2.5 px-5 rounded-xl transition-all duration-200 shadow-md hover:shadow-sky-500/30 text-sm hover:brightness-105 transform cursor-pointer">
            + Nuevo Producto
          </button>
        </div>
      </div>

      <!-- Selector de Pestañas -->
      <div class="flex border-b border-gray-200">
        <button (click)="activeTab = 'products'"
                class="py-3 px-6 font-extrabold text-sm border-b-2 transition-all duration-200 active:scale-95"
                [ngClass]="activeTab === 'products' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-400 hover:text-gray-600'">
          📦 Productos ({{ products.length }})
        </button>
        <button (click)="activeTab = 'categories'"
                class="py-3 px-6 font-extrabold text-sm border-b-2 transition-all duration-200 active:scale-95"
                [ngClass]="activeTab === 'categories' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'">
          🏷️ Categorías ({{ categories.length }})
        </button>
      </div>

      <!--======================= TAB 1: PRODUCTOS =======================-->
      <div *ngIf="activeTab === 'products'" class="border border-gray-100 rounded-2xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th class="p-4 font-bold">Código</th>
                <th class="p-4 font-bold">Producto</th>
                <th class="p-4 font-bold">Categoría</th>
                <th class="p-4 font-bold">Precio</th>
                <th class="p-4 font-bold">Stock</th>
                <th class="p-4 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr *ngFor="let p of products" class="border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                <td class="p-4 font-bold text-slate-400">{{ p.codigo }}</td>
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg border border-gray-150 overflow-hidden bg-gray-50 shrink-0 flex items-center justify-center">
                      <img *ngIf="p.imagenUrl" [src]="p.imagenUrl" class="w-full h-full object-cover">
                      <span *ngIf="!p.imagenUrl" class="text-[9px] text-gray-450 font-bold uppercase text-center">Sin foto</span>
                    </div>
                    <div>
                      <div class="font-extrabold text-slate-800">{{ p.nombre }}</div>
                      <div class="text-xs text-gray-400 truncate max-w-xs">{{ p.descripcion || 'Sin descripción' }}</div>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-50 text-orange-600 border border-orange-100">
                    {{ p.categoria || 'Sin Categoría' }}
                  </span>
                </td>
                <td class="p-4 font-extrabold text-sky-600">$ {{ p.precio | number:'1.2-2' }}</td>
                <td class="p-4">
                  <span class="px-2.5 py-1 rounded-full text-xs font-bold"
                        [ngClass]="p.stock > 5 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'">
                    {{ p.stock }} Uds.
                  </span>
                </td>
                <td class="p-4">
                  <div class="flex items-center justify-center gap-3">
                    <button (click)="editProduct(p)" class="text-sky-500 hover:text-sky-600 transition-colors active:scale-90" title="Editar">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button (click)="confirmDeleteProduct(p.id!, p.nombre, p.codigo)" class="text-red-400 hover:text-red-500 transition-colors active:scale-90" title="Eliminar">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="products.length === 0">
                <td colspan="6" class="p-8 text-center text-gray-400 font-bold">
                  No hay productos registrados en el sistema.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!--======================= TAB 2: CATEGORÍAS =======================-->
      <div *ngIf="activeTab === 'categories'" class="border border-gray-100 rounded-2xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th class="p-4 font-bold">ID</th>
                <th class="p-4 font-bold">Nombre</th>
                <th class="p-4 font-bold">Descripción</th>
                <th class="p-4 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr *ngFor="let c of categories" class="border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                <td class="p-4 font-bold text-slate-400">#{{ c.id }}</td>
                <td class="p-4 font-extrabold text-slate-800">{{ c.nombre }}</td>
                <td class="p-4 text-slate-500">{{ c.descripcion || '-' }}</td>
                <td class="p-4">
                  <div class="flex items-center justify-center gap-3">
                    <button (click)="editCategory(c)" class="text-sky-500 hover:text-sky-600 transition-colors active:scale-90" title="Editar">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button (click)="confirmDeleteCategory(c.id!, c.nombre)" class="text-red-400 hover:text-red-500 transition-colors active:scale-90" title="Eliminar">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="categories.length === 0">
                <td colspan="4" class="p-8 text-center text-gray-400 font-bold">
                  No hay categorías registradas en el sistema.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class AdminProductosComponent implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  activeTab: 'products' | 'categories' = 'products';
  products: Product[] = [];
  categories: any[] = [];

  isProductModalOpen = false;
  isCategoryModalOpen = false;
  isEditingProduct = false;
  selectedProductId: number | null = null;

  isEditingCategory = false;
  selectedCategoryId: number | null = null;

  isDeleteModalOpen = false;
  deleteTarget: 'product' | 'category' = 'product';
  deleteId: number | null = null;
  deleteName = '';
  deleteCode = '';

  isUploading = false;

  productForm: FormGroup;
  categoryForm: FormGroup;

  constructor() {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      codigo: ['', Validators.required],
      descripcion: [''],
      precio: [0.01, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoriaId: ['', Validators.required],
      imagenUrl: [''],
      pesoKg: [null, [Validators.min(0)]]
    });

    this.categoryForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    // Entrada de la página animada con GSAP (solo opacidad para no romper el z-index del modal)
    setTimeout(() => {
      gsap.fromTo('.page-container', 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        toast.error('Error al cargar productos');
      }
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        toast.error('Error al cargar categorías. Verifica que el servidor de backend esté listo.');
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 5MB');
        return;
      }
      this.isUploading = true;
      this.productService.uploadProductImage(file).subscribe({
        next: (res) => {
          this.isUploading = false;
          this.productForm.patchValue({ imagenUrl: res.url });
          toast.success('Imagen subida correctamente');
        },
        error: (err) => {
          this.isUploading = false;
          console.error('Error de subida a Cloudinary:', err);
          const errMsg = err.error?.error || 'Error de comunicación con el servidor';
          toast.error(`Error: ${errMsg}`);
        }
      });
    }
  }

  openProductModal() {
    this.isEditingProduct = false;
    this.selectedProductId = null;
    this.productForm.reset({
      nombre: '',
      codigo: '',
      descripcion: '',
      precio: 0.01,
      stock: 0,
      categoriaId: '',
      imagenUrl: '',
      pesoKg: null
    });
    this.isProductModalOpen = true;

    // Animación de entrada de GSAP
    setTimeout(() => {
      gsap.fromTo('.product-modal-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo('.product-modal-content', 
        { scale: 0.85, y: 40, opacity: 0 }, 
        { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.4)' }
      );
    });
  }

  openCategoryModal() {
    this.isEditingCategory = false;
    this.selectedCategoryId = null;
    this.categoryForm.reset({
      nombre: '',
      descripcion: ''
    });
    this.isCategoryModalOpen = true;

    // Animación de entrada de GSAP
    setTimeout(() => {
      gsap.fromTo('.category-modal-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo('.category-modal-content', 
        { scale: 0.85, y: 40, opacity: 0 }, 
        { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.4)' }
      );
    });
  }

  closeProductModal() {
    gsap.to('.product-modal-content', { 
      scale: 0.85, 
      y: 40, 
      opacity: 0, 
      duration: 0.2, 
      ease: 'power2.in' 
    });
    gsap.to('.product-modal-backdrop', { 
      opacity: 0, 
      duration: 0.2, 
      onComplete: () => {
        this.isProductModalOpen = false;
      }
    });
  }

  closeCategoryModal() {
    gsap.to('.category-modal-content', { 
      scale: 0.85, 
      y: 40, 
      opacity: 0, 
      duration: 0.2, 
      ease: 'power2.in' 
    });
    gsap.to('.category-modal-backdrop', { 
      opacity: 0, 
      duration: 0.2, 
      onComplete: () => {
        this.isCategoryModalOpen = false;
      }
    });
  }

  editProduct(product: Product) {
    this.isEditingProduct = true;
    this.selectedProductId = product.id || null;
    
    const cat = this.categories.find(c => c.nombre === product.categoria);
    const catId = cat ? cat.id : '';

    this.productForm.patchValue({
      nombre: product.nombre,
      codigo: product.codigo,
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock,
      categoriaId: catId,
      imagenUrl: product.imagenUrl || '',
      pesoKg: product.pesoKg || null
    });
    this.isProductModalOpen = true;

    // Animación de entrada de GSAP
    setTimeout(() => {
      gsap.fromTo('.product-modal-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo('.product-modal-content', 
        { scale: 0.85, y: 40, opacity: 0 }, 
        { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.4)' }
      );
    });
  }

  confirmDeleteProduct(id: number, name: string, codigo: string) {
    this.deleteTarget = 'product';
    this.deleteId = id;
    this.deleteName = name;
    this.deleteCode = codigo;
    this.isDeleteModalOpen = true;
    setTimeout(() => {
      gsap.fromTo('.delete-modal-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo('.delete-modal-content', 
        { scale: 0.85, y: 40, opacity: 0 }, 
        { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.4)' }
      );
    });
  }

  confirmDeleteCategory(id: number, name: string) {
    this.deleteTarget = 'category';
    this.deleteId = id;
    this.deleteName = name;
    this.isDeleteModalOpen = true;
    setTimeout(() => {
      gsap.fromTo('.delete-modal-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo('.delete-modal-content', 
        { scale: 0.85, y: 40, opacity: 0 }, 
        { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.4)' }
      );
    });
  }

  editCategory(category: any) {
    this.isEditingCategory = true;
    this.selectedCategoryId = category.id || null;
    this.categoryForm.patchValue({
      nombre: category.nombre,
      descripcion: category.descripcion || ''
    });
    this.isCategoryModalOpen = true;
    setTimeout(() => {
      gsap.fromTo('.category-modal-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo('.category-modal-content', 
        { scale: 0.85, y: 40, opacity: 0 }, 
        { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.4)' }
      );
    });
  }

  closeDeleteModal() {
    gsap.to('.delete-modal-content', { 
      scale: 0.85, 
      y: 40, 
      opacity: 0, 
      duration: 0.2, 
      ease: 'power2.in' 
    });
    gsap.to('.delete-modal-backdrop', { 
      opacity: 0, 
      duration: 0.2, 
      onComplete: () => {
        this.isDeleteModalOpen = false;
      }
    });
  }

  executeDelete() {
    if (this.deleteId === null) return;
    
    if (this.deleteTarget === 'product') {
      this.productService.deleteProduct(this.deleteId).subscribe({
        next: () => {
          toast.success('Producto eliminado correctamente');
          this.closeDeleteModal();
          this.loadProducts();
        },
        error: (err) => {
          toast.error('Error al eliminar producto');
        }
      });
    } else {
      this.productService.deleteCategory(this.deleteId).subscribe({
        next: () => {
          toast.success('Categoría eliminada correctamente');
          this.closeDeleteModal();
          this.loadCategories();
          this.loadProducts();
        },
        error: (err) => {
          toast.error('Error al eliminar categoría (podría tener productos asociados)');
        }
      });
    }
  }

  onSubmitProduct() {
    if (this.productForm.valid) {
      const payload: Product = this.productForm.value;
      payload.categoriaId = Number(payload.categoriaId);

      if (this.isEditingProduct && this.selectedProductId !== null) {
        this.productService.updateProduct(this.selectedProductId, payload).subscribe({
          next: () => {
            toast.success('Producto actualizado con éxito');
            this.closeProductModal();
            this.loadProducts();
          },
          error: (err) => {
            toast.error('Error al actualizar producto. El código podría estar duplicado.');
          }
        });
      } else {
        this.productService.createProduct(payload).subscribe({
          next: () => {
            toast.success('Producto registrado con éxito');
            this.closeProductModal();
            this.loadProducts();
          },
          error: (err) => {
            toast.error('Error al crear producto. Verifica que el código no esté duplicado.');
          }
        });
      }
    }
  }

  onSubmitCategory() {
    if (this.categoryForm.valid) {
      if (this.isEditingCategory && this.selectedCategoryId !== null) {
        this.productService.updateCategory(this.selectedCategoryId, this.categoryForm.value).subscribe({
          next: () => {
            toast.success('Categoría actualizada con éxito');
            this.closeCategoryModal();
            this.loadCategories();
            this.loadProducts();
          },
          error: (err) => {
            toast.error('Error al actualizar categoría');
          }
        });
      } else {
        this.productService.createCategory(this.categoryForm.value).subscribe({
          next: () => {
            toast.success('Categoría creada con éxito');
            this.closeCategoryModal();
            this.loadCategories();
          },
          error: (err) => {
            toast.error('Error al crear categoría');
          }
        });
      }
    }
  }
}
