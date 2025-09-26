<script setup lang="ts">
/**
 * Componente de fallback para capturar errores en rutas/páginas lazy-loaded.
 * Recibe el objeto `error` y muestra un mensaje + botón para recargar.
 */
defineProps<{ error: Error }>();

/** Recarga la SPA completa */
function reload() {
  window.location.reload();
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>

      <p class="text-gray-600 mb-4">
        {{ error.message || 'Unknown error' }}
      </p>

      <button
        @click="reload"
        class="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
      >
        Reload Page
      </button>
    </div>
  </div>
</template>
