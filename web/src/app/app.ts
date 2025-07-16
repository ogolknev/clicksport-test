import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

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
}
