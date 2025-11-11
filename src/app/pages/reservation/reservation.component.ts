import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { CreateReservationRequest } from '../../models/reservation/reservation.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-reservation',
    templateUrl: './reservation.component.html',
    styleUrls: ['./reservation.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class ReservationComponent implements OnInit {
    nombre: string = '';
    telefono: string = '';
    fecha: string = '';
    hora: string = '';
    cantidad: number = 1;
    errorMessage: string | null = null;
    successMessage: string | null = null;
    isLoading: boolean = false;
    today: string;

    constructor(
        private reservationService: ReservationService,
        private router: Router
    ) {
        // Formatear la fecha actual para el atributo min del input date
        const now = new Date();
        this.today = now.toISOString().split('T')[0];
    }

    ngOnInit(): void {
        // Establecer la fecha por defecto como hoy
        this.fecha = this.today;
        
        // Establecer la hora por defecto como la próxima hora disponible
        const currentHour = new Date().getHours();
        const nextHour = currentHour + 1;
        this.hora = `${nextHour.toString().padStart(2, '0')}:00`;
    }

    onSubmit(): void {
        if (!this.isFormValid()) {
            this.errorMessage = 'Por favor, complete todos los campos correctamente';
            return;
        }

        this.isLoading = true;
        this.errorMessage = null;
        this.successMessage = null;

        const request: CreateReservationRequest = {
            name: this.nombre,
            phone: this.telefono,
            date: this.fecha,
            time: this.hora,
            guests: this.cantidad
        };

        this.reservationService.createReservation(request).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.successMessage = '¡Reserva creada exitosamente! Nos pondremos en contacto contigo pronto.';
                this.resetForm();
                setTimeout(() => {
                    this.router.navigate(['/']);
                }, 3000);
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = error.error?.message || 'Error al crear la reserva. Por favor, intente nuevamente.';
            }
        });
    }

    private isFormValid(): boolean {
        return !!(
            this.nombre &&
            this.telefono &&
            this.fecha &&
            this.hora &&
            this.cantidad > 0 &&
            this.cantidad <= 20 &&
            this.isValidPhoneNumber(this.telefono) &&
            this.isValidDate(this.fecha) &&
            this.isValidTime(this.hora)
        );
    }

    private isValidPhoneNumber(phone: string): boolean {
        return /^[0-9]{9}$/.test(phone);
    }

    private isValidDate(date: string): boolean {
        const selectedDate = new Date(date);
        const today = new Date(this.today);
        return selectedDate >= today;
    }

    private isValidTime(time: string): boolean {
        if (!time) return false;
        
        const [hours, minutes] = time.split(':').map(Number);
        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
    }

    private resetForm(): void {
        this.nombre = '';
        this.telefono = '';
        this.fecha = this.today;
        const nextHour = new Date().getHours() + 1;
        this.hora = `${nextHour.toString().padStart(2, '0')}:00`;
        this.cantidad = 1;
    }
}