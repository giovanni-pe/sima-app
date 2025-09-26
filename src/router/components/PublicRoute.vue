<script setup lang="ts">
import { watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../auth/stores/auth';
import Loading  from '../../ui/Loading.vue';    

const auth   = useAuthStore();
const router = useRouter();

/**
 * 1. Mientras el store aún está inicializando (por ejemplo, verificando token),
 *    muestra un loader a pantalla completa.
 * 2. Si el usuario YA está autenticado, redirige a /dashboard.
 * 3. Si no está logueado, deja pasar el contenido público (<router-view />).
 */
watchEffect(() => {
  if (!auth.loading && auth.isAuthenticated) {
    router.replace({ path: '/dashboard' });
  }
});
</script>

<template>
  <!-- Loader global mientras se verifica la sesión -->
  <Loading v-if="auth.loading" fullScreen text="Loading..." />

  <!-- Contenido público cuando NO hay sesión (o después del loader) -->
  <router-view v-else />
</template>
