import { ref, onMounted, onUnmounted } from 'vue';

interface Position {
  latitude:  number;
  longitude: number;
  accuracy?: number;
}

export function useGeolocation() {
  const position = ref<Position | null>(null);
  const error    = ref<string | null>(null);

  let watchId: number | null = null;

  onMounted(() => {
    if (!navigator.geolocation) {
      error.value = 'Geolocalización no soportada';
      return;
    }

    watchId = navigator.geolocation.watchPosition(
      pos => {
        position.value = {
          latitude:  pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy:  pos.coords.accuracy,
        };
        error.value = null;
      },
      err => {
        error.value = err.message;
      },
      { enableHighAccuracy: true, maximumAge: 5_000, timeout: 10_000 },
    );
  });

  onUnmounted(() => {
    if (watchId !== null) navigator.geolocation.clearWatch(watchId);
  });

  return { position, error };
}
