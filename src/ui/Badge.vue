<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' |'secondary';
  size?: 'sm' | 'md';
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'sm'
});

const classes = computed(() => {
  const variantClasses: Record<string, string> = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-sky-100 text-sky-800',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return cn(
    'inline-flex items-center font-medium rounded-full',
    variantClasses[props.variant],
    sizeClasses[props.size],
    props.className
  );
});
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
