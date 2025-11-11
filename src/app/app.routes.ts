import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { MenuComponent } from './pages/menu/menu.component';
import { ReservationComponent } from './pages/reservation/reservation.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'reserva', component: ReservationComponent },
    { path: '**', redirectTo: '' }
];
