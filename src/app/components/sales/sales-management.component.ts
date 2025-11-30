import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SaleService } from '../../services/sale.service';
import { MenuItemService } from '../../services/menu-item.service';
import { AuthService } from '../../services/auth.service';
import { Sale, SaleResponse, CreateSaleRequest, UpdateSaleRequest, SaleItem } from '../../models/sale/sale.model';
import { MenuItem } from '../../models/menu/menu-item.model';
import { Modal } from 'bootstrap';

interface TempSaleItem {
    menuItem: MenuItem;
    quantity: number;
}

@Component({
    selector: 'app-sales-management',
    templateUrl: './sales-management.component.html',
    styleUrls: ['./sales-management.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DecimalPipe,
        DatePipe
    ]
})
export class SalesManagementComponent implements OnInit {
    sales: SaleResponse[] = [];
    menuItems: MenuItem[] = [];
    selectedSale: SaleResponse | null = null;
    errorMessage: string | null = null;
    saleItems: TempSaleItem[] = [];

    saleForm: FormGroup;
    private modals: { [key: string]: Modal } = {};
    private modalInitialized = false;

    constructor(
        private saleService: SaleService,
        private menuItemService: MenuItemService,
        private authService: AuthService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.saleForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: ['']
        });
    }

    ngOnInit(): void {
        if (!this.authService.isAuthenticated() || !this.authService.isAdmin()) {
            this.router.navigate(['/auth/login']);
            return;
        }
        this.loadSales();
        this.loadMenuItems();
        this.initializeModals();
    }

    private initializeModals(): void {
        const modalIds = ['saleDetailsModal', 'editSaleModal', 'deleteSaleModal', 'newSaleModal'];
        modalIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                this.modals[id] = new Modal(element, {
                    backdrop: 'static',
                    keyboard: false
                });
                this.modalInitialized = true;
            }
        });
    }

    private loadSales(): void {
        this.saleService.getAllSales().subscribe({
            next: (response) => {
                this.sales = response.content;
                this.errorMessage = null;
            },
            error: (error) => {
                console.error('Error loading sales:', error);
                if (error.status === 401 || error.status === 403) {
                    this.router.navigate(['/auth/login']);
                }
                this.errorMessage = 'Error al cargar las ventas';
            }
        });
    }

    private loadMenuItems(): void {
        this.menuItemService.getAllItems().subscribe({
            next: (response) => {
                console.log('Menu items loaded:', response);
                this.menuItems = response.content;
            },
            error: (error) => {
                console.error('Error loading menu items:', error);
                this.errorMessage = 'Error al cargar los items del menú';
            }
        });
    }

    addItemToSale(item: MenuItem): void {
        console.log('Adding item to sale:', item);
        const existingItem = this.saleItems.find(si => si.menuItem.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.saleItems.push({ menuItem: item, quantity: 1 });
        }
        console.log('Current sale items:', this.saleItems);
    }

    removeItemFromSale(item: MenuItem): void {
        console.log('Removing item from sale:', item);
        const existingItem = this.saleItems.find(si => si.menuItem.id === item.id);
        if (existingItem) {
            if (existingItem.quantity > 1) {
                existingItem.quantity--;
            } else {
                this.saleItems = this.saleItems.filter(si => si.menuItem.id !== item.id);
            }
        }
        console.log('Current sale items:', this.saleItems);
    }

    getItemQuantity(item: MenuItem): number {
        const existingItem = this.saleItems.find(si => si.menuItem.id === item.id);
        return existingItem ? existingItem.quantity : 0;
    }

    calculateTotal(): number {
        return this.saleItems.reduce((total, item) => {
            return total + (Number(item.menuItem.price) * item.quantity);
        }, 0);
    }

    openNewSaleModal(): void {
        this.selectedSale = null;
        this.saleItems = [];
        this.saleForm.reset({
            name: '',
            description: ''
        });
        this.modals['newSaleModal']?.show();
    }

    viewSaleDetails(sale: SaleResponse): void {
        this.selectedSale = sale;
        this.modals['saleDetailsModal']?.show();
    }

    editSale(sale: SaleResponse): void {
        this.selectedSale = sale;
        
        // Agrupar items repetidos y contar cantidades
        const itemMap = new Map<number, TempSaleItem>();
        sale.items.forEach(item => {
            const menuItemId = item.menuItem.id!;
            if (itemMap.has(menuItemId)) {
                const existingItem = itemMap.get(menuItemId)!;
                existingItem.quantity++;
            } else {
                itemMap.set(menuItemId, {
                    menuItem: item.menuItem,
                    quantity: 1
                });
            }
        });
        
        this.saleItems = Array.from(itemMap.values());
        
        this.saleForm.patchValue({
            name: sale.name,
            description: sale.description
        });
        this.modals['editSaleModal']?.show();
    }

    confirmDelete(sale: SaleResponse): void {
        this.selectedSale = sale;
        this.modals['deleteSaleModal']?.show();
    }

    deleteSale(): void {
        if (this.selectedSale?.id) {
            this.saleService.deleteSale(this.selectedSale.id).subscribe({
                next: () => {
                    this.loadSales();
                    this.modals['deleteSaleModal']?.hide();
                    this.errorMessage = null;
                },
                error: (error) => {
                    console.error('Error deleting sale:', error);
                    if (error.status === 401 || error.status === 403) {
                        this.router.navigate(['/auth/login']);
                    }
                    this.errorMessage = 'Error al eliminar la venta';
                }
            });
        }
    }

    saveSale(): void {
        if (this.saleForm.valid && this.saleItems.length > 0) {
            const itemIds: number[] = [];
            this.saleItems.forEach(item => {
                for (let i = 0; i < item.quantity; i++) {
                    itemIds.push(item.menuItem.id!);
                }
            });

            const request = {
                name: this.saleForm.get('name')?.value,
                description: this.saleForm.get('description')?.value,
                itemIds: itemIds
            };

            console.log('Saving sale with request:', request);

            const saveOperation = this.selectedSale
                ? this.saleService.updateSale(this.selectedSale.id!, request)
                : this.saleService.createSale(request);

            saveOperation.subscribe({
                next: () => {
                    this.loadSales();
                    this.closeCurrentModal();
                    this.errorMessage = null;
                },
                error: (error) => {
                    console.error('Error saving sale:', error);
                    if (error.status === 401 || error.status === 403) {
                        this.router.navigate(['/auth/login']);
                    }
                    this.errorMessage = 'Error al guardar la venta';
                }
            });
        }
    }

    private closeCurrentModal(): void {
        if (this.selectedSale) {
            this.modals['editSaleModal']?.hide();
        } else {
            this.modals['newSaleModal']?.hide();
        }
    }
}
