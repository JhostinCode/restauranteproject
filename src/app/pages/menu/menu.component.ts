import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../models/menu/menu-item.model';
import { MenuCategory } from '../../models/menu/menu-category.model';
import { MenuItemService } from '../../services/menu-item.service';
import { MenuCategoryService } from '../../services/menu-category.service';
import { firstValueFrom } from 'rxjs';

interface MenuItemsByCategory {
  [categoryId: number]: {
    name: string;
    items: MenuItem[];
  };
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  itemsByCategory: MenuItemsByCategory = {};
  categories: MenuCategory[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private menuItemService: MenuItemService,
    private categoryService: MenuCategoryService
  ) {}

  ngOnInit(): void {
    this.loadMenu();
  }

  private async loadMenu() {
    try {
      // Cargar categorías
      const categories = await firstValueFrom(this.categoryService.getAllCategories());
      this.categories = categories;
      
      // Inicializar estructura de items por categoría
      this.categories.forEach(category => {
        if (category.id) {
          this.itemsByCategory[category.id] = {
            name: category.name,
            items: []
          };
        }
      });

      // Cargar items disponibles
      const items = await firstValueFrom(this.menuItemService.getAvailableItems());
      
      // Organizar items por categoría
      items.forEach(item => {
        const categoryId = item.category.id;
        if (categoryId && this.itemsByCategory[categoryId]) {
          this.itemsByCategory[categoryId].items.push(item);
        }
      });

      this.loading = false;
    } catch (err) {
      this.error = 'Error al cargar el menú';
      this.loading = false;
      console.error('Error loading menu:', err);
    }
  }

  getCategoryIds(): number[] {
    return Object.keys(this.itemsByCategory).map(Number);
  }

  formatPrice(price: number): string {
    return `S/. ${price.toFixed(2)}`;
  }
}
