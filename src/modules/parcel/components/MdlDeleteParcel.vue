<!-- src/modules/parcel/components/MdlDeleteParcel.vue -->
<template>
  <div v-if="store.ui.openDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="store.closeDelete()" />
    <div class="relative w-full max-w-md rounded-2xl bg-white/95 shadow-2xl border border-white/20 backdrop-blur-lg p-6">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-100 mb-4">
          <Icon icon="mdi:alert-circle" class="h-6 w-6 text-rose-600" />
        </div>
        <h3 class="text-lg font-semibold text-slate-800 mb-2">Eliminar parcela</h3>
        <p class="text-sm text-slate-600">
          ¿Estás seguro de que deseas eliminar
          <strong class="text-slate-800">{{ store.ui.selected?.name }}</strong>? Esta acción no se puede deshacer.
        </p>
      </div>

      <footer class="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-center">
        <button type="button" @click="store.closeDelete()" 
          class="w-full sm:w-auto rounded-xl border border-slate-200 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors">
          Cancelar
        </button>
        <button type="button" :disabled="store.ui.busy" @click="confirm" 
          class="btn-danger w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed">
          <Icon icon="mdi:delete" v-if="!store.ui.busy" />
          <Icon icon="mdi:loading" class="animate-spin" v-if="store.ui.busy" />
          <span>{{ store.ui.busy ? 'Eliminando…' : 'Eliminar' }}</span>
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useParcelStore } from '../stores/ParcelStore';
import { Icon } from '@iconify/vue';

const store = useParcelStore();

async function confirm() {
  if (!store.ui.selected) return;
  try {
    store.ui.busy = true;
    await store.deleteParcel(store.ui.selected.id);
    store.closeDelete();
  } finally {
    store.ui.busy = false;
  }
}
</script>

<style scoped>
/* Textura de advertencia para el modal de eliminación */
.relative::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10c22.1 0 40 17.9 40 40s-17.9 40-40 40S10 72.1 10 50s17.9-40 40-40zm0 65c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zm5-50H45v35h10V25z' fill='%23fecaca' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.1;
  z-index: -1;
  border-radius: 1rem;
}
</style>