// Tipos base del módulo Control Units

export type ControlUnitStatus = 'online' | 'offline' | 'maintenance';

export interface ControlUnit {
  id: number;
  serial_code: string;
  model: string;
  installed_at?: string | null;   // ISO date
  status: ControlUnitStatus;
  parcel_id: number;
  mqtt_client_id: string;
  mqtt_username?: string | null;
  mqtt_password_enc?: string | null;
  status_topic?: string | null;
  lwt_topic?: string | null;
  last_seen_at?: string | null;   // ISO date
  active: boolean;

  created_at?: string | null;
  updated_at?: string | null;
}

export interface ControlUnitFilters {
  q: string;
  status: 'all' | ControlUnitStatus;
  active: 'all' | '1' | '0';
  fromInstalled?: string; // YYYY-MM-DD
  toInstalled?: string;
  fromSeen?: string;
  toSeen?: string;
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



export interface ParcelOption {
  id: number;
  name: string;
  location?: string | null;
  active?: boolean;
}
