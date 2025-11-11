import { MeasurementUnit } from './measurement-unit.model';

export interface InventoryItem {
    id?: number;
    name: string;
    unitPrice: number;
    stock: number;
    measurementUnit?: MeasurementUnit;
    totalPrice?: number;
    lastUpdated?: Date;
    createdAt?: Date;
}

export interface CreateInventoryItemRequest {
    name: string;
    unitPrice: number;
    stock: number;
    measurementUnitId?: number;
}

export interface UpdateInventoryItemRequest {
    name?: string;
    unitPrice?: number;
    measurementUnitId?: number;
}

export interface StockOperationRequest {
    operation: 'increase' | 'decrease';
    amount: number;
}

export interface InventoryFilter {
    name?: string;
    measurementUnitId?: number;
    minStock?: number;
    maxStock?: number;
    page?: number;
    size?: number;
    sort?: string;
}
