<script setup lang="ts">
import { watch } from 'vue';
import { useRouter } from 'vue-router';

import Card from '@/ui/Card.vue';
import RegisterForm from '@/auth/components/RegisterForm.vue';
import { useAuth } from '@/auth/composables/useAuth';

const router = useRouter();
const {
  register,
  loading,
  error,
  isAuthenticated,
} = useAuth();

/* Redirige en cuanto detecta que ya existe sesión */
watch(
  () => isAuthenticated.value,
  logged => {
    if (logged) router.replace('/dashboard');
  },
  { immediate: true },
);
</script>

<template>
      <div class="w-full max-w-md">
      <Card class="p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">SIMA-UNAS</h1>
          <p class="text-gray-600">Crea tu cuenta</p>
        </div>

        <RegisterForm
          :onSubmit="register"
          :loading="loading"
          :error="error"
        />

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            ¿Ya tienes cuenta?
            <RouterLink
              to="/login"
              class="text-sky-600 hover:text-sky-700 font-medium"
            >
              Inicia sesión
            </RouterLink>
          </p>
        </div>
      </Card>
    </div>

</template>
