<template>
  <section class="space-y-4">
    <!-- Filtros sticky -->
    <div class="filters-sticky -mx-3 sm:-mx-4 px-3 sm:px-4 py-2">
      <form class="grid grid-cols-1 xl:grid-cols-12 gap-2 sm:gap-3 items-end" @submit.prevent="applyFilters">
        <div class="xl:col-span-3">
          <label class="block text-[11px] text-slate-500 mb-1" for="q">Buscar</label>
          <input id="q" v-model.trim="store.filters.q" type="text" placeholder="Serie, modelo, MQTT client…"
            class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80" />
        </div>

        <div class="xl:col-span-2">
          <label class="block text-[11px] text-slate-500 mb-1" for="status">Estado</label>
          <select id="status" v-model="store.filters.status"
            class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80">
            <option value="all">Todos</option>
            <option value="online">En línea</option>
            <option value="offline">Fuera de línea</option>
            <option value="maintenance">Mantenimiento</option>
          </select>
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

        <div class="xl:col-span-2">
          <label class="block text-[11px] text-slate-500 mb-1" for="fi">Instalado desde</label>
          <input id="fi" v-model="store.filters.fromInstalled" type="date"
            class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80" />
        </div>
        <div class="xl:col-span-2">
          <label class="block text-[11px] text-slate-500 mb-1" for="ti">Instalado hasta</label>
          <input id="ti" v-model="store.filters.toInstalled" type="date"
            class="w-full rounded-2xl border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white/80" />
        </div>

        <div class="xl:col-span-1 flex gap-2">
          <button type="submit" class="flex-1 btn-primary-sima">Filtrar</button>
          <button type="button" @click="resetFilters" class="btn-light">Limpiar</button>
        </div>
      </form>
    </div>

    <!-- Acciones -->
    <div class="flex justify-end">
      <button @click="store.openCreate()" class="btn-primary-sima">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg>
        Nueva unidad
      </button>
    </div>

    <!-- Grid de cards -->
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
      <p class="mb-2 text-slate-700">No encontramos unidades con los filtros actuales.</p>
      <div class="flex items-center justify-center gap-2">
        <button @click="resetFilters" class="btn-light">Quitar filtros</button>
        <button @click="store.openCreate()" class="btn-primary-sima">Crear unidad</button>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <article v-for="u in store.items" :key="u.id" class="parcel-card">
        <div class="h-1 w-full parcel-accent" />

        <header class="p-4 flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="text-base font-semibold text-slate-800 flex items-center gap-2 clamp-1">
              <span class="inline-flex size-2.5 rounded-full"
                    :class="u.status==='online' ? 'bg-emerald-500' : u.status==='maintenance' ? 'bg-amber-500' : 'bg-rose-400'"/>
              {{ u.serial_code }}
            </h3>
            <p class="text-[12px] text-slate-500 clamp-1">Modelo: {{ u.model }}</p>
            <p v-if="u.mqtt_client_id" class="text-[12px] text-slate-500 clamp-1">MQTT: {{ u.mqtt_client_id }}</p>
          </div>

          <div class="text-right space-y-1">
            <span class="pill" :class="u.active ? 'pill-success' : ''">{{ u.active ? 'Activo' : 'Inactivo' }}</span>
            <div class="text-[11px] text-slate-500">
              <span class="uppercase">{{ u.status }}</span>
            </div>
          </div>
        </header>

        <div class="px-4 pb-4">
          <div class="rounded-xl p-3 bg-farm-soft border text-xs text-slate-700 grid grid-cols-2 gap-3">
            <div>
              <p class="text-slate-400">Instalado</p>
              <p class="font-medium">{{ fmtDate(u.installed_at) }}</p>
            </div>
            <div>
              <p class="text-slate-400">Último visto</p>
              <p class="font-medium">{{ fmtDate(u.last_seen_at) }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-slate-400">Tópicos</p>
              <p class="font-medium clamp-1">{{ u.status_topic || '—' }} / {{ u.lwt_topic || '—' }}</p>
            </div>
          </div>

          <footer class="mt-4 flex items-center justify-between">
            <button @click="store.openEdit(u)" class="text-xs font-medium text-sky-700 hover:underline">Editar</button>
            <button @click="store.openDelete(u)" class="text-xs font-medium text-rose-700 hover:underline">Eliminar</button>
          </footer>
        </div>
      </article>
    </div>

    <!-- Paginación -->
    <div class="panel-soft border flex flex-col sm:flex-row gap-3 items-center justify-between p-3">
      <div class="text-sm text-slate-700">
        Página <strong>{{ store.page }}</strong> de <strong>{{ store.lastPage }}</strong> · {{ store.total }} resultados
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm text-slate-700">Por página</label>
        <select :value="store.perPage" @change="changePerPage($event)" class="rounded-2xl border px-2 py-1 text-sm bg-white/80">
          <option value="6">6</option>
          <option value="12">12</option>
          <option value="24">24</option>
        </select>
        <div class="flex items-center gap-1">
          <button class="btn-light px-3 py-1 text-sm disabled:opacity-50" :disabled="store.page <= 1" @click="changePage(store.page - 1)">Anterior</button>
          <button class="btn-light px-3 py-1 text-sm disabled:opacity-50" :disabled="store.page >= store.lastPage" @click="changePage(store.page + 1)">Siguiente</button>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <MdlCreateControlUnit />
    <MdlUpdateControlUnit />
    <MdlDeleteControlUnit />
  </section>
</template>

<script setup lang="ts">
import { useControlUnitStore } from '../stores/ControlUnitStore';
import MdlCreateControlUnit from './MdlCreateControlUnit.vue';
import MdlUpdateControlUnit from './MdlUpdateControlUnit.vue';
import MdlDeleteControlUnit from './MdlDeleteControlUnit.vue';

const store = useControlUnitStore();

function fmtDate(v?: string | null) {
  if (!v) return '—';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleString();
}
function applyFilters() {
  store.setPage(1);
  store.fetchList({ page: 1 });
}
function resetFilters() {
  store.setFilters({ q: '', status: 'all', active: 'all', fromInstalled: '', toInstalled: '', fromSeen: '', toSeen: '' });
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
