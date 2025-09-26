<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="store.ui.openDelete" class="fixed inset-0 z-[100] flex items-center justify-center">
        <div class="modal-backdrop" @click="store.closeDelete()" />
        <div class="modal-panel p-5 bg-farm-soft">
          <h3 class="text-base font-semibold text-slate-800">Eliminar unidad</h3>
          <p class="mt-2 text-sm text-slate-600">
            ¿Seguro que deseas eliminar
            <strong>{{ store.ui.selected?.serial_code }}</strong>? Esta acción no se puede deshacer.
          </p>

          <footer class="mt-4 flex items-center justify-end gap-2">
            <button type="button" @click="store.closeDelete()" class="btn-light">Cancelar</button>
            <button type="button" :disabled="store.ui.busy" @click="confirm" class="btn-danger disabled:opacity-60">
              {{ store.ui.busy ? 'Eliminando…' : 'Eliminar' }}
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useControlUnitStore } from '../stores/ControlUnitStore';
const store = useControlUnitStore();

async function confirm() {
  if (!store.ui.selected) return;
  try {
    store.ui.busy = true;
    await store.deleteUnit(store.ui.selected.id);
    store.closeDelete();
        store.fetchList();
  } finally {
    store.ui.busy = false;
  }
}
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .2s ease; }
.fade-enter-from,.fade-leave-to{ opacity: 0; }
</style>
