import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
    MenuItem,
    CreateMenuItemRequest,
    UpdateMenuItemRequest,
    MenuItemFilter
} from '../models/menu/menu-item.model';

@Injectable({
    providedIn: 'root'
})
export class MenuItemService {
    private apiUrl = `${environment.apiUrl}/api/menu/items`;

    constructor(private http: HttpClient) {}

    getAllItems(filter: MenuItemFilter = {}): Observable<any> {
        let params = new HttpParams();
        
        if (filter.name) params = params.set('name', filter.name);
        if (filter.categoryId) params = params.set('categoryId', filter.categoryId.toString());
        if (filter.available !== undefined) params = params.set('available', filter.available.toString());
        if (filter.page !== undefined) params = params.set('page', filter.page.toString());
        if (filter.size) params = params.set('size', filter.size.toString());
        if (filter.sort) params = params.set('sort', filter.sort);

        return this.http.get<any>(`${this.apiUrl}`, { params });
    }

    getItemById(id: number): Observable<MenuItem> {
        return this.http.get<MenuItem>(`${this.apiUrl}/${id}`);
    }

    createItem(request: CreateMenuItemRequest): Observable<MenuItem> {
        return this.http.post<MenuItem>(`${this.apiUrl}`, request);
    }

    updateItem(id: number, request: UpdateMenuItemRequest): Observable<MenuItem> {
        return this.http.put<MenuItem>(`${this.apiUrl}/${id}`, request);
    }

    deleteItem(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getAvailableItems(): Observable<MenuItem[]> {
        return this.http.get<MenuItem[]>(`${this.apiUrl}/available`);
    }

    getItemsByCategory(categoryId: number): Observable<MenuItem[]> {
        return this.http.get<MenuItem[]>(`${this.apiUrl}/category/${categoryId}`);
    }

    getRecentlyUpdated(limit: number = 5): Observable<MenuItem[]> {
        return this.http.get<MenuItem[]>(`${this.apiUrl}/recent`, {
            params: new HttpParams().set('limit', limit.toString())
        });
    }
}
