

export interface Sensor {
id: number;
name: string;
type: string; // p.ej. dht11, dht22, ds18b20, etc.
control_unit_id: number; // FK a ControlUnit
active: boolean;


created_at?: string | null;
updated_at?: string | null;
}


export interface SensorFilters {
q: string; // búsqueda libre por nombre/tipo
type: string | 'all'; // filtro por tipo
active: 'all' | '1' | '0';
}


export interface PaginatedResponse<T> {
data: T[];
meta: {
total: number;
per_page: number;
current_page: number;
last_page: number;
};
}


export interface ControlUnitOption {
id: number;
serial_code: string;
model?: string | null;
}