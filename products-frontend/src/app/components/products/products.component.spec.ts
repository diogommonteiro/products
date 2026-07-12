import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';
import { ProductsComponent } from './products.component';
import { ProductsService, type Product } from '../../services/products.service';

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;

  beforeEach(async () => {
    productsServiceSpy = jasmine.createSpyObj('ProductsService', [
      'getAllProducts',
      'searchProducts',
      'updateProduct',
      'decrementStock',
      'addToStock',
      'deleteProduct',
      'createProduct',
    ]);

    productsServiceSpy.getAllProducts.and.returnValue(
      of([{ id: 1, name: 'Laptop', stock: 12 }])
    );
    productsServiceSpy.searchProducts.and.returnValue(of([{ id: 2, name: 'Phone', stock: 3 }]));
    productsServiceSpy.updateProduct.and.returnValue(of({ id: 1, name: 'Laptop', stock: 12 }));
    productsServiceSpy.decrementStock.and.returnValue(of(void 0));
    productsServiceSpy.addToStock.and.returnValue(of(void 0));
    productsServiceSpy.deleteProduct.and.returnValue(of(void 0));
    productsServiceSpy.createProduct.and.returnValue(of({ id: 3, name: 'Mouse', stock: 5 }));

    await TestBed.configureTestingModule({
      imports: [ProductsComponent, MockTranslatePipe],
      providers: [{ provide: ProductsService, useValue: productsServiceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and load the initial product list', () => {
    expect(component).toBeTruthy();
    expect(productsServiceSpy.getAllProducts).toHaveBeenCalled();
  });

  it('should update the search term after the user types a query', fakeAsync(() => {
    (component as any).onSearchChange('Phone');
    tick(600);
    fixture.detectChanges();

    expect((component as any).searchTerm()).toBe('Phone');
  }));

  it('should enter edit mode and populate the draft when the user starts editing', () => {
    const product: Product = { id: 5, name: 'Monitor', stock: 8 };

    (component as any).startEdit(product);

    expect((component as any).editingId()).toBe(5);
    expect((component as any).editDraft).toEqual({ name: 'Monitor', stock: 8 });
  });

  it('should cancel editing when the user discards changes', () => {
    (component as any).startEdit({ id: 6, name: 'Keyboard', stock: 4 });

    (component as any).cancelEdit();

    expect((component as any).editingId()).toBeNull();
  });

  it('should save edits and reload products when the user confirms an update', async () => {
    const product: Product = { id: 1, name: 'Laptop', stock: 12 };
    (component as any).startEdit(product);
    (component as any).editDraft = { name: 'Gaming Laptop', stock: 10 };
    const reloadSpy = spyOn((component as any).productsResource, 'reload');

    await (component as any).saveEdit(product);

    expect(productsServiceSpy.updateProduct).toHaveBeenCalledWith(1, {
      name: 'Gaming Laptop',
      stock: 10,
    });
    expect((component as any).editingId()).toBeNull();
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should not decrement product stock when stock is already zero', async () => {
    await (component as any).decrementStock({ id: 7, name: 'Out of Stock', stock: 0 });

    expect(productsServiceSpy.decrementStock).not.toHaveBeenCalled();
  });

  it('should decrement stock and refresh products when stock is available', async () => {
    const reloadSpy = spyOn((component as any).productsResource, 'reload');

    await (component as any).decrementStock({ id: 1, name: 'Laptop', stock: 2 });

    expect(productsServiceSpy.decrementStock).toHaveBeenCalledWith(1, 1);
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should add stock and refresh products when the user adds stock', async () => {
    const reloadSpy = spyOn((component as any).productsResource, 'reload');

    await (component as any).addStock({ id: 2, name: 'Phone', stock: 3 });

    expect(productsServiceSpy.addToStock).toHaveBeenCalledWith(2, 1);
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should delete a product and refresh products when the user confirms delete', async () => {
    const reloadSpy = spyOn((component as any).productsResource, 'reload');

    await (component as any).deleteProduct({ id: 3, name: 'Mouse', stock: 1 });

    expect(productsServiceSpy.deleteProduct).toHaveBeenCalledWith(3);
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should start adding a new product and reset the draft', () => {
    (component as any).startAdd();

    expect((component as any).isAdding()).toBeTrue();
    expect((component as any).newProductDraft).toEqual({ name: '', stock: 0 });
  });

  it('should cancel adding a new product', () => {
    (component as any).startAdd();

    (component as any).cancelAdd();

    expect((component as any).isAdding()).toBeFalse();
  });

  it('should not create a product when the draft name is empty', async () => {
    (component as any).startAdd();
    (component as any).newProductDraft = { name: '   ', stock: 5 };

    await (component as any).confirmAdd();

    expect(productsServiceSpy.createProduct).not.toHaveBeenCalled();
    expect((component as any).isAdding()).toBeTrue();
  });

  it('should create a new product and refresh products when the draft is valid', async () => {
    (component as any).startAdd();
    (component as any).newProductDraft = { name: 'Mouse', stock: 5 };
    const reloadSpy = spyOn((component as any).productsResource, 'reload');

    await (component as any).confirmAdd();

    expect(productsServiceSpy.createProduct).toHaveBeenCalledWith({ name: 'Mouse', stock: 5 });
    expect((component as any).isAdding()).toBeFalse();
    expect(reloadSpy).toHaveBeenCalled();
  });
});
