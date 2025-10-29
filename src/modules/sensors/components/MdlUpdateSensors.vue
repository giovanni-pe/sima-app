<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="store.ui.openEdit" class="fixed inset-0 z-[100] flex items-center justify-center">
        <div class="modal-backdrop" @click="store.closeEdit()" />
        <div class="modal-panel bg-farm-soft">
          <header class="px-4 py-3 border-b flex items-center justify-between">
            <h3 class="font-semibold">Editar sensor</h3>
            <button class="text-slate-500 hover:text-slate-700" @click="store.closeEdit()">✕</button>
          </header>

          <form class="p-4 space-y-3" @submit.prevent="submit">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-slate-500 mb-1" for="name">Nombre *</label>
                <input
                  id="name"
                  v-model.trim="store.ui.editForm.name"
                  required
                  class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80"
                />
              </div>
              <div>
                <label class="block text-xs text-slate-500 mb-1" for="type">Tipo *</label>
                <input
                  id="type"
                  v-model.trim="store.ui.editForm.type"
                  required
                  class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div class="flex items-center justify-between">
                  <label class="block text-xs text-slate-500 mb-1" for="cu">Unidad de control *</label>
                  <button
                    type="button"
                    class="text-[11px] text-sky-700 hover:underline"
                    @click="store.fetchControlUnitOptions(true)"
                  >Recargar</button>
                </div>
                <select
                  id="cu"
                  v-model.number="store.ui.editForm.control_unit_id"
                  required
                  :disabled="store.cuLoading"
                  class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80"
                >
                  <option :value="0" disabled>{{ store.cuLoading ? 'Cargando…' : 'Seleccione unidad' }}</option>
                  <option v-for="cu in store.cuOptions" :key="cu.id" :value="cu.id">
                    #{{ cu.id }} — {{ cu.serial_code }}<span v-if="cu.model"> · {{ cu.model }}</span>
                  </option>
                </select>
              </div>
              <div class="flex items-center gap-2 pt-6">
                <input id="active" v-model="store.ui.editForm.active" type="checkbox" class="rounded border" />
                <label for="active" class="text-sm">Activo</label>
              </div>
            </div>

            <footer class="pt-2 flex items-center justify-end gap-2">
              <button type="button" @click="store.closeEdit()" class="btn-light">Cancelar</button>
              <button type="submit" :disabled="!canSubmit || store.ui.busy" class="btn-primary-sima disabled:opacity-60">
                {{ store.ui.busy ? 'Guardando…' : 'Guardar cambios' }}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSensorStore } from '../stores/SensorsStore'; // ajusta a SensorStore si usas singular
const store = useSensorStore();

const canSubmit = computed(() =>
  !!store.ui.editForm.name &&
  !!store.ui.editForm.type &&
  (store.ui.editForm.control_unit_id ?? 0) > 0
);

async function submit() {
  if (!store.ui.selected || !canSubmit.value) return;
  try {
    store.ui.busy = true;
    await store.updateSensor(store.ui.selected.id, { ...store.ui.editForm });
    store.closeEdit();
  } finally {
    store.ui.busy = false;
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
