import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
    Reservation, 
    CreateReservationRequest, 
    UpdateReservationRequest, 
    ReservationResponse 
} from '../models/reservation/reservation.model';

@Injectable({
    providedIn: 'root'
})
export class ReservationService {
    private readonly API_URL = `${environment.apiUrl}/api/reservations`;

    constructor(private http: HttpClient) { }

    getAllReservations(
        name?: string,
        startDate?: string,
        endDate?: string,
        status?: string,
        page: number = 0,
        size: number = 10
    ): Observable<{ content: ReservationResponse[], totalElements: number }> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (name) params = params.set('name', name);
        if (startDate) params = params.set('startDate', startDate);
        if (endDate) params = params.set('endDate', endDate);
        if (status) params = params.set('status', status);

        return this.http.get<{ content: ReservationResponse[], totalElements: number }>(
            this.API_URL,
            { params }
        );
    }

    getReservationById(id: number): Observable<ReservationResponse> {
        return this.http.get<ReservationResponse>(`${this.API_URL}/${id}`);
    }

    createReservation(request: CreateReservationRequest): Observable<ReservationResponse> {
        return this.http.post<ReservationResponse>(this.API_URL, request);
    }

    updateReservation(id: number, request: UpdateReservationRequest): Observable<ReservationResponse> {
        return this.http.put<ReservationResponse>(`${this.API_URL}/${id}`, request);
    }

    deleteReservation(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

    getRecentReservations(limit: number = 5): Observable<ReservationResponse[]> {
        return this.http.get<ReservationResponse[]>(`${this.API_URL}/recent?limit=${limit}`);
    }

    updateReservationStatus(id: number, status: 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO'): Observable<ReservationResponse> {
        return this.http.patch<ReservationResponse>(`${this.API_URL}/${id}/status`, { status });
    }
}