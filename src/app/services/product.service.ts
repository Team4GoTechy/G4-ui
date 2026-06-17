import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/productos'; // Endpoint de ejemplo

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    // Retornamos la llamada HTTP real
    return this.http.get<Product[]>(this.apiUrl);
  }
}
