// src/auth/types.ts
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  phone: string;
  email?: string;
  avatar_url?: string;
  user_type: 'passenger' | 'driver' | 'both';
  status: 'active' | 'suspended' | 'inactive';
  rating_average: number;
  total_trips: number;
  referral_code?: string;
  created_at: string;

  /* roles & permisos */
  roles: string[];
  permissions: string[];
  can: UserPermissions;

  /* relaciones opcionales */
  driver?: DriverProfile;
  subscription?: UserSubscription;
}

export interface DriverProfile {
  id: string;
  license_number: string;
  driver_status: 'available' | 'busy' | 'offline';
  documents_verified: boolean;
  total_earnings: number;
  completed_trips: number;
  is_online: boolean;
  can_drive: boolean;
  vehicle?: Vehicle;
}

export interface Vehicle {
  id: string;
  type: string;
  brand: string;
  model: string;
  license_plate: string;
  color: string;
  capacity: number;
  year: number;
}

export interface UserPermissions {
  create_trip: boolean;
  drive_vehicle: boolean;
  manage_availability: boolean;
  accept_trip: boolean;
  manage_users: boolean;
}

export interface UserSubscription {
  plan_name: string;
  expires_at: string;
  is_active: boolean;
}

/* ─────────────────────── auth payloads ─────────────────────── */

export interface LoginCredentials {
  /** Teléfono o email */
  login: string;
  password: string;
}

export interface RegisterData {
  first_name:  string;
  last_name:   string;
  phone:       string;
  email?:      string;
  password:    string;
  user_type:  'passenger' | 'driver' | 'both';
}

export interface AuthResponse {
  user:  User;
  token: string;
}

/* ─────────────────────── store shapes ─────────────────────── */

export interface AuthState {
  user:            User | null;
  token:           string | null;
  isAuthenticated: boolean;
  loading:         boolean;
  error:           string | null;
}

export interface AuthContextType {
  state:          AuthState;
  login:          (c: LoginCredentials)         => Promise<void>;
  register:       (d: RegisterData)             => Promise<void>;
  logout:         ()                            => void;
  clearError:     ()                            => void;
  updateProfile:  (d: Partial<User>)            => Promise<void>;
}
