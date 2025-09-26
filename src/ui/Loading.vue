<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue';
import { cn } from '../lib/utils';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  text: 'Cargando...',
  fullScreen: false,
});

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const spinnerClass = computed(() =>
  cn(
    'border-4 border-gray-200 border-t-sky-500 rounded-full animate-spin',
    sizeClasses[props.size],
  ),
);
</script>

<template>
  <!-- Modo pantalla completa -->
  <div
    v-if="props.fullScreen"
    class="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50"
  >
    <div class="flex flex-col items-center justify-center space-y-3">
      <div :class="spinnerClass" />
      <p v-if="props.text" class="text-gray-600 text-sm font-medium">
        {{ props.text }}
      </p>
    </div>
  </div>

  <!-- Modo embebido -->
  <div v-else class="flex flex-col items-center justify-center space-y-3">
    <div :class="spinnerClass" />
    <p v-if="props.text" class="text-gray-600 text-sm font-medium">
      {{ props.text }}
    </p>
  </div>
</template>
