import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { MenuComponent } from './pages/menu/menu.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { UserRole } from './models/user.model';
import { OrderManagementComponent } from './pages/orders/order-management.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { ReservationManagementComponent } from './components/reservations/reservation-management.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'reserva', component: ReservationComponent },
    { 
        path: 'auth',
        loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'admin',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        data: { role: UserRole.ADMIN },
        children: [
            { 
                path: 'dashboard', 
                component: DashboardComponent,
                canActivate: [AuthGuard],
                data: { role: UserRole.ADMIN }
            },
            { 
                path: 'reservations', 
                component: ReservationManagementComponent,
                canActivate: [AuthGuard],
                data: { role: UserRole.ADMIN }
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    {
        path: 'waiter',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        data: { role: UserRole.CAMARERO },
        children: [
            { 
                path: 'orders', 
                component: OrderManagementComponent,
                canActivate: [AuthGuard],
                data: { role: UserRole.CAMARERO }
            },
            { path: '', redirectTo: 'orders', pathMatch: 'full' }
        ]
    },
    {
        path: 'kitchen',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        data: { role: UserRole.COCINERO },
        children: [
            { 
                path: 'orders', 
                component: DashboardComponent,
                canActivate: [AuthGuard],
                data: { role: UserRole.COCINERO }
            },
            { path: '', redirectTo: 'orders', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: '' }
];
