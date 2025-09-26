<script setup lang="ts">
import { RouterLink } from 'vue-router';
// Si ya migraste tu componente Button de UI, descomenta la línea siguiente
// import Button from '@/ui/Button.vue';
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p class="text-xl text-gray-600 mb-8">Page not found</p>

      <!-- Opción A: usando tu componente Button -->
      <!--
      <Button>
        <RouterLink to="/">Go Home</RouterLink>
      </Button>
      -->

      <!-- Opción B: botón Tailwind directo -->
      <RouterLink
        to="/"
        class="inline-block px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
      >
        Go Home
      </RouterLink>
    </div>
  </div>
</template>
