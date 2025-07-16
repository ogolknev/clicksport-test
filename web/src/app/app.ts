import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ShoppingListService } from './features/shopping-list/shopping-list.service';
import { ShoppingItem } from './features/shopping-list/shopping-item.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  shoppingItemForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    price: new FormControl<number | null>(null),
    currency: new FormControl<'RUB' | 'USD' | 'EUR'>('USD')
  })

  items = signal<ShoppingItem[]>([])

  private shoppingListService = inject(ShoppingListService)

  constructor() {
    effect(async () => {
      this.shoppingListService.getItems().subscribe(response => {
        this.items.set(response.data)
      })
    })
  }
}
