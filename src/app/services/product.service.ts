import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/productos';

  getProducts(categoriaId?: number): Observable<Product[]> {
    const url = categoriaId ? `${this.apiUrl}?categoriaId=${categoriaId}` : this.apiUrl;
    return this.http.get<Product[]>(url);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/categorias');
  }

  createCategory(category: any): Observable<any> {
    return this.http.post<any>('http://localhost:8080/categorias', category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/categorias/${id}`);
  }

  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/categorias/${id}`, category);
  }

  createPurchase(purchase: any): Observable<any> {
    return this.http.post<any>('http://localhost:8080/compras', purchase);
  }

  getPurchaseHistory(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/compras');
  }

  getAllPurchases(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/compras/todas');
  }

  updatePurchaseStatus(id: number, estado: string): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/compras/${id}/estado?estado=${estado}`, {});
  }

  uploadProductImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>('http://localhost:8080/upload/producto', formData);
  }
}
