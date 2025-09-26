<script setup lang="ts">
import { Icon } from '@iconify/vue';

interface Props {
  icon: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <button
    @click="$emit('click')"
    class="
      flex items-center w-full px-4 py-2 space-x-3
      text-sm text-gray-800 font-medium
      hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50
      transition-colors duration-200
    "
  >
    <Icon :icon="props.icon" class="w-5 h-5 text-gray-600" />
    <span class="flex-1 text-left">
      <slot />
    </span>
    <Icon icon="mdi:chevron-right" class="w-4 h-4 text-gray-400" />
  </button>
</template>
