<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

/* ─── Props ───────────────────────────────────────────── */
interface Props {
  /** Etiqueta sobre la caja de texto */
  label?: string;
  /** Mensaje de error (aparece en rojo)  */
  error?: string;
  /** Texto de ayuda (aparece si no hay error) */
  helperText?: string;
  /** Icono a la izquierda (cualquier nodo/HTML) */
  leftIcon?: unknown;
  /** Icono a la derecha */
  rightIcon?: unknown;
  /** Clases Tailwind extra */
  className?: string;
  /** v-model value */
  modelValue?: string | number;
  /** Tipo de input (text, password, etc.) */
  type?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
});

/* Emitimos update:modelValue para v-model */
const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

/* Clases dinámicas equivalentes al componente React */
const inputClass = computed(() =>
  cn(
    'w-full px-3 py-2.5 border rounded-lg transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent',
    'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
    props.error
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500'
      : 'border-gray-300 hover:border-gray-400',
    !!props.leftIcon && 'pl-10',
    !!props.rightIcon && 'pr-10',
    props.className,
  ),
);

/* Reenvía input / change al padre */
function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  emit('update:modelValue', val);
}
</script>

<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>

    <!-- Campo + iconos -->
    <div class="relative">
      <!-- Icono izq -->
      <div
        v-if="leftIcon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"
        v-html="leftIcon"
      />

      <!-- Input nativo -->
      <input
        :type="type"
        :value="modelValue"
        :class="inputClass"
        @input="onInput"
        v-bind="$attrs"
      />

      <!-- Icono der -->
      <div
        v-if="rightIcon"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
        v-html="rightIcon"
      />
    </div>

    <!-- Mensajes -->
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-else-if="helperText" class="mt-1 text-sm text-gray-500">
      {{ helperText }}
    </p>
  </div>
</template>
