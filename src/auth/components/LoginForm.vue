<script setup lang="ts">
import { reactive } from 'vue';
import { isValidEmail, isValidPhone } from '@/lib/utils';
import { useAuthStore } from '@/auth/stores/auth';

import Button from '@/ui/Button.vue';
import type { LoginCredentials } from '../types';

const auth = useAuthStore();



const fieldErrors = reactive<Record<string, string>>({});

const formData = reactive({
  login: '',
  password: ''
});

function validateForm() {
  const errors: Record<string, string> = {};

  if (!formData.login.trim()) {
    errors.login = 'Ingresa tu teléfono o email';
  } else {
    const isEmail = formData.login.includes('@');
    if (isEmail && !isValidEmail(formData.login)) {
      errors.login = 'Email inválido';
    } else if (!isEmail && !isValidPhone(formData.login)) {
      errors.login = 'Teléfono inválido (9 dígitos)';
    }
  }

  if (!formData.password) {
    errors.password = 'Ingresa tu contraseña';
  } else if (formData.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres';
  }

  Object.assign(fieldErrors, errors);
  return Object.keys(errors).length === 0;
}

async function handleSubmit(e: Event) {
  e.preventDefault();
  if (!validateForm()) return;
  try {
    
   await auth.login({ ...formData });
  } catch {
    // error ya manejado por el store
  }
}

function clearFieldError(key: keyof LoginCredentials) {
  if (fieldErrors[key]) fieldErrors[key] = '';
}
</script>

<template>
  <form @submit="handleSubmit" class="space-y-4">
    <!-- Login -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Teléfono o Email</label>
      <input
        type="text"
        class="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        v-model="formData.login"
        placeholder="999123456 o email@ejemplo.com"
        :disabled="auth.loading"
        @input="clearFieldError('login')"
      />
      <p v-if="fieldErrors.login" class="text-xs text-red-600 mt-1">{{ fieldErrors.login }}</p>
    </div>

    <!-- Password -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Contraseña</label>
      <input
        type="password"
        class="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        v-model="formData.password"
        placeholder="Tu contraseña"
        :disabled="auth.loading"
        @input="clearFieldError('password')"
      />
      <p v-if="fieldErrors.password" class="text-xs text-red-600 mt-1">{{ fieldErrors.password }}</p>
    </div>

    <!-- Error del servidor -->
    <div v-if="auth.error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-700 text-sm">{{ auth.error }}</p>
    </div>

    <!-- Botón -->
    <Button type="submit" fullWidth :loading="auth.loading" :disabled="auth.loading">
      Iniciar Sesión
    </Button>
  </form>
</template>
