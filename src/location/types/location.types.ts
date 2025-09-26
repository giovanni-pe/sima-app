export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  coordinates: Coordinates;
  address?: string;
  placeId?: string;
  name?: string;
  formatted_address?: string;
}

export interface LocationState {
  currentLocation: Location | null;
  isWatching: boolean;
  isLoading: boolean;
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown';
  error: string | null;
  accuracy: number | null;
}

export interface RouteInfo {
  distance: {
    text: string;
    value: number; // in meters
  };
  duration: {
    text: string;
    value: number; // in seconds
  };
  polyline: string;
  steps: RouteStep[];
  estimatedCost: number;
}

export interface RouteStep {
  instruction: string;
  distance: string;
  duration: string;
  coordinates: Coordinates;
}

export interface RouteRequest {
  origin: Location;
  destination: Location;
  waypoints?: Location[];
  travelMode?: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';
  avoidTolls?: boolean;
  avoidHighways?: boolean;
}

export interface PlaceResult {
  placeId: string;
  name: string;
  formatted_address: string;
  coordinates: Coordinates;
  types: string[];
}

export interface GeocodingResult {
  location: Location;
  formatted_address: string;
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
}

export interface LocationPermissionModalProps {
  isVisible: boolean;
  onPermissionGranted: () => void;
  onPermissionDenied: () => void;
}

export interface MapInputProps {
  onLocationSelect: (location: Location) => void;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  showMap?: boolean;
  mapHeight?: string;
}

export interface RouteCalculatorProps {
  origin?: Location;
  destination?: Location;
  onRouteCalculated?: (route: RouteInfo) => void;
  vehicleType?: 'car' | 'motorcycle' | 'bicycle';
  showDetails?: boolean;
}

// Pricing configuration
export interface PricingConfig {
  baseFare: number;
  perKmRate: number;
  perMinuteRate: number;
  minimumFare: number;
  vehicleMultipliers: {
    car: number;
    motorcycle: number;
    bicycle: number;
  };
}

// Location preferences
export interface LocationPreferences {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
  watchPositionInterval: number;
}