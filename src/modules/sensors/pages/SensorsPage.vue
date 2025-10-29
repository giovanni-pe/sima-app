<template>
  <Layout>
    <div class="page-wrap bg-farm">
      <div class="section-head mb-4">
        <div>
          <h1 class="text-lg sm:text-xl font-semibold text-slate-800">Sensores</h1>
          <p class="text-xs text-slate-500 mt-0.5">Administra los sensores y su asociación a unidades de control</p>
        </div>
        <button @click="store.openCreate()" class="btn-primary-sima">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nuevo sensor
        </button>
      </div>


      <ListSensors />
    </div>
  </Layout>
</template>


<script setup lang="ts">
import { onMounted } from 'vue';
import Layout from '@/ui/Layout.vue';
import ListSensors from '../components/ListSensors.vue';
import { useSensorStore } from '../stores/SensorsStore';


const store = useSensorStore();


onMounted(() => { store.fetchList(); });
</script>