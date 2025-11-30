import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus, OrderType } from '../../models/order.model';
import { menuItem } from '../../menuItem.models';
import { FoodService } from '../../food.service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class OrderManagementComponent implements OnInit {
  orderForm: FormGroup;
  menuItems: menuItem[] = [];
  currentOrders: Order[] = [];
  loading = false;
  error = '';
  OrderStatus = OrderStatus; // Para usar en el template

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private foodService: FoodService
  ) {
    this.orderForm = this.fb.group({
      tableNumber: ['', [Validators.required, Validators.min(1)]],
      type: [OrderType.DINE_IN, Validators.required],
      customerName: [''],
      customerPhone: [''],
      items: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadMenuItems();
    this.loadCurrentOrders();
  }

  private loadMenuItems() {
    const items = this.foodService.getItems();
    this.menuItems = [
      ...items.burger,
      ...items.pizza,
      ...items.drinks
    ];
  }

  private loadCurrentOrders() {
    this.loading = true;
    this.orderService.getTodayOrders().subscribe({
      next: (orders) => {
        this.currentOrders = orders;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las órdenes';
        this.loading = false;
      }
    });
  }

  get orderItems() {
    return this.orderForm.get('items') as FormArray;
  }

  addItemToOrder(item: menuItem) {
    this.orderItems.push(this.fb.group({
      item: [item],
      quantity: [1, [Validators.required, Validators.min(1)]],
      notes: ['']
    }));
  }

  removeItemFromOrder(index: number) {
    this.orderItems.removeAt(index);
  }

  submitOrder() {
    if (this.orderForm.valid) {
      this.loading = true;
      const orderData = this.orderForm.value;
      
      // Calcular el total y preparar los items
      const items = orderData.items.map((item: any) => ({
        item: item.item,
        quantity: item.quantity,
        subtotal: item.item.price * item.quantity,
        notes: item.notes
      }));

      const total = items.reduce((sum: number, item: any) => sum + item.subtotal, 0);

      const order = {
        tableNumber: orderData.tableNumber,
        type: orderData.type,
        customerName: orderData.customerName || null,
        customerPhone: orderData.customerPhone || null,
        items,
        total,
        status: OrderStatus.PENDING
      };

      this.orderService.createOrder(order).subscribe({
        next: () => {
          this.loading = false;
          this.orderForm.reset();
          this.loadCurrentOrders();
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Error al crear la orden';
        }
      });
    }
  }

  updateOrderStatus(orderId: number, status: OrderStatus) {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.loadCurrentOrders();
      },
      error: (err) => {
        this.error = 'Error al actualizar el estado de la orden';
      }
    });
  }
}
