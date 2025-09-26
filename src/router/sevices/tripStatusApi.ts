import { api } from '@/lib/api';

export const tripStatusApi = {
  /** Verifica si el usuario tiene un viaje activo */
  hasActiveTrip: async (): Promise<boolean> => {
    const response = await api.get<{ has_active_trip: boolean }>('/trips/hasActiveTrip');
     console.log("response data active",response.data);
    return true
  },
};
