import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
    Sale,
    CreateSaleRequest,
    UpdateSaleRequest,
    SaleFilter,
    SaleResponse
} from '../models/sale/sale.model';

@Injectable({
    providedIn: 'root'
})
export class SaleService {
    private apiUrl = `${environment.apiUrl}/api/sales`;

    constructor(private http: HttpClient) {}

    getAllSales(filter: SaleFilter = {}): Observable<any> {
        let params = new HttpParams();
        
        if (filter.name) params = params.set('name', filter.name);
        if (filter.startDate) params = params.set('startDate', filter.startDate.toISOString());
        if (filter.endDate) params = params.set('endDate', filter.endDate.toISOString());
        if (filter.page !== undefined) params = params.set('page', filter.page.toString());
        if (filter.size) params = params.set('size', filter.size.toString());
        if (filter.sort) params = params.set('sort', filter.sort);

        return this.http.get<any>(`${this.apiUrl}`, { params });
    }

    getSaleById(id: number): Observable<SaleResponse> {
        return this.http.get<SaleResponse>(`${this.apiUrl}/${id}`);
    }

    createSale(request: CreateSaleRequest): Observable<SaleResponse> {
        console.log('Creating sale with request:', request);
        return this.http.post<SaleResponse>(`${this.apiUrl}`, request);
    }

    updateSale(id: number, request: UpdateSaleRequest): Observable<SaleResponse> {
        console.log('Updating sale with request:', request);
        return this.http.put<SaleResponse>(`${this.apiUrl}/${id}`, request);
    }

    deleteSale(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getRecentSales(limit: number = 5): Observable<SaleResponse[]> {
        return this.http.get<SaleResponse[]>(`${this.apiUrl}/recent`, {
            params: new HttpParams().set('limit', limit.toString())
        });
    }
}
