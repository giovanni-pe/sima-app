<!-- src/modules/parcel/pages/ParcelPage.vue -->
<template>
  <Layout>
    <div class="space-y-6 page-soft min-h-screen p-4 md:p-6">
      <header class="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="mdi:field" class="text-sky-600" />
            Gestión de Parcelas
          </h1>
          <p class="text-sm text-slate-500 mt-1">Administra tus terrenos y cultivos</p>
        </div>
        <button
          @click="store.openCreate()"
          class="btn-sima mt-2 md:mt-0"
        >
          <Icon icon="mdi:plus" class="text-lg" />
          Nueva parcela
        </button>
      </header>

      <!-- La lista ya maneja filtros, paginación y modales usando el store directamente -->
      <ListParcel />
    </div>
    
  </Layout>

</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useParcelStore } from '../stores/ParcelStore';
import ListParcel from '../components/ListParcel.vue';
import Layout from '@/ui/Layout.vue';
import { Icon } from '@iconify/vue';

const store = useParcelStore();

onMounted(() => {
  store.fetchList();
});
</script>

<style scoped>
.page-soft {
  background: linear-gradient(180deg, #f5fbff 0%, #edf6ff 100%);
}

.btn-sima {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 1rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.625rem 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  background-image: linear-gradient(135deg, #00b2d8 0%, #1fb6ff 100%);
}

.btn-sima:hover {
  filter: brightness(1.03);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
</style>