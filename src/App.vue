<!-- src/App.vue -->
<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAuthStore } from './auth/stores/auth';
import { onMounted } from 'vue';
const auth = useAuthStore();

onMounted(() => {
  auth.initialise(); // ← aquí se verifica el token y carga el perfil
});
</script>

<template>
  <!-- Renderiza la ruta activa (equivalente a <AppRouter />) -->
  <RouterView />
</template>
