import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
    MenuCategory, 
    CreateMenuCategoryRequest, 
    UpdateMenuCategoryRequest 
} from '../models/menu/menu-category.model';

@Injectable({
    providedIn: 'root'
})
export class MenuCategoryService {
    private apiUrl = `${environment.apiUrl}/api/menu/categories`;

    constructor(private http: HttpClient) {}

    getAllCategories(): Observable<MenuCategory[]> {
        return this.http.get<MenuCategory[]>(this.apiUrl);
    }

    getCategoryById(id: number): Observable<MenuCategory> {
        return this.http.get<MenuCategory>(`${this.apiUrl}/${id}`);
    }

    createCategory(request: CreateMenuCategoryRequest): Observable<MenuCategory> {
        return this.http.post<MenuCategory>(this.apiUrl, request);
    }

    updateCategory(id: number, request: UpdateMenuCategoryRequest): Observable<MenuCategory> {
        return this.http.put<MenuCategory>(`${this.apiUrl}/${id}`, request);
    }

    deleteCategory(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
