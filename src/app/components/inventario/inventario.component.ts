import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { MeasurementUnitService } from '../../services/measurement-unit.service';
import { 
  InventoryItem,
  CreateInventoryItemRequest,
  UpdateInventoryItemRequest,
  StockOperationRequest
} from '../../models/inventory/inventory-item.model';
import { MeasurementUnit } from '../../models/inventory/measurement-unit.model';
import { Modal } from 'bootstrap';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class InventarioComponent implements OnInit {
  inventoryItems: InventoryItem[] = [];
  lowStockItems: InventoryItem[] = [];
  measurementUnits: MeasurementUnit[] = [];
  selectedItem: InventoryItem | null = null;
  stockThreshold: number = 10;
  lastUpdate$ = new BehaviorSubject<Date>(new Date());

  editForm: FormGroup;
  newItemForm: FormGroup;

  private modals: { [key: string]: Modal } = {};

  constructor(
    private inventoryService: InventoryService,
    private measurementUnitService: MeasurementUnitService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      stockAdjustment: [0, [Validators.required, Validators.min(0)]],
      measurementUnitId: [null]
    });

    this.newItemForm = this.fb.group({
      name: ['', Validators.required],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      hasMeasurementUnit: [false],
      measurementUnitId: [null]
    });
  }

  ngOnInit(): void {
    this.loadInventory();
    this.loadMeasurementUnits();
    this.initializeModals();
  }

  private initializeModals(): void {
    ['detailsModal', 'editModal', 'deleteModal', 'newItemModal'].forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        this.modals[id] = new Modal(element);
      }
    });
  }

  private loadInventory(): void {
    this.inventoryService.getAllItems().subscribe(response => {
      this.inventoryItems = response.content;
      this.lastUpdate$.next(new Date());
    });
  }

  private loadMeasurementUnits(): void {
    this.measurementUnitService.getAllUnits().subscribe(units => {
      this.measurementUnits = units;
    });
  }

  searchBelowStock(): void {
    if (this.stockThreshold > 0) {
      this.inventoryService.getItemsBelowStock(this.stockThreshold).subscribe(items => {
        this.lowStockItems = items;
      });
    }
  }

  viewDetails(item: InventoryItem): void {
    this.selectedItem = item;
    this.modals['detailsModal']?.show();
  }

  editItem(item: InventoryItem): void {
    this.selectedItem = item;
    this.editForm.patchValue({
      name: item.name,
      stockAdjustment: 0,
      measurementUnitId: item.measurementUnit?.id
    });
    this.modals['editModal']?.show();
  }

  adjustStock(operation: 'increase' | 'decrease'): void {
    if (this.selectedItem) {
      const amount = this.editForm.get('stockAdjustment')?.value || 0;
      if (amount > 0) {
        const request: StockOperationRequest = {
          operation,
          amount
        };
        this.inventoryService.updateStock(this.selectedItem.id!, request).subscribe(updatedItem => {
          this.loadInventory();
          this.selectedItem = updatedItem;
        });
      }
    }
  }

  saveChanges(): void {
    if (this.selectedItem && this.editForm.valid) {
      const updates: UpdateInventoryItemRequest = {
        name: this.editForm.get('name')?.value,
        measurementUnitId: this.editForm.get('measurementUnitId')?.value
      };
      this.inventoryService.updateItem(this.selectedItem.id!, updates).subscribe(() => {
        this.loadInventory();
        this.modals['editModal']?.hide();
      });
    }
  }

  confirmDelete(item: InventoryItem): void {
    this.selectedItem = item;
    this.modals['deleteModal']?.show();
  }

  deleteItem(): void {
    if (this.selectedItem?.id) {
      this.inventoryService.deleteItem(this.selectedItem.id).subscribe(() => {
        this.loadInventory();
        this.modals['deleteModal']?.hide();
      });
    }
  }

  openNewItemModal(): void {
    this.newItemForm.reset({
      name: '',
      unitPrice: 0,
      stock: 0,
      hasMeasurementUnit: false,
      measurementUnitId: null
    });
    this.modals['newItemModal']?.show();
  }

  createItem(): void {
    if (this.newItemForm.valid) {
      const formValue = this.newItemForm.value;
      const newItem: CreateInventoryItemRequest = {
        name: formValue.name,
        unitPrice: formValue.unitPrice,
        stock: formValue.stock,
        measurementUnitId: formValue.hasMeasurementUnit ? formValue.measurementUnitId : null
      };
      this.inventoryService.createItem(newItem).subscribe(() => {
        this.loadInventory();
        this.modals['newItemModal']?.hide();
      });
    }
  }
}
