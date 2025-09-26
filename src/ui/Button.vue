<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

/* ─── Props ─────────────────────────────────────── */
interface Props {
  /** Estilo visual */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** Tamaño */
  size?: 'sm' | 'md' | 'lg';
  /** Spinner + deshabilitar */
  loading?: boolean;
  /** `w-full` */
  fullWidth?: boolean;
  /** Control externo de disabled */
  disabled?: boolean;
  /** Tipo de botón */
  type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  fullWidth: false,
  disabled: false,
  type: 'button',
});

/* ─── Clases dinámicas (igual que en React) ─────── */
const buttonClass = computed(() =>
  cn(
    'rounded-lg font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    {
      primary:   'bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-500 active:bg-sky-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      danger:    'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 active:bg-red-700',
      ghost:     'text-sky-600 hover:bg-sky-50 focus:ring-sky-500',
    }[props.variant],
    {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
    }[props.size],
    props.fullWidth && 'w-full',
  ),
);
</script>

<template>
  <button
    :type="type"
    :class="buttonClass"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <!-- Spinner -->
    <span v-if="loading" class="flex items-center justify-center">
      <span
        class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"
      />
      Cargando...
    </span>

    <!-- Contenido normal -->
    <span v-else>
      <slot />
    </span>
  </button>
</template>
