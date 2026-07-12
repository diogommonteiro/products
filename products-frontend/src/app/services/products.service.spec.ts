import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ProductsService, type Product, type CreateProductPayload } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5030/api/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all products from the API', () => {
    const expectedProducts: Product[] = [{ id: 1, name: 'Laptop', stock: 12 }];

    service.getAllProducts().subscribe((products) => {
      expect(products).toEqual(expectedProducts);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(expectedProducts);
  });

  it('should create a product using the API', () => {
    const newProduct: CreateProductPayload = { name: 'Mouse', stock: 5 };
    const createdProduct: Product = { id: 3, ...newProduct };

    service.createProduct(newProduct).subscribe((product) => {
      expect(product).toEqual(createdProduct);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(createdProduct);
  });

  it('should update a product using the API', () => {
    const partialUpdate = { stock: 8 };

    service.updateProduct(1, partialUpdate).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(partialUpdate);
    req.flush({});
  });

  it('should delete a product using the API', () => {
    service.deleteProduct(2).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should call the decrement stock endpoint', () => {
    service.decrementStock(1, 2).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1/decrement-stock/2`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(null);
  });

  it('should call the add-to-stock endpoint', () => {
    service.addToStock(4, 10).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/4/add-to-stock/10`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(null);
  });

  it('should search products by name with query params', () => {
    service.searchProducts('Laptop').subscribe();

    const req = httpMock.expectOne((request) => request.url === `${apiUrl}/search` && request.params.get('name') === 'Laptop');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should fetch products within a stock range', () => {
    service.getProductsByStockRange(1, 10).subscribe();

    const req = httpMock.expectOne((request) => request.url === `${apiUrl}/stock-level` && request.params.get('min') === '1' && request.params.get('max') === '10');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
