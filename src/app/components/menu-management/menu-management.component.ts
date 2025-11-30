import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItemService } from '../../services/menu-item.service';
import { MenuCategoryService } from '../../services/menu-category.service';
import { MenuItem } from '../../models/menu/menu-item.model';
import { MenuCategory } from '../../models/menu/menu-category.model';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-menu-management',
  templateUrl: './menu-management.component.html',
  styleUrls: ['./menu-management.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class MenuManagementComponent implements OnInit, AfterViewInit {
  menuItems: MenuItem[] = [];
  categories: MenuCategory[] = [];
  selectedItem: MenuItem | null = null;
  errorMessage: string | null = null;

  itemForm: FormGroup;
  categoryForm: FormGroup;

  private modals: { [key: string]: Modal } = {};
  private modalInitialized = false;

  constructor(
    private menuItemService: MenuItemService,
    private categoryService: MenuCategoryService,
    private fb: FormBuilder
  ) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      categoryId: [null, Validators.required],
      imagePath: [''],
      available: [true]
    });

    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMenuItems();
    this.loadCategories();
    this.setupTabListener();
  }

  ngAfterViewInit(): void {
    // Intentar inicializar modales si el tab está activo
    if (document.querySelector('#menu-tab-pane.active')) {
      this.initializeModals();
    }
  }

  private setupTabListener(): void {
    const menuTab = document.querySelector('#menu-tab');
    if (menuTab) {
      menuTab.addEventListener('shown.bs.tab', () => {
        if (!this.modalInitialized) {
          setTimeout(() => {
            this.initializeModals();
          }, 100);
        }
      });
    }
  }

  private initializeModals(): void {
    const modalIds = ['itemDetailsModal', 'editItemModal', 'deleteItemModal', 'menuNewItemModal', 'categoryModal'];
    modalIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        this.modals[id] = new Modal(element, {
          backdrop: 'static',
          keyboard: false
        });
        this.modalInitialized = true;
      } else {
        console.error(`Modal element with id ${id} not found`);
      }
    });
  }

  private loadMenuItems(): void {
    this.menuItemService.getAllItems().subscribe({
      next: (response) => {
        this.menuItems = response.content;
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Error loading menu items:', error);
        this.errorMessage = 'Error al cargar los items del menú';
      }
    });
  }

  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Error al cargar las categorías';
      }
    });
  }

  viewDetails(item: MenuItem): void {
    this.selectedItem = item;
    if (!this.modalInitialized) {
      this.initializeModals();
    }
    if (this.modals['itemDetailsModal']) {
      this.modals['itemDetailsModal'].show();
    }
  }

  editItem(item: MenuItem): void {
    this.selectedItem = item;
    this.itemForm.patchValue({
      name: item.name,
      price: item.price,
      description: item.description,
      categoryId: item.category.id,
      imagePath: item.imagePath,
      available: item.available
    });
    if (!this.modalInitialized) {
      this.initializeModals();
    }
    if (this.modals['editItemModal']) {
      this.modals['editItemModal'].show();
    }
  }

  confirmDelete(item: MenuItem): void {
    this.selectedItem = item;
    if (!this.modalInitialized) {
      this.initializeModals();
    }
    if (this.modals['deleteItemModal']) {
      this.modals['deleteItemModal'].show();
    }
  }

  deleteItem(): void {
    if (this.selectedItem?.id) {
      this.menuItemService.deleteItem(this.selectedItem.id).subscribe({
        next: () => {
          this.loadMenuItems();
          if (this.modals['deleteItemModal']) {
            this.modals['deleteItemModal'].hide();
          }
          this.errorMessage = null;
        },
        error: (error) => {
          console.error('Error deleting item:', error);
          this.errorMessage = 'Error al eliminar el item';
        }
      });
    }
  }

  openNewItemModal(): void {
    this.selectedItem = null;
    this.itemForm.reset({
      name: '',
      price: 0,
      description: '',
      categoryId: null,
      imagePath: '',
      available: true
    });
    if (!this.modalInitialized) {
      this.initializeModals();
    }
    if (this.modals['menuNewItemModal']) {
      this.modals['menuNewItemModal'].show();
    } else {
      console.error('New item modal not initialized');
    }
  }

  openCategoryModal(): void {
    this.categoryForm.reset();
    this.errorMessage = null;
    if (!this.modalInitialized) {
      this.initializeModals();
    }
    if (this.modals['categoryModal']) {
      this.modals['categoryModal'].show();
    }
  }

  createCategory(): void {
    if (this.categoryForm.valid) {
      this.categoryService.createCategory(this.categoryForm.value).subscribe({
        next: () => {
          this.loadCategories();
          if (this.modals['categoryModal']) {
            this.modals['categoryModal'].hide();
          }
          this.errorMessage = null;
        },
        error: (error) => {
          console.error('Error creating category:', error);
          this.errorMessage = 'Error al crear la categoría';
        }
      });
    }
  }

  saveItem(): void {
    if (this.itemForm.valid) {
      const formValue = this.itemForm.value;
      console.log('Saving item with data:', formValue);

      const saveOperation = this.selectedItem
        ? this.menuItemService.updateItem(this.selectedItem.id!, formValue)
        : this.menuItemService.createItem(formValue);

      saveOperation.subscribe({
        next: () => {
          this.loadMenuItems();
          this.closeCurrentModal();
          this.errorMessage = null;
        },
        error: (error) => {
          console.error('Error saving item:', error);
          this.errorMessage = 'Error al guardar el item';
        }
      });
    }
  }

  toggleAvailability(item: MenuItem): void {
    const updatedItem = {
      available: !item.available
    };
    
    this.menuItemService.updateItem(item.id!, updatedItem).subscribe({
      next: () => {
        this.loadMenuItems();
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Error toggling availability:', error);
        this.errorMessage = 'Error al cambiar la disponibilidad';
      }
    });
  }

  private closeCurrentModal(): void {
    if (this.selectedItem && this.modals['editItemModal']) {
      this.modals['editItemModal'].hide();
    } else if (this.modals['menuNewItemModal']) {
      this.modals['menuNewItemModal'].hide();
    }
  }
}
