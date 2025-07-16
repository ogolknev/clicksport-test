import { Component, effect, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ShoppingListService } from './features/shopping-list/shopping-list.service';
import {
  ShoppingItem,
} from './features/shopping-list/shopping-item.model';
import { CurrencySymbolPipe } from './shared/pipes/currency-symbol.pipe';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, CurrencySymbolPipe, DecimalPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  shoppingItemForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    price: new FormControl('0', Validators.required),
    currency: new FormControl<'RUB' | 'USD' | 'EUR'>('USD'),
  });

  items = signal<ShoppingItem[]>([]);

  private shoppingListService = inject(ShoppingListService);

  async onDelete(id: number) {
    await this.shoppingListService.deleteItem(id);
    this.shoppingListService.getItems().subscribe((response) => {
      this.items.set(response.data);
    });
  }

  async onSubmit() {
    if (this.shoppingItemForm.invalid) return;

    const value = this.shoppingItemForm.getRawValue() as {
      name: string;
      description?: string;
      price: string;
      currency: 'RUB' | 'USD' | 'EUR';
    };

    await this.shoppingListService.createItem({
      ...value,
      price: parseFloat(value.price.replaceAll(',', '.')) * 100,
    });

    this.shoppingListService.getItems().subscribe((response) => {
      this.items.set(response.data);
    });
  }

  constructor() {
    effect(async () => {
      this.shoppingListService.getItems().subscribe((response) => {
        this.items.set(response.data);
      });
    });
  }
}
