import { User } from './user.model';
import { menuItem } from '../menuItem.models';

export interface Order {
    id?: number;
    tableNumber?: number;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    type: OrderType;
    waiter?: User;
    customerName?: string;
    customerPhone?: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface OrderItem {
    item: menuItem;
    quantity: number;
    subtotal: number;
    notes?: string;
}

export enum OrderStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    READY = 'READY',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export enum OrderType {
    DINE_IN = 'DINE_IN',
    DELIVERY = 'DELIVERY',
    PICKUP = 'PICKUP'
}

export interface OrderSummary {
    totalOrders: number;
    totalAmount: number;
    ordersByStatus: {
        [key in OrderStatus]: number;
    };
    ordersByType: {
        [key in OrderType]: number;
    };
}
