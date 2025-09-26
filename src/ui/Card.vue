<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

/** Props equivalentes a la versión React */
interface Props {
  className?: string;
  padding?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  padding: true,
  hover: false,
});

const emit = defineEmits<{ click: [] }>();

/* Clases dinámicas: igual que en React */
const cardClass = computed(() =>
  cn(
    'bg-gradient-to-br from-white/95 to-blue-50/60 backdrop-blur-2xl',
    'border border-blue-100/50 rounded-3xl shadow-mid',
    'transform transition-all duration-300',
    props.padding && 'p-6',
    props.hover && 'hover:shadow-glam hover:scale-[1.02]',
    props.onClick && 'cursor-pointer',
    props.className,
  ),
);

/* Propaga el clic al evento `click` si el padre lo necesita */
function handleClick() {
  if (props.onClick) props.onClick();
  emit('click');
}
</script>

<template>
  <div :class="cardClass" @click="handleClick">
    <slot />
  </div>
</template>
