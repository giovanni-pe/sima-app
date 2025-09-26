<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';

import Card from '@/ui/Card.vue';
import LoginForm from '@/auth/components/LoginForm.vue';
import { useAuth } from '@/auth/composables/useAuth';

const router = useRouter();
const {
  loading,
  error,
  isAuthenticated,
} = useAuth();

/* ①  Redirige inmediatamente si ya hay sesión */
watch(
  () => isAuthenticated.value,
  logged => {
    if (logged) router.replace('/dashboard');
  },
  { immediate: true },
);
</script>

<template>
  <!-- Si ya está autenticado, el watcher hará el redirect; la vista se mostrará un instante -->
  <div class="w-full max-w-md mx-auto">
    <Card class="p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">SIMA-UNAS</h1>
        <p class="text-gray-600">Ingresa a tu cuenta</p>
      </div>

      <LoginForm
        :loading="loading"
        :error="error"
      />

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          ¿No tienes cuenta?
          <RouterLink
            to="/register"
            class="text-sky-600 hover:text-sky-700 font-medium"
          >
            Regístrate aquí
          </RouterLink>
        </p>
      </div>
    </Card>
  </div>
</template>
