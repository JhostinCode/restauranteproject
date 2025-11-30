import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { ReservationResponse } from '../../models/reservation/reservation.model';
import { Modal } from 'bootstrap';

@Component({
    selector: 'app-reservation-management',
    templateUrl: './reservation-management.component.html',
    styleUrls: ['./reservation-management.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ReservationManagementComponent implements OnInit {
    reservations: ReservationResponse[] = [];
    selectedReservation: ReservationResponse | null = null;
    errorMessage: string | null = null;
    successMessage: string | null = null;
    isLoading: boolean = false;
    searchTerm: string = '';
    startDate: string = '';
    endDate: string = '';
    statusFilter: string = '';
    currentPage: number = 0;
    pageSize: number = 10;
    totalElements: number = 0;
    Math = Math; // Hacer Math disponible en el template

    private modals: { [key: string]: Modal } = {};

    constructor(private reservationService: ReservationService) {}

    ngOnInit(): void {
        this.loadReservations();
        this.initializeModals();
    }

    private initializeModals(): void {
        const modalIds = ['reservationDetailsModal', 'updateStatusModal'];
        modalIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                this.modals[id] = new Modal(element);
            }
        });
    }

    loadReservations(): void {
        this.isLoading = true;
        this.reservationService.getAllReservations(
            this.searchTerm,
            this.startDate,
            this.endDate,
            this.statusFilter,
            this.currentPage,
            this.pageSize
        ).subscribe({
            next: (response) => {
                this.reservations = response.content;
                this.totalElements = response.totalElements;
                this.isLoading = false;
                this.errorMessage = null;
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = 'Error al cargar las reservas';
                console.error('Error loading reservations:', error);
            }
        });
    }

    onSearch(): void {
        this.currentPage = 0;
        this.loadReservations();
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadReservations();
    }

    viewDetails(reservation: ReservationResponse): void {
        this.selectedReservation = reservation;
        this.modals['reservationDetailsModal']?.show();
    }

    updateStatus(reservation: ReservationResponse, status: 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO'): void {
        this.isLoading = true;
        this.reservationService.updateReservationStatus(reservation.id, status).subscribe({
            next: () => {
                this.loadReservations();
                this.modals['updateStatusModal']?.hide();
                this.successMessage = 'Estado actualizado exitosamente';
                setTimeout(() => this.successMessage = null, 3000);
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = 'Error al actualizar el estado';
                console.error('Error updating status:', error);
            }
        });
    }

    deleteReservation(id: number): void {
        if (confirm('¿Está seguro de eliminar esta reserva?')) {
            this.isLoading = true;
            this.reservationService.deleteReservation(id).subscribe({
                next: () => {
                    this.loadReservations();
                    this.successMessage = 'Reserva eliminada exitosamente';
                    setTimeout(() => this.successMessage = null, 3000);
                },
                error: (error) => {
                    this.isLoading = false;
                    this.errorMessage = 'Error al eliminar la reserva';
                    console.error('Error deleting reservation:', error);
                }
            });
        }
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'CONFIRMADO':
                return 'badge bg-success';
            case 'CANCELADO':
                return 'badge bg-danger';
            default:
                return 'badge bg-warning';
        }
    }

    clearFilters(): void {
        this.searchTerm = '';
        this.startDate = '';
        this.endDate = '';
        this.statusFilter = '';
        this.currentPage = 0;
        this.loadReservations();
    }
}