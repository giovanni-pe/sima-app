// src/lib/constants.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  TIMEOUT: 10_000,
  RETRY_ATTEMPTS: 3,
} as const;

export const MQTT_CONFIG = {
  host: import.meta.env.VITE_MQTT_HOST || 'localhost',
  port: Number(import.meta.env.VITE_MQTT_PORT || 9001),
  topics: {
    tripRequests:     'trips/requests',
    tripUpdates:      'trips/updates',
    driverLocation:   'drivers/location',
    chatMessages:     'chat/messages',
    notifications:    'notifications',
  },
} as const;

export const GOOGLE_MAPS_CONFIG = {
  API_KEY:        import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  DEFAULT_CENTER: { lat: -9.3067, lng: -75.9947 }, // Tingo María
  DEFAULT_ZOOM:   14,
} as const;

export const APP_CONFIG = {
  NAME:            'Chasqui Taxi',
  VERSION:         '1.0.0',
  STORAGE_PREFIX:  'chasqui_',
  /* 🔽 añadido para que api.ts pueda usarlo sin renombrar constantes */
  API_BASE_URL:    API_CONFIG.BASE_URL,
} as const;

export const TRIP_STATUS = {
  PENDING:              'pending',
  DRIVER_ASSIGNED:      'driver_assigned',
  DRIVER_EN_ROUTE:      'driver_en_route',
  DRIVER_ARRIVED:       'driver_arrived',
  IN_PROGRESS:          'in_progress',
  COMPLETED:            'completed',
  CANCELLED_BY_PASSENGER:'cancelled_by_passenger',
  CANCELLED_BY_DRIVER:  'cancelled_by_driver',
  CANCELLED_BY_SYSTEM:  'cancelled_by_system',
  NO_DRIVERS_AVAILABLE: 'no_drivers_available',
} as const;

export const USER_TYPES = {
  PASSENGER: 'passenger',
  DRIVER:    'driver',
  BOTH:      'both',
} as const;

export const DRIVER_STATUS = {
  AVAILABLE: 'available',
  BUSY:      'busy',
  OFFLINE:   'offline',
} as const;
