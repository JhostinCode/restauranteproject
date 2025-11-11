import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MeasurementUnit, CreateMeasurementUnitRequest, UpdateMeasurementUnitRequest } from '../models/inventory/measurement-unit.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeasurementUnitService {
  private apiUrl = `${environment.apiUrl}/api/inventory/units`;

  constructor(private http: HttpClient) {}

  getAllUnits(): Observable<MeasurementUnit[]> {
    return this.http.get<MeasurementUnit[]>(this.apiUrl);
  }

  getUnitById(id: number): Observable<MeasurementUnit> {
    return this.http.get<MeasurementUnit>(`${this.apiUrl}/${id}`);
  }

  createUnit(request: CreateMeasurementUnitRequest): Observable<MeasurementUnit> {
    return this.http.post<MeasurementUnit>(this.apiUrl, request);
  }

  updateUnit(id: number, request: UpdateMeasurementUnitRequest): Observable<MeasurementUnit> {
    return this.http.put<MeasurementUnit>(`${this.apiUrl}/${id}`, request);
  }

  deleteUnit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
