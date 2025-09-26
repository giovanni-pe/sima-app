<script setup lang="ts">
import { watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../auth/stores/auth';
import Loading from '@/ui/Loading.vue'; // Asegúrate de importar tu componente Loading si es local

const auth = useAuthStore();
const router = useRouter();

/* Redirige a login si no está autenticado y ya terminó de cargar */
watchEffect(() => {
  if (!auth.loading && !auth.isAuthenticated) {
    router.replace('/login');
  }
});

</script>

<template>
  <!-- Loader mientras se verifica la sesión -->
  <Loading v-if="auth.loading" fullScreen text="Verificando sesión..." />

  <!-- Contenido protegido -->
  <router-view v-else />
</template>
