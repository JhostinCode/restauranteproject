export interface MeasurementUnit {
    id?: number;
    name: string;
    symbol: string;
}

export interface CreateMeasurementUnitRequest extends Omit<MeasurementUnit, 'id'> {}
export interface UpdateMeasurementUnitRequest extends Partial<CreateMeasurementUnitRequest> {}
