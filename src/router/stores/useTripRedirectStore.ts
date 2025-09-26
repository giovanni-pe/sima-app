// src/router/stores/useTripRedirectStore.ts
import { defineStore } from 'pinia';
import { useAuthStore } from '@/auth/stores/auth';

export const useTripRedirectStore = defineStore('tripRedirect', {
    state: () => ({
        activeTripPath: null as string | null,
    }),

    actions: {
      async initTripRedirect() {
  const auth = useAuthStore();

  // Esperar inicialización de sesión
  await auth.ensureInitialized();

  if (!auth.user) {
    this.activeTripPath = null;
    return;
  }

  const userType = auth.user.user_type;

  this.activeTripPath = null;
}


    },
});
