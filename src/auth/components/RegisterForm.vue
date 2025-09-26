<script setup lang="ts">
import { reactive, ref } from 'vue';
import { isValidEmail, isValidPhone } from '@/lib/utils';

import Input   from '@/ui/Input.vue';
import Button  from '@/ui/Button.vue';
import type { RegisterData } from '@/auth/types';

/* ─── Props ───────────────────────────────────────────── */
interface Props {
  onSubmit: (data: RegisterData) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

/* ─── State ───────────────────────────────────────────── */
const formData = reactive<RegisterData>({
  first_name:  '',
  last_name:   '',
  phone:       '',
  email:       '',
  password:    '',
  user_type:   'passenger',
});

const confirmPassword = ref('');
const fieldErrors = reactive<Record<string, string>>({});

/* ─── Validación ──────────────────────────────────────── */
function validateForm() {
  const errors: Record<string, string> = {};

  if (!formData.first_name.trim()) errors.first_name = 'Nombre requerido';
  if (!formData.last_name.trim())  errors.last_name  = 'Apellido requerido';

  if (!formData.phone.trim())      errors.phone = 'Teléfono requerido';
  else if (!isValidPhone(formData.phone)) errors.phone = 'Teléfono inválido (9 dígitos)';

  if (formData.email && !isValidEmail(formData.email)) errors.email = 'Email inválido';

  if (!formData.password)              errors.password = 'Contraseña requerida';
  else if (formData.password.length < 6) errors.password = 'Mínimo 6 caracteres';

  if (formData.password !== confirmPassword.value)
    errors.confirmPassword = 'Las contraseñas no coinciden';

  Object.assign(fieldErrors, errors);
  return Object.keys(errors).length === 0;
}

/* ─── Submit ──────────────────────────────────────────── */
async function handleSubmit(e: Event) {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    await props.onSubmit({ ...formData });
  } catch {
    /* el componente padre maneja el error global */
  }
}

/* ─── Limpia error de campo al escribir ───────────────── */
function clearFieldError(field: keyof RegisterData | 'confirmPassword') {
  if (fieldErrors[field]) fieldErrors[field] = '';
}
</script>

<template>
  <form @submit="handleSubmit" class="space-y-4">
    <!-- Nombre y Apellido -->
    <div class="grid grid-cols-2 gap-4">
      <Input
        label="Nombre"
        v-model="formData.first_name"
        :error="fieldErrors.first_name"
        placeholder="Tu nombre"
        :disabled="loading"
        @update:modelValue="clearFieldError('first_name')"
      />
      <Input
        label="Apellido"
        v-model="formData.last_name"
        :error="fieldErrors.last_name"
        placeholder="Tu apellido"
        :disabled="loading"
        @update:modelValue="clearFieldError('last_name')"
      />
    </div>

    <!-- Teléfono -->
    <Input
      label="Teléfono"
      type="tel"
      v-model="formData.phone"
      :error="fieldErrors.phone"
      placeholder="999123456"
      :disabled="loading"
      @update:modelValue="clearFieldError('phone')"
    />

    <!-- Email opcional -->
    <Input
      label="Email (opcional)"
      type="email"
      v-model="formData.email"
      :error="fieldErrors.email"
      placeholder="email@ejemplo.com"
      :disabled="loading"
      @update:modelValue="clearFieldError('email')"
    />

    <!-- Tipo de usuario -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">
        Tipo de usuario
      </label>
      <div class="grid grid-cols-2 gap-4">
        <label class="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="user_type"
            value="passenger"
            v-model="formData.user_type"
            class="text-sky-500 focus:ring-sky-500"
            :disabled="loading"
          />
          <span class="text-sm">Pasajero</span>
        </label>
        <label class="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="user_type"
            value="driver"
            v-model="formData.user_type"
            class="text-sky-500 focus:ring-sky-500"
            :disabled="loading"
          />
          <span class="text-sm">Conductor</span>
        </label>
      </div>
    </div>

    <!-- Contraseña y confirmación -->
    <Input
      label="Contraseña"
      type="password"
      v-model="formData.password"
      :error="fieldErrors.password"
      placeholder="Mínimo 6 caracteres"
      :disabled="loading"
      @update:modelValue="clearFieldError('password')"
    />

    <Input
      label="Confirmar Contraseña"
      type="password"
      v-model="confirmPassword"
      :error="fieldErrors.confirmPassword"
      placeholder="Repite tu contraseña"
      :disabled="loading"
      @update:modelValue="clearFieldError('confirmPassword')"
    />

    <!-- Error de API -->
    <div
      v-if="error"
      class="p-3 bg-red-50 border border-red-200 rounded-lg"
    >
      <p class="text-red-700 text-sm">{{ error }}</p>
    </div>

    <!-- Botón -->
    <Button
      type="submit"
      fullWidth
      :loading="loading"
      :disabled="loading"
    >
      Crear Cuenta
    </Button>
  </form>
</template>
