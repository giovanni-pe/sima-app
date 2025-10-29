<template>
  <div v-if="store.ui.openCreate" class="fixed inset-0 z-[100] flex items-center justify-center">
    <div class="modal-backdrop" @click="store.closeCreate()" />
    <div class="modal-panel bg-farm-soft">
      <header class="px-4 py-3 border-b flex items-center justify-between">
        <h3 class="font-semibold">Nuevo sensor</h3>
        <button class="text-slate-500 hover:text-slate-700" @click="store.closeCreate()">✕</button>
      </header>


      <form class="p-4 space-y-3" @submit.prevent="submit">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs text-slate-500 mb-1" for="name">Nombre *</label>
            <input id="name" v-model.trim="store.ui.createForm.name" required
              class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80" />
          </div>
          <div>
            <label class="block text-xs text-slate-500 mb-1" for="type">Tipo *</label>
            <input id="type" v-model.trim="store.ui.createForm.type" required placeholder="dht11, dht22, ..."
              class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80" />
          </div>
        </div>


        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div class="flex items-center justify-between">
              <label class="block text-xs text-slate-500 mb-1" for="cu">Unidad de control *</label>
              <button type="button" class="text-[11px] text-sky-700 hover:underline"
                @click="store.fetchControlUnitOptions(true)">Recargar</button>
            </div>
            <select id="cu" v-model.number="store.ui.createForm.control_unit_id" required :disabled="store.cuLoading"
              class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80">
              <option :value="0" disabled>{{ store.cuLoading ? 'Cargando…' : 'Seleccione unidad' }}</option>
              <option v-for="cu in store.cuOptions" :key="cu.id" :value="cu.id">
                #{{ cu.id }} — {{ cu.serial_code }}<span v-if="cu.model"> · {{ cu.model }}</span>
              </option>
            </select>
          </div>
          <div class="flex items-center gap-2 pt-6">
            <input id="active" v-model="store.ui.createForm.active" type="checkbox" class="rounded border" />
            <label for="active" class="text-sm">Activo</label>
          </div>
        </div>


        <footer class="pt-2 flex items-center justify-end gap-2">
          <button type="button" @click="store.closeCreate()" class="btn-light">Cancelar</button>
          <button type="submit" :disabled="!canSubmit || store.ui.busy" class="btn-primary-sima disabled:opacity-60">
            {{ store.ui.busy ? 'Guardando…' : 'Guardar' }}
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue';
import { useSensorStore } from '../stores/SensorsStore';
const store = useSensorStore();


const canSubmit = computed(() =>
  !!store.ui.createForm.name &&
  !!store.ui.createForm.type &&
  (store.ui.createForm.control_unit_id ?? 0) > 0
);


async function submit() {
  if (!canSubmit.value) return;
  try {
    store.ui.busy = true;
    await store.createSensor({ ...store.ui.createForm });
    store.closeCreate();
  } finally {
    store.ui.busy = false;
  }
}
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>