// src/auth/composables/useAuth.ts
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth';

/**
 * Devuelve helpers y acciones listos para usar en componentes.
 * Equivale al antiguo hook React `useAuth`.
 */
export function useAuth() {
  const store = useAuthStore();

  /* state reactivo (con refs) */
  const {
    user,
    token,
    loading,
    error,
  } = storeToRefs(store);

  /* booleanos derivados */
  const isAuthenticated = computed(() => store.isAuthenticated);
  const isPassenger     = computed(
    () => user.value?.user_type === 'passenger' || user.value?.user_type === 'both',
  );
  const isDriver        = computed(
    () => user.value?.user_type === 'driver' || user.value?.user_type === 'both',
  );
  const canDrive        = computed(() => user.value?.driver?.can_drive ?? false);
  const isDriverOnline  = computed(() => user.value?.driver?.is_online ?? false);

  /* helpers de permisos / roles */
  const hasPermission = (perm: string) =>
    user.value?.permissions?.includes(perm) ?? false;
  const hasRole = (role: string) =>
    user.value?.roles?.includes(role) ?? false;

  /* acciones directas del store */
  const { login, register, logout, updateProfile, clearError } = store;

  return {
    /* state */
    user,
    token,
    isAuthenticated,
    loading,
    error,

    /* helpers rápidos */
    isPassenger,
    isDriver,
    canDrive,
    isDriverOnline,

    /* acciones */
    login,
    register,
    logout,
    updateProfile,
    clearError,

    /* permisos / roles */
    hasPermission,
    hasRole,
  };
}
