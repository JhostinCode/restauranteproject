import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  InventoryItem,
  CreateInventoryItemRequest,
  UpdateInventoryItemRequest,
  StockOperationRequest,
  InventoryFilter
} from '../models/inventory/inventory-item.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/api/inventory`;

  constructor(private http: HttpClient) {}

  getAllItems(filter: InventoryFilter = {}): Observable<any> {
    let params = new HttpParams();
    
    if (filter.name) params = params.set('name', filter.name);
    if (filter.measurementUnitId) params = params.set('measurementUnitId', filter.measurementUnitId.toString());
    if (filter.minStock) params = params.set('minStock', filter.minStock.toString());
    if (filter.maxStock) params = params.set('maxStock', filter.maxStock.toString());
    if (filter.page !== undefined) params = params.set('page', filter.page.toString());
    if (filter.size) params = params.set('size', filter.size.toString());
    if (filter.sort) params = params.set('sort', filter.sort);

    return this.http.get<any>(`${this.apiUrl}/items`, { params });
  }

  getItemById(id: number): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.apiUrl}/items/${id}`);
  }

  createItem(request: CreateInventoryItemRequest): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(`${this.apiUrl}/items`, request);
  }

  updateItem(id: number, request: UpdateInventoryItemRequest): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.apiUrl}/items/${id}`, request);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${id}`);
  }

  updateStock(id: number, request: StockOperationRequest): Observable<InventoryItem> {
    return this.http.patch<InventoryItem>(`${this.apiUrl}/items/${id}/stock`, request);
  }

  getItemsBelowStock(threshold: number): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.apiUrl}/items/below-stock/${threshold}`);
  }

  getRecentlyUpdated(limit: number = 10): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.apiUrl}/items/recent`, {
      params: new HttpParams().set('limit', limit.toString())
    });
  }
}
