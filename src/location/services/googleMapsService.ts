// src/location/services/googleMapsService.ts
import { Loader } from '@googlemaps/js-api-loader';
import { encode } from '@googlemaps/polyline-codec';
import type {
  Coordinates,
  RouteInfo,
  RouteRequest,
  PlaceResult,
  GeocodingResult,
  PricingConfig
} from '@/location/types/location.types';

class GoogleMapsService {
  private loader: Loader;
  private isLoaded = false;
  private google: typeof google | null = null;

  // Pricing configuration for Peru (PEN)
  private pricingConfig: PricingConfig = {
    baseFare: 5.0,
    perKmRate: 2.5,
    perMinuteRate: 0.3,
    minimumFare: 8.0,
    vehicleMultipliers: {
      car: 1.0,
      motorcycle: 0.7,
      bicycle: 0.4,
    },
  };

  constructor() {
    const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('Google Maps API key is required');
    }

    this.loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry'],
    });
  }

  // Initialize Google Maps
  async initialize(): Promise<void> {
    if (this.isLoaded) return;
    this.google = await this.loader.load();
    this.isLoaded = true;
  }

  // Ensure Maps is loaded
  private async ensureLoaded(): Promise<typeof google> {
    if (!this.isLoaded) await this.initialize();
    if (!this.google) throw new Error('Google Maps not available');
    return this.google;
  }

  private coordinatesToLatLng(coords: Coordinates): google.maps.LatLng {
    return new google.maps.LatLng(coords.latitude, coords.longitude);
  }

  private latLngToCoordinates(
    latLng: google.maps.LatLng | google.maps.LatLngLiteral
  ): Coordinates {
    return {
      latitude:
        typeof (latLng as google.maps.LatLng).lat === 'function'
          ? (latLng as google.maps.LatLng).lat()
          : (latLng as google.maps.LatLngLiteral).lat,
      longitude:
        typeof (latLng as google.maps.LatLng).lng === 'function'
          ? (latLng as google.maps.LatLng).lng()
          : (latLng as google.maps.LatLngLiteral).lng,
    };
  }

  async geocodeAddress(address: string): Promise<GeocodingResult> {
    const google = await this.ensureLoaded();
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const res = results[0];
          resolve({
            location: {
              coordinates: this.latLngToCoordinates(res.geometry.location!),
              address: res.formatted_address,
              placeId: res.place_id!,
            },
            formatted_address: res.formatted_address,
            address_components: res.address_components,
          });
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  }

  async reverseGeocode(coords: Coordinates): Promise<GeocodingResult> {
    const google = await this.ensureLoaded();
    const geocoder = new google.maps.Geocoder();
    const latLng = this.coordinatesToLatLng(coords);
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const res = results[0];
          resolve({
            location: {
              coordinates: coords,
              address: res.formatted_address,
              placeId: res.place_id!,
            },
            formatted_address: res.formatted_address,
            address_components: res.address_components,
          });
        } else {
          reject(new Error(`Reverse geocoding failed: ${status}`));
        }
      });
    });
  }

  async searchPlaces(
    query: string,
    location?: Coordinates
  ): Promise<PlaceResult[]> {
    const google = await this.ensureLoaded();
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );
    const req: google.maps.places.TextSearchRequest = { query, region: 'PE' };
    if (location) {
      req.location = this.coordinatesToLatLng(location);
      req.radius = 50000;
    }
    return new Promise((resolve, reject) => {
      service.textSearch(req, (results, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          results
        ) {
          resolve(
            results.map((place) => ({
              placeId: place.place_id!,
              name: place.name!,
              formatted_address: place.formatted_address!,
              coordinates: this.latLngToCoordinates(
                place.geometry!.location!
              ),
              types: place.types || [],
            }))
          );
        } else {
          reject(new Error(`Places search failed: ${status}`));
        }
      });
    });
  }

  async calculateRoute(request: RouteRequest): Promise<RouteInfo> {
    const google = await this.ensureLoaded();
    const ds = new google.maps.DirectionsService();
    const dr: google.maps.DirectionsRequest = {
      origin: this.coordinatesToLatLng(request.origin.coordinates),
      destination: this.coordinatesToLatLng(request.destination.coordinates),
      travelMode: google.maps.TravelMode[request.travelMode || 'DRIVING'],
      avoidTolls: request.avoidTolls || false,
      avoidHighways: request.avoidHighways || false,
      region: 'PE',
    };
    if (request.waypoints?.length) {
      dr.waypoints = request.waypoints.map((wp) => ({
        location: this.coordinatesToLatLng(wp.coordinates),
        stopover: true,
      }));
    }
    return new Promise((resolve, reject) => {
      ds.route(dr, (res, status) => {
        if (status === 'OK' && res) {
          const route = res.routes[0];
          const leg = route.legs[0];
          const distanceKm = leg.distance!.value / 1000;
          const durationMin = leg.duration!.value / 60;
          const vehicle = this.getVehicleTypeFromTravelMode(
            request.travelMode
          );
          const cost = this.calculateCost(
            distanceKm,
            durationMin,
            vehicle
          );
          let poly = (route.overview_polyline as any)?.points || '';
          if (!poly && leg.steps?.length) {
            const path: [number, number][] = leg.steps.map((step) => {
              const l = step.start_location as google.maps.LatLng;
              return [l.lat(), l.lng()];
            });
            const last = leg.steps[leg.steps.length - 1];
            const end = last.end_location as google.maps.LatLng;
            path.push([end.lat(), end.lng()]);
            poly = encode(path, 5);
          }
          resolve({
            distance: { text: leg.distance!.text, value: leg.distance!.value },
            duration: { text: leg.duration!.text, value: leg.duration!.value },
            polyline: poly,
            steps: leg.steps.map((step) => ({
              instruction: step.instructions,
              distance: step.distance!.text,
              duration: step.duration!.text,
              coordinates: this.latLngToCoordinates(
                step.start_location as google.maps.LatLng
              ),
            })),
            estimatedCost: cost,
          });
        } else {
          reject(new Error(`Route calculation failed: ${status}`));
        }
      });
    });
  }

  calculateDistance(o: Coordinates, d: Coordinates): number {
    const R = 6371;
    const dLat = this.toRadians(d.latitude - o.latitude);
    const dLon = this.toRadians(d.longitude - o.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(o.latitude)) *
        Math.cos(this.toRadians(d.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private calculateCost(
    distanceKm: number,
    durationMin: number,
    vehicleType: 'car' | 'motorcycle' | 'bicycle'
  ): number {
    const { baseFare, perKmRate, perMinuteRate, minimumFare, vehicleMultipliers } =
      this.pricingConfig;
    let total = (baseFare + distanceKm * perKmRate + durationMin * perMinuteRate) * vehicleMultipliers[vehicleType];
    total = Math.max(total, minimumFare);
    return Math.round(total * 100) / 100;
  }

  private toRadians(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  private getVehicleTypeFromTravelMode(
    mode?: string
  ): 'car' | 'motorcycle' | 'bicycle' {
    switch (mode) {
      case 'BICYCLING':
        return 'bicycle';
      case 'WALKING':
        return 'bicycle';
      default:
        return 'car';
    }
  }

  async createAutocomplete(
    input: HTMLInputElement,
    options?: Partial<google.maps.places.AutocompleteOptions>
  ): Promise<google.maps.places.Autocomplete> {
    const google = await this.ensureLoaded();
    const defaults: google.maps.places.AutocompleteOptions = {
      componentRestrictions: { country: 'PE' },
      fields: ['place_id', 'formatted_address', 'geometry', 'name'],
      types: ['establishment', 'geocode'],
    };
    return new google.maps.places.Autocomplete(input, { ...defaults, ...options });
  }

  updatePricingConfig(config: Partial<PricingConfig>) {
    this.pricingConfig = { ...this.pricingConfig, ...config };
  }

  getPricingConfig(): PricingConfig {
    return { ...this.pricingConfig };
  }
}

export const googleMapsService = new GoogleMapsService();
