import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderSummary, OrderStatus, OrderType } from '../models/order.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly API_URL = `${environment.apiUrl}/api/orders`;

  constructor(private http: HttpClient) { }

  // Obtener todas las órdenes con paginación
  getOrders(page: number = 0, size: number = 10): Observable<{ content: Order[], totalElements: number }> {
    return this.http.get<{ content: Order[], totalElements: number }>(
      `${this.API_URL}?page=${page}&size=${size}`
    );
  }

  // Obtener órdenes filtradas por estado
  getOrdersByStatus(status: OrderStatus, page: number = 0, size: number = 10): Observable<{ content: Order[], totalElements: number }> {
    return this.http.get<{ content: Order[], totalElements: number }>(
      `${this.API_URL}/status/${status}?page=${page}&size=${size}`
    );
  }

  // Obtener órdenes por tipo
  getOrdersByType(type: OrderType, page: number = 0, size: number = 10): Observable<{ content: Order[], totalElements: number }> {
    return this.http.get<{ content: Order[], totalElements: number }>(
      `${this.API_URL}/type/${type}?page=${page}&size=${size}`
    );
  }

  // Crear nueva orden
  createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Observable<Order> {
    return this.http.post<Order>(this.API_URL, order);
  }

  // Actualizar estado de una orden
  updateOrderStatus(orderId: number, status: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${this.API_URL}/${orderId}/status`, { status });
  }

  // Obtener una orden específica
  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}/${orderId}`);
  }

  // Obtener resumen de órdenes (métricas)
  getOrdersSummary(startDate?: Date, endDate?: Date): Observable<OrderSummary> {
    let url = `${this.API_URL}/summary`;
    if (startDate && endDate) {
      url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
    }
    return this.http.get<OrderSummary>(url);
  }

  // Obtener órdenes por mesa
  getOrdersByTable(tableNumber: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API_URL}/table/${tableNumber}`);
  }

  // Cancelar una orden
  cancelOrder(orderId: number, reason: string): Observable<Order> {
    return this.http.patch<Order>(`${this.API_URL}/${orderId}/cancel`, { reason });
  }

  // Obtener órdenes del día actual
  getTodayOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API_URL}/today`);
  }

  // Obtener órdenes pendientes para cocina
  getPendingKitchenOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API_URL}/kitchen/pending`);
  }
}
