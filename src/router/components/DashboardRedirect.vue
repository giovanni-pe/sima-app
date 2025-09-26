<script setup lang="ts">
import { onMounted } from 'vue';
import { useNavigation } from '../useNavigation';
import Loading from '@/ui/Loading.vue';  

/**
 * Nada más montarse, decide a qué panel debe ir el usuario
 * y delega la redirección a `goToDashboard()`.
 */
const { goToDashboard } = useNavigation();

onMounted(() => {
  goToDashboard();          // redirige según user_type
});
</script>

<template>
  <!-- Pantalla de espera mientras se produce la redirección -->
  <Loading fullScreen text="Redirigiendo a tu panel..." />
</template>
