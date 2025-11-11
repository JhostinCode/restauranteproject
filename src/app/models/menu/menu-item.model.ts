import { MenuCategory } from './menu-category.model';

export interface MenuItem {
    id?: number;
    name: string;
    price: number;
    description?: string;
    imagePath?: string;
    category: MenuCategory;
    available: boolean;
}

export interface CreateMenuItemRequest {
    name: string;
    price: number;
    description?: string;
    categoryId: number;
    available?: boolean;
    imagePath?: string;  // Cambiado de image?: File a imagePath?: string
}

export interface UpdateMenuItemRequest {
    name?: string;
    price?: number;
    description?: string;
    categoryId?: number;
    available?: boolean;
    imagePath?: string;  // Cambiado de image?: File a imagePath?: string
}

export interface MenuItemFilter {
    name?: string;
    categoryId?: number;
    available?: boolean;
    page?: number;
    size?: number;
    sort?: string;
}
