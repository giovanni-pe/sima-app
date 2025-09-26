<!-- src/modules/parcel/components/MdlUpdateParcel.vue -->
<template>
  <div v-if="store.ui.openEdit" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="store.closeEdit()" />
    <div class="relative w-full max-w-md rounded-2xl bg-white/95 shadow-2xl border border-white/20 backdrop-blur-lg">
      <header class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-semibold text-slate-800 flex items-center gap-2">
          <Icon icon="mdi:pencil-circle" class="text-sky-500" />
          Editar parcela
        </h3>
        <button class="text-slate-400 hover:text-slate-600 transition-colors" @click="store.closeEdit()">
          <Icon icon="mdi:close" />
        </button>
      </header>

      <form class="p-5 space-y-4" @submit.prevent="submit">
        <div>
          <label class="block text-xs text-slate-500 mb-1 flex items-center gap-1" for="name">
            <Icon icon="mdi:form-textbox" />
            Nombre *
          </label>
          <input id="name" v-model.trim="store.ui.editForm.name" required 
            class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-slate-500 mb-1 flex items-center gap-1" for="area">
              <Icon icon="mdi:ruler-square" />
              Área m² *
            </label>
            <input id="area" v-model.number="store.ui.editForm.area_m2" type="number" min="0" step="0.01" required 
              class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
          </div>
          <div>
            <label class="block text-xs text-slate-500 mb-1 flex items-center gap-1" for="crop">
              <Icon icon="mdi:sprout" />
              Cultivo
            </label>
            <input id="crop" v-model.trim="store.ui.editForm.crop_type" 
              class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
          </div>
        </div>

        <div>
          <label class="block text-xs text-slate-500 mb-1 flex items-center gap-1" for="loc">
            <Icon icon="mdi:map-marker" />
            Ubicación
          </label>
          <input id="loc" v-model.trim="store.ui.editForm.location" 
            class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-slate-500 mb-1 flex items-center gap-1" for="lat">
              <Icon icon="mdi:latitude" />
              Latitud
            </label>
            <input id="lat" v-model.number="store.ui.editForm.latitude" type="number" min="-90" max="90" step="0.000001" 
              class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
          </div>
          <div>
            <label class="block text-xs text-slate-500 mb-1 flex items-center gap-1" for="lng">
              <Icon icon="mdi:longitude" />
              Longitud
            </label>
            <input id="lng" v-model.number="store.ui.editForm.longitude" type="number" min="-180" max="180" step="0.000001" 
              class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
          </div>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <div class="relative flex items-center">
            <input id="active" v-model="store.ui.editForm.active" type="checkbox" 
              class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer 
              peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
              after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
              peer-checked:bg-sky-600"></div>
          </div>
          <label for="active" class="text-sm text-slate-700 flex items-center gap-1">
            <Icon icon="mdi:power" />
            Activa
          </label>
        </div>

        <footer class="pt-4 flex items-center justify-end gap-3">
          <button type="button" @click="store.closeEdit()" 
            class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button type="submit" :disabled="!canSubmit || store.ui.busy" 
            class="btn-sima disabled:opacity-60 disabled:cursor-not-allowed">
            <Icon icon="mdi:content-save" v-if="!store.ui.busy" />
            <Icon icon="mdi:loading" class="animate-spin" v-if="store.ui.busy" />
            <span>{{ store.ui.busy ? 'Guardando…' : 'Guardar cambios' }}</span>
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useParcelStore } from '../stores/ParcelStore';
import { Icon } from '@iconify/vue';

const store = useParcelStore();
const canSubmit = computed(() => !!store.ui.editForm.name && (store.ui.editForm.area_m2 ?? 0) >= 0);

async function submit() {
  if (!store.ui.selected || !canSubmit.value) return;
  try {
    store.ui.busy = true;
    await store.updateParcel(store.ui.selected.id, { ...store.ui.editForm });
    store.closeEdit();
  } finally {
    store.ui.busy = false;
  }
}
</script>

<style scoped>
/* Textura de plantas/cultivos para el modal de edición */
.relative::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M41.5 27c5.6 0 10.2 4.6 10.2 10.2 0 2.8-1.1 5.3-3 7.1-1.9 1.9-4.4 3-7.2 3-5.6 0-10.2-4.6-10.2-10.2 0-2.8 1.1-5.3 3-7.2 1.9-1.8 4.4-2.9 7.2-2.9zm17.8 0c5.6 0 10.2 4.6 10.2 10.2 0 2.8-1.1 5.3-3 7.1-1.9 1.9-4.4 3-7.2 3-5.6 0-10.2-4.6-10.2-10.2 0-2.8 1.1-5.3 3-7.2 1.9-1.8 4.4-2.9 7.2-2.9zM41.5 45.7c5.6 0 10.2 4.6 10.2 10.2 0 2.8-1.1 5.3-3 7.1-1.9 1.9-4.4 3-7.2 3-5.6 0-10.2-4.6-10.2-10.2 0-2.8 1.1-5.3 3-7.2 1.9-1.8 4.4-2.9 7.2-2.9zm17.8 0c5.6 0 10.2 4.6 10.2 10.2 0 2.8-1.1 5.3-3 7.1-1.9 1.9-4.4 3-7.2 3-5.6 0-10.2-4.6-10.2-10.2 0-2.8 1.1-5.3 3-7.2 1.9-1.8 4.4-2.9 7.2-2.9z' fill='%23bbf7d0' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.1;
  z-index: -1;
  border-radius: 1rem;
}
</style>