// src/router/useNavigation.ts
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../auth/stores/auth';

/**
 * Navegación centralizada (equivalente a useNavigation de React).
 */
export const useNavigation = () => {
  const router = useRouter();
  const route  = useRoute();
  const auth   = useAuthStore();

  /** Redirige al dashboard según el tipo de usuario */
  const goToDashboard = () => {
    if (!auth.isAuthenticated) return;


      router.replace('/sima/parcels');
   
  };

  const goToLogin    = () => router.push('/login');
  const goToRegister = () => router.push('/register');
  const goBack       = () => router.back();
    function navigate(path: string) {
    router.push(path);
  }
  const isCurrentPath           = (path: string) => route.path === path;
  const isCurrentPathStartsWith = (path: string) => route.path.startsWith(path);

  return {
    navigate,
    router,
    route,
    goToDashboard,
    goToLogin,
    goToRegister,
    goBack,
    isCurrentPath,
    isCurrentPathStartsWith,
  };
};
