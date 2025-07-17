import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ShoppingItem, ShoppingItemCreate } from './shopping-item.model';
import { APIResponse } from '../../../../../backend/src/types/api-response';
import { APIPaginationQuery } from '../../types/api-pagination';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  private http = inject(HttpClient);

  async getItems(pagination?: APIPaginationQuery) {
    return firstValueFrom(
      this.http.get<APIResponse<ShoppingItem[]>>(
        environment.apiUrl + '/shopping-items',
        { params: pagination }
      )
    );
  }

  async deleteItem(id: number) {
    await firstValueFrom(
      this.http.delete<void>(environment.apiUrl + '/shopping-items/' + id)
    );
  }

  async createItem(payload: ShoppingItemCreate) {
    return firstValueFrom(
      this.http
        .post<APIResponse<ShoppingItem[]>>(
          environment.apiUrl + '/shopping-items',
          payload,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        )
        .pipe(
          catchError((error) => {
            return throwError(
              () => new Error(`Failed to create item: ${error.message}`)
            );
          })
        )
    );
  }
}
