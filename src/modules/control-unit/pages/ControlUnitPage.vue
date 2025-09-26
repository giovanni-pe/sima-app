<template>
  <Layout>
    <div class="page-wrap bg-farm">
      <div class="section-head mb-4">
        <div>
          <h1 class="text-lg sm:text-xl font-semibold text-slate-800">Unidades de Control</h1>
          <p class="text-xs text-slate-500 mt-0.5">Monitorea el estado MQTT y actividad en tiempo real</p>
        </div>
        <button @click="store.openCreate()" class="btn-primary-sima">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg>
          Nueva unidad
        </button>
      </div>

      <ListControlUnit />
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Layout from '@/ui/Layout.vue';
import ListControlUnit from '../components/ListControlUnit.vue';
import { useControlUnitStore } from '../stores/ControlUnitStore';

const store = useControlUnitStore();
onMounted(() => { store.fetchList(); });
</script>
