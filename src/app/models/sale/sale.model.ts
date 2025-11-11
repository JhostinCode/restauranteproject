import { MenuItem } from '../menu/menu-item.model';

export interface SaleItem {
    id: number;
    menuItem: MenuItem;
    priceAtTime: number;
    createdAt: Date;
}

export interface Sale {
    id?: number;
    name: string;
    description?: string;
    saleDate: Date;
    items: SaleItem[];
    totalPrice: number;
}

export interface CreateSaleRequest {
    name: string;
    description?: string;
    itemIds: number[];
}

export interface UpdateSaleRequest {
    name?: string;
    description?: string;
    itemIds?: number[];
}

export interface SaleFilter {
    name?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    size?: number;
    sort?: string;
}

export interface SaleResponse {
    id: number;
    name: string;
    description?: string;
    saleDate: Date;
    items: SaleItem[];
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}
