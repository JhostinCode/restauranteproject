import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioComponent } from '../../components/inventario/inventario.component';
import { DashboardNavComponent } from '../../components/dashboard-nav/dashboard-nav.component';
import { MenuManagementComponent } from '../../components/menu-management/menu-management.component';
import { SalesManagementComponent } from '../../components/sales/sales-management.component';
import { ReservationManagementComponent } from '../../components/reservations/reservation-management.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule, 
        InventarioComponent, 
        DashboardNavComponent,
        MenuManagementComponent,
        SalesManagementComponent,
        ReservationManagementComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
