<!-- src/modules/parcel/components/MdlCreateParcel.vue -->
<template>
    <div v-if="store.ui.openCreate" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="store.closeCreate()" />
        <div class="relative w-full max-w-md rounded-2xl bg-white/95 shadow-2xl border border-white/20 backdrop-blur-lg">
            <header class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 class="font-semibold text-slate-800 flex items-center gap-2">
                    <Icon icon="mdi:plus-circle" class="text-sky-500" />
                    Nueva parcela
                </h3>
                <button class="text-slate-400 hover:text-slate-600 transition-colors" @click="store.closeCreate()">
                    <Icon icon="mdi:close" />
                </button>
            </header>

            <form class="p-5 space-y-4" @submit.prevent="submit">
                <div>
                    <label class="block text-xs text-slate-500 mb-1 flex items-center gap-1" for="name">
                        <Icon icon="mdi:form-textbox" />
                        Nombre *
                    </label>
                    <input id="name" v-model.trim="store.ui.createForm.name" required
                        class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs text-slate-500 mb-1 flex items-center gap-1" for="area">
                            <Icon icon="mdi:ruler-square" />
                            Área m² *
                        </label>
                        <input id="area" v-model.number="store.ui.createForm.area_m2" type="number" min="0" step="0.01"
                            required
                            class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label class="block text-xs text-slate-500 mb-1 flex items-center gap-1" for="crop">
                            <Icon icon="mdi:sprout" />
                            Cultivo
                        </label>
                        <input id="crop" v-model.trim="store.ui.createForm.crop_type"
                            class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                    </div>
                </div>

                <div>
                    <label class="block text-xs text-slate-500 mb-1 flex items-center gap-1" for="loc">
                        <Icon icon="mdi:map-marker" />
                        Ubicación
                    </label>
                    <input id="loc" v-model.trim="store.ui.createForm.location"
                        class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs text-slate-500 mb-1 flex items-center gap-1" for="lat">
                            <Icon icon="mdi:latitude" />
                            Latitud
                        </label>
                        <input id="lat" v-model.number="store.ui.createForm.latitude" type="number" min="-90" max="90"
                            step="0.000001"
                            class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label class="block text-xs text-slate-500 mb-1 flex items-center gap-1" for="lng">
                            <Icon icon="mdi:longitude" />
                            Longitud
                        </label>
                        <input id="lng" v-model.number="store.ui.createForm.longitude" type="number" min="-180"
                            max="180" step="0.000001"
                            class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                    </div>
                </div>

                <div class="flex items-center gap-3 pt-2">
                    <div class="relative flex items-center">
                        <input id="active" v-model="store.ui.createForm.active" type="checkbox" 
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
                    <button type="button" @click="store.closeCreate()"
                        class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" :disabled="!canSubmit || store.ui.busy"
                        class="btn-sima disabled:opacity-60 disabled:cursor-not-allowed">
                        <Icon icon="mdi:content-save" v-if="!store.ui.busy" />
                        <Icon icon="mdi:loading" class="animate-spin" v-if="store.ui.busy" />
                        <span>{{ store.ui.busy ? 'Guardando…' : 'Guardar' }}</span>
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
const canSubmit = computed(() => !!store.ui.createForm.name && (store.ui.createForm.area_m2 ?? 0) >= 0);

async function submit() {
    if (!canSubmit.value) return;
    try {
        store.ui.busy = true;
        await store.createParcel({ ...store.ui.createForm });
        store.closeCreate();
    } finally {
        store.ui.busy = false;
    }
}
</script>

<style scoped>
/* Textura de tierra sutil para el fondo del modal */
.relative::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23e0f2fe' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.1;
  z-index: -1;
  border-radius: 1rem;
}
</style>