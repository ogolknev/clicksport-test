import { Component, effect, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ShoppingListService } from './features/shopping-list/shopping-list.service';
import { ShoppingItem } from './features/shopping-list/shopping-item.model';
import { CurrencySymbolPipe } from './shared/pipes/currency-symbol.pipe';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, CurrencySymbolPipe, DecimalPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  shoppingItemForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    price: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern(/^\d+(?:[.,]\d{1,2})?$/),
      ],
    }),
    currency: new FormControl<'RUB' | 'USD' | 'EUR'>('USD'),
  });

  items = signal<ShoppingItem[]>([]);
  errors = signal<string[]>([]);
  status = signal<string>('');
  pageSize = 5;
  curPage = signal(1);
  totalPages = signal(1);

  private shoppingListService = inject(ShoppingListService);

  async nextPage() {
    this.curPage.update((p) => Math.min(p + 1, this.totalPages()));
    await this.updateItems();
  }

  async prevPage() {
    this.curPage.update((p) => Math.max(p - 1, 1));
    await this.updateItems();
  }

  async updateItems() {
    const response = await this.shoppingListService.getItems({
      page: this.curPage(),
      pageSize: this.pageSize,
    });
    this.totalPages.set(
      Math.ceil((response.meta?.pagination?.total ?? 1) / this.pageSize)
    );
    this.curPage.update((p) => Math.min(p, this.totalPages()));
    this.items.set(response.data);
  }

  async onDelete(id: number) {
    try {
      await this.shoppingListService.deleteItem(id);
      await this.updateItems();

      this.status.set('Item successfully deleted');
    } catch (err) {
      throw console.error(err);
    }
  }

  async onSubmit() {
    if (this.shoppingItemForm.invalid) {
      const errors: string[] = [];

      if (this.shoppingItemForm.get('name')?.hasError('required')) {
        errors.push('Name required');
      }
      if (this.shoppingItemForm.get('price')?.hasError('required')) {
        errors.push('Price required');
      }
      if (this.shoppingItemForm.get('price')?.hasError('pattern')) {
        errors.push('Invalid price');
      }

      this.errors.set(errors);

      return;
    }

    const value = this.shoppingItemForm.getRawValue() as {
      name: string;
      description?: string;
      price: string;
      currency: 'RUB' | 'USD' | 'EUR';
    };

    try {
      await this.shoppingListService.createItem({
        ...value,
        price: parseFloat(value.price.replaceAll(',', '.')) * 100,
      });

      await this.updateItems();

      this.status.set('Item successfully added');
      this.errors.set([]);
    } catch (err) {
      if (err instanceof Error) this.errors.set([err.message]);
    }

    this.shoppingItemForm.reset({ currency: value.currency });
  }

  constructor() {
    effect(async () => {
      await this.updateItems();
    });
  }
}
