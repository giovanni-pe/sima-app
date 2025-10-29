<template>
    <section class="space-y-4">
        <!-- Filtros -->
        <div class="filters-sticky -mx-3 sm:-mx-4 px-3 sm:px-4 py-2">
            <form class="grid grid-cols-1 xl:grid-cols-12 gap-2 sm:gap-3 items-end" @submit.prevent="applyFilters">
                <div class="xl:col-span-4">
                    <label class="block text-[11px] text-slate-500 mb-1" for="q">Buscar</label>
                    <input id="q" v-model.trim="store.filters.q" type="text" placeholder="Nombre o tipo"
                        class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80" />
                </div>

                <div class="xl:col-span-3">
                    <label class="block text-[11px] text-slate-500 mb-1" for="type">Tipo</label>
                    <input id="type" v-model.trim="typeFilterModel" type="text" placeholder="dht11, dht22, ..."
                        class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80" />
                </div>

                <div class="xl:col-span-2">
                    <label class="block text-[11px] text-slate-500 mb-1" for="active">Activo</label>
                    <select id="active" v-model="store.filters.active"
                        class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80">
                        <option value="all">Todos</option>
                        <option value="1">Activos</option>
                        <option value="0">Inactivos</option>
                    </select>
                </div>

                <div class="xl:col-span-3 flex gap-2">
                    <button type="submit" class="flex-1 btn-primary-sima">Filtrar</button>
                    <button type="button" @click="resetFilters" class="btn-light">Limpiar</button>
                </div>
            </form>
        </div>

        <!-- Acciones -->
        <div class="flex justify-end">
            <button @click="store.openCreate()" class="btn-primary-sima">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor">
                    <path d="M12 5v14M5 12h14" />
                </svg>
                Nuevo sensor
            </button>
        </div>

        <!-- Grid -->
        <div v-if="store.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div v-for="n in 8" :key="n" class="parcel-card p-4 animate-pulse bg-farm-soft">
                <div class="h-4 w-2/3 bg-slate-200/70 rounded mb-2" />
                <div class="h-3 w-1/2 bg-slate-200/70 rounded mb-4" />
                <div class="grid grid-cols-2 gap-3">
                    <div class="h-3 bg-slate-200/70 rounded" />
                    <div class="h-3 bg-slate-200/70 rounded" />
                    <div class="h-3 bg-slate-200/70 rounded" />
                    <div class="h-3 bg-slate-200/70 rounded" />
                </div>
            </div>
        </div>

        <div v-else-if="!store.items.length" class="panel-soft border p-6 text-center">
            <p class="mb-2 text-slate-700">No encontramos sensores con los filtros actuales.</p>
            <div class="flex items-center justify-center gap-2">
                <button @click="resetFilters" class="btn-light">Quitar filtros</button>
                <button @click="store.openCreate()" class="btn-primary-sima">Crear sensor</button>
            </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <article v-for="s in store.items" :key="s.id || `${s.name}-${s.type}-${s.control_unit_id}`"
                class="parcel-card">
                <div class="h-1 w-full parcel-accent" />

                <header class="p-4 flex items-start justify-between gap-3">
                    <div class="min-w-0">
                        <h3 class="text-base font-semibold text-slate-800 clamp-1">{{ s.name }}</h3>
                        <p class="text-[12px] text-slate-500 clamp-1">Tipo: {{ s.type }}</p>
                        <p class="text-[12px] text-slate-500 clamp-1">CU: #{{ s.control_unit_id }}</p>
                    </div>

                    <div class="text-right space-y-1">
                        <span class="pill" :class="s.active ? 'pill-success' : ''">{{ s.active ? 'Activo' : 'Inactivo'
                        }}</span>
                        <div class="text-[11px] text-slate-500">
                            <span v-if="s.id">ID: {{ s.id }}</span>
                        </div>
                    </div>
                </header>

                <footer class="px-4 pb-4 flex items-center justify-between">
                    <div class="flex gap-3">
                        <button @click="store.openShow(s)"
                            class="text-xs font-medium text-sky-700 hover:underline">Ver</button>
                        <button @click="store.openEdit(s)"
                            class="text-xs font-medium text-sky-700 hover:underline">Editar</button>
                    </div>
                    <button @click="store.openDelete(s)"
                        class="text-xs font-medium text-rose-700 hover:underline">Eliminar</button>
                </footer>
            </article>
        </div>

        <!-- Paginación -->
        <div class="panel-soft border flex flex-col sm:flex-row gap-3 items-center justify-between p-3">
            <div class="text-sm text-slate-700">
                Página <strong>{{ store.page }}</strong> de <strong>{{ store.lastPage }}</strong> · {{ store.total }}
                resultados
            </div>
            <div class="flex items-center gap-2">
                <label class="text-sm text-slate-700">Por página</label>
                <select :value="store.perPage" @change="changePerPage($event)"
                    class="rounded-2xl border px-2 py-1 text-sm bg-white/80">
                    <option value="6">6</option>
                    <option value="12">12</option>
                    <option value="24">24</option>
                </select>
                <div class="flex items-center gap-1">
                    <button class="btn-light px-3 py-1 text-sm disabled:opacity-50" :disabled="store.page <= 1"
                        @click="changePage(store.page - 1)">Anterior</button>
                    <button class="btn-light px-3 py-1 text-sm disabled:opacity-50"
                        :disabled="store.page >= store.lastPage" @click="changePage(store.page + 1)">Siguiente</button>
                </div>
            </div>
        </div>

        <!-- Modales -->
        <MdlCreateSensors />
        <MdlUpdateSensors />
        <MdlDeleteSensors />
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
// Si tu store está en 'stores/SensorStore.ts' (singular), deja esta ruta.
// Si lo tienes en 'stores/SensorsStore.ts' (plural), ajusta el import.
import { useSensorStore } from '../stores/SensorsStore';

import MdlCreateSensors from './MdlCreateSensors.vue';
import MdlUpdateSensors from './MdlUpdateSensors.vue';
import MdlDeleteSensors from './MdlDeleteSensors.vue';
const store = useSensorStore();

const typeFilterModel = computed({
    get: () => (store.filters.type === 'all' ? '' : (store.filters.type as string)),
    set: (val: string) => store.setFilters({ type: val?.trim() || 'all' }),
});

function applyFilters() {
    store.setPage(1);
    store.fetchList({ page: 1 });
}
function resetFilters() {
    store.setFilters({ q: '', type: 'all', active: 'all' });
    store.setPage(1);
    store.fetchList({ page: 1 });
}
function changePage(n: number) {
    store.setPage(n);
    store.fetchList({ page: n });
}
function changePerPage(e: Event) {
    const v = Number((e.target as HTMLSelectElement).value);
    store.setPerPage(v);
    store.setPage(1);
    store.fetchList({ page: 1, per_page: v });
}
</script>
