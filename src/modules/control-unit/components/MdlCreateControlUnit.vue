<!-- src/modules/control-units/components/MdlCreateControlUnit.vue -->
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="store.ui.openCreate" class="fixed inset-0 z-[100] flex items-center justify-center">
        <div class="modal-backdrop" @click="store.closeCreate()" />
        <div class="modal-panel bg-farm-soft">
          <header class="px-4 py-3 border-b flex items-center justify-between">
            <h3 class="font-semibold">Nueva unidad de control</h3>
            <button class="text-slate-500 hover:text-slate-700" @click="store.closeCreate()">✕</button>
          </header>

          <form class="p-4 space-y-3" @submit.prevent="submit">
            <!-- fila 1 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-slate-500 mb-1" for="serial">Serie *</label>
                <input id="serial" v-model.trim="store.ui.createForm.serial_code" required
                       class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80" />
              </div>
              <div>
                <label class="block text-xs text-slate-500 mb-1" for="model">Modelo *</label>
                <input id="model" v-model.trim="store.ui.createForm.model" required
                       class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80" />
              </div>
            </div>

            <!-- fila 2 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div class="flex items-center justify-between">
                  <label class="block text-xs text-slate-500 mb-1" for="parcel">Parcela *</label>
                  <button type="button" class="text-[11px] text-sky-700 hover:underline"
                          @click="store.fetchParcelOptions(true)">
                    Recargar
                  </button>
                </div>
                <select id="parcel" v-model.number="store.ui.createForm.parcel_id" required
                        :disabled="store.parcelOptionsLoading"
                        class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80">
                  <option value="" disabled>{{ store.parcelOptionsLoading ? 'Cargando…' : 'Seleccione parcela' }}</option>
                  <option v-for="p in store.parcelOptions" :key="p.id" :value="p.id">
                    {{ p.name }} <span v-if="p.location">— {{ p.location }}</span>
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs text-slate-500 mb-1" for="client">MQTT Client ID *</label>
                <input id="client" v-model.trim="store.ui.createForm.mqtt_client_id" required
                       class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80" />
              </div>
            </div>

            <!-- fila 3 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-slate-500 mb-1" for="installed">Instalado en</label>
                <input id="installed" v-model="store.ui.createForm.installed_at" type="datetime-local"
                       class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80" />
              </div>
              <div>
                <label class="block text-xs text-slate-500 mb-1" for="status">Estado *</label>
                <select id="status" v-model="store.ui.createForm.status" required
                        class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80">
                  <option value="online">online</option>
                  <option value="offline">offline</option>
                  <option value="maintenance">maintenance</option>
                </select>
              </div>
            </div>

            <!-- resto igual -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-slate-500 mb-1" for="user">MQTT User</label>
                <input id="user" v-model.trim="store.ui.createForm.mqtt_username"
                       class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80" />
              </div>
              <div>
                <label class="block text-xs text-slate-500 mb-1" for="pass">MQTT Password (enc)</label>
                <input id="pass" v-model.trim="store.ui.createForm.mqtt_password_enc"
                       class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-slate-500 mb-1" for="st">Topic estado</label>
                <input id="st" v-model.trim="store.ui.createForm.status_topic"
                       class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80" />
              </div>
              <div>
                <label class="block text-xs text-slate-500 mb-1" for="lwt">Topic LWT</label>
                <input id="lwt" v-model.trim="store.ui.createForm.lwt_topic"
                       class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-slate-500 mb-1" for="seen">Último visto</label>
                <input id="seen" v-model="store.ui.createForm.last_seen_at" type="datetime-local"
                       class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80" />
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
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useControlUnitStore } from '../stores/ControlUnitStore';
const store = useControlUnitStore();

const canSubmit = computed(() =>
  !!store.ui.createForm.serial_code &&
  !!store.ui.createForm.model &&
  !!store.ui.createForm.status &&
  !!store.ui.createForm.mqtt_client_id &&
  (store.ui.createForm.parcel_id ?? 0) > 0
);

async function submit() {
  if (!canSubmit.value) return;
  try {
    store.ui.busy = true;
    await store.createUnit({ ...store.ui.createForm });
    store.closeCreate();
  } finally {
    store.ui.busy = false;
  }
}
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .2s ease; }
.fade-enter-from,.fade-leave-to{ opacity: 0; }
</style>
