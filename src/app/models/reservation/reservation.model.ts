export interface Reservation {
    id?: number;
    name: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    status?: 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO';
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateReservationRequest {
    name: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
}

export interface UpdateReservationRequest {
    name?: string;
    phone?: string;
    date?: string;
    time?: string;
    guests?: number;
    status?: 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO';
}

export interface ReservationResponse {
    id: number;
    name: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    status: 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO';
    createdAt: string;
    updatedAt: string;
}