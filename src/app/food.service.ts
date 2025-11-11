import { Injectable } from '@angular/core';
import { menuItem } from './menuItem.models';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  private menuItems: {
    burger: menuItem[];
    pizza: menuItem[];
    drinks: menuItem[];
  } = { burger: [
  { name: 'Veggies & Cheese', price: 10.0, image_path:"burger (8)" },
  { name: 'Doble', price: 10.0, image_path:"burger (4)" },
  { name: 'La gordita', price: 10.0, image_path:"burger (9)" },
  { name: 'Cheese burger', price: 15.0, image_path:"burger (2)" },
  { name: 'Sobredosis', price: 10.0, image_path:"burger (11)" },
  { name: 'La huevona', price: 10.0, image_path:"burger (3)" },
  { name: 'Clásica', price: 10.0, image_path:"burger (7)" },
  { name: 'La grandota', price: 16.0, image_path:"burger (5)" },
  { name: 'La vegana', price: 10.0, image_path:"burger (6)" }], pizza: [], drinks: [] };
  constructor() {}
  getItems() {
    return this.menuItems;
  }
  addItem(item: menuItem, category: 'burger' | 'pizza' | 'drinks') {
    this.menuItems[category].push(item);
  }
}
