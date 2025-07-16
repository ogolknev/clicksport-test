import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ShoppingItem, ShoppingItemCreate } from './shopping-item.model';
import { APIResponse } from '../../../../../backend/src/types/api-response';
import { APIPaginationQuery } from '../../types/api-pagination';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  private http = inject(HttpClient);

  getItems(pagination?: APIPaginationQuery) {
    return this.http.get<APIResponse<ShoppingItem[]>>(
      environment.apiUrl + '/shopping-items',
      { params: pagination }
    );
  }

  async deleteItem(id: number) {
    await firstValueFrom(
      this.http.delete<void>(environment.apiUrl + '/shopping-items/' + id)
    );
  }

  async createItem(payload: ShoppingItemCreate) {
    return firstValueFrom(
      this.http.post<APIResponse<ShoppingItem[]>>(
        environment.apiUrl + '/shopping-items',
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );
  }
}
