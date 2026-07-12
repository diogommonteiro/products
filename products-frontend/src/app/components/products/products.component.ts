import { Component, inject, resource, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, debounceTime, distinctUntilChanged, firstValueFrom, takeUntil } from 'rxjs';
import { Product, ProductsService } from '../../services/products.service';

type EditDraft = {
  name: string;
  stock: number;
};

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
})
export class ProductsComponent {
  private readonly productsService = inject(ProductsService);
  private readonly searchInput$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  public displayedColumns: string[] = ['name', 'stock', 'actions'];

  protected readonly searchTerm = signal('');

  protected readonly productsResource = resource({
    params: () => this.searchTerm().trim(),
    loader: ({ params }) => {
      if (params) {
        return firstValueFrom(this.productsService.searchProducts(params));
      }

      return firstValueFrom(this.productsService.getAllProducts());
    },
  });

  constructor() {
    this.searchInput$
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => this.searchTerm.set(value));
  }

  protected onSearchChange(value: string): void {
    this.searchInput$.next(value);
  }

  // id da linha atualmente em edição (null = nenhuma)
  protected readonly editingId = signal<number | null>(null);
  protected editDraft: EditDraft = { name: '', stock: 0 };

  // controla se a "linha fantasma" de criação está visível
  protected readonly isAdding = signal(false);
  protected newProductDraft: EditDraft = { name: '', stock: 0 };

  protected startEdit(product: Product): void {
    this.editingId.set(product.id);
    this.editDraft = { name: product.name, stock: product.stock };
  }

  protected cancelEdit(): void {
    this.editingId.set(null);
  }

  protected async saveEdit(product: Product): Promise<void> {
    await firstValueFrom(
      this.productsService.updateProduct(product.id, {
        name: this.editDraft.name,
        stock: this.editDraft.stock,
      })
    );
    this.editingId.set(null);
    this.productsResource.reload();
  }

  protected async decrementStock(product: Product): Promise<void> {
    if (product.stock <= 0) return;
    await firstValueFrom(this.productsService.decrementStock(product.id, 1));
    this.productsResource.reload();
  }

  protected async addStock(product: Product): Promise<void> {
    await firstValueFrom(this.productsService.addToStock(product.id, 1));
    this.productsResource.reload();
  }

  protected async deleteProduct(product: Product): Promise<void> {
    await firstValueFrom(this.productsService.deleteProduct(product.id));
    this.productsResource.reload();
  }

  protected startAdd(): void {
    this.newProductDraft = { name: '', stock: 0 };
    this.isAdding.set(true);
  }

  protected cancelAdd(): void {
    this.isAdding.set(false);
  }

  protected async confirmAdd(): Promise<void> {
    if (!this.newProductDraft.name.trim()) return;
    await firstValueFrom(this.productsService.createProduct(this.newProductDraft));
    this.isAdding.set(false);
    this.productsResource.reload();
  }
}