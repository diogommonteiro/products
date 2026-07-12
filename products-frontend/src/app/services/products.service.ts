import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsService {

  private readonly url = 'http://localhost:5030/api/products';

  constructor(private readonly http: HttpClient) { }

  public getAllProducts(): Observable<Product[]> {
    // TODO: Implement pagination for better performance with large datasets
    return this.http.get<Product[]>(this.url);
  }

  public createProduct(product: CreateProductPayload): Observable<Product> {
    return this.http.post<Product>(this.url, product);
  }

  public getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  public updateProduct(id: number, product: Partial<CreateProductPayload>): Observable<Product> {
    return this.http.put<Product>(`${this.url}/${id}`, product);
  }

  public deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  public decrementStock(id: number, quantity: number): Observable<void> {
    return this.http.post<void>(`${this.url}/${id}/decrement-stock/${quantity}`, {});
  }

  public addToStock(id: number, quantity: number): Observable<void> {
    return this.http.post<void>(`${this.url}/${id}/add-to-stock/${quantity}`, {});
  }

  public searchProducts(name: string): Observable<Product[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Product[]>(`${this.url}/search`, { params });
  }

  public getProductsByStockRange(min: number, max: number): Observable<Product[]> {
    const params = new HttpParams().set('min', min).set('max', max);
    return this.http.get<Product[]>(`${this.url}/stock-level`, { params });
  }
}

export type Product = {
  id: number;
  name: string;
  stock: number;
};

export type CreateProductPayload = Omit<Product, 'id'>;
