<!-- src/modules/parcel/components/ListParcel.vue -->
<template>
  <section class="space-y-6">
    <!-- Filtros mejorados -->
    <div class="panel-soft p-4 md:p-6">
      <h2 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Icon icon="mdi:filter" />
        Filtros de búsqueda
      </h2>
      <form class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end" @submit.prevent="applyFilters">
        <div class="lg:col-span-4">
          <label for="q" class="block text-xs text-slate-500 mb-1 flex items-center gap-1">
            <Icon icon="mdi:magnify" class="text-sky-500" />
            Buscar
          </label>
          <input
            id="q"
            v-model.trim="store.filters.q"
            type="text"
            placeholder="Nombre, lugar, cultivo…"
            class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
        <div class="lg:col-span-2">
          <label for="status" class="block text-xs text-slate-500 mb-1">Estado</label>
          <div class="relative">
            <select
              id="status"
              v-model="store.filters.status"
              class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none"
            >
              <option value="all">Todas</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
            </select>
            <Icon icon="mdi:chevron-down" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div class="lg:col-span-2">
          <label for="from" class="block text-xs text-slate-500 mb-1">Desde</label>
          <input
            id="from"
            v-model="store.filters.fromDate"
            type="date"
            class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
        <div class="lg:col-span-2">
          <label for="to" class="block text-xs text-slate-500 mb-1">Hasta</label>
          <input
            id="to"
            v-model="store.filters.toDate"
            type="date"
            class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
        <div class="lg:col-span-2 flex gap-2">
          <button type="submit" class="btn-sima flex-1">
            <Icon icon="mdi:filter" />
            Filtrar
          </button>
          <button type="button" @click="resetFilters" class="rounded-xl border border-slate-300 text-slate-700 text-sm font-medium px-4 py-2.5 hover:bg-slate-50 transition-colors">
            Limpiar
          </button>
        </div>
      </form>
    </div>

    <!-- Acciones -->
    <div class="flex justify-end">
      <button @click="store.openCreate()" class="btn-sima">
        <Icon icon="mdi:plus" />
        Nueva parcela
      </button>
    </div>

    <!-- Grid de cards mejorado con texturas -->
    <div v-if="store.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <div v-for="n in 8" :key="n" class="rounded-2xl border border-slate-200 bg-white/80 p-5 animate-pulse backdrop-blur-sm">
        <div class="h-5 w-2/3 bg-slate-200 rounded mb-3" />
        <div class="h-4 w-1/3 bg-slate-200 rounded mb-5" />
        <div class="grid grid-cols-2 gap-3">
          <div class="h-3 bg-slate-200 rounded" />
          <div class="h-3 bg-slate-200 rounded" />
          <div class="h-3 bg-slate-200 rounded" />
          <div class="h-3 bg-slate-200 rounded" />
        </div>
      </div>
    </div>

    <div v-else-if="!store.items.length" class="border border-slate-200 rounded-2xl p-8 text-center text-slate-600 bg-white/80 backdrop-blur-sm">
      <div class="flex justify-center mb-4">
        <Icon icon="mdi:field-off" class="text-4xl text-slate-400" />
      </div>
      <p class="mb-2 text-lg">No encontramos parcelas con los filtros actuales.</p>
      <div class="flex items-center justify-center gap-3 mt-4">
        <button @click="resetFilters" class="rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 transition-colors">
          Quitar filtros
        </button>
        <button @click="store.openCreate()" class="btn-sima">
          Crear parcela
        </button>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <article
        v-for="(p, index) in store.items"
        :key="p.id"
        class="group relative rounded-2xl border border-slate-200 bg-cover bg-center bg-no-repeat overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        :class="[
          index % 3 === 0 ? 'texture-earth' : 
          index % 3 === 1 ? 'texture-plants' : 'texture-crops'
        ]"
      >
        <div class="absolute inset-0 bg-gradient-to-b from-white/50 to-white/90 z-0"></div>
        
        <header class="p-5 flex items-start justify-between gap-3 relative z-10">
          <div class="flex-1 min-w-0">
            <h3 class="text-base font-semibold text-slate-800 flex items-center gap-2 truncate">
              <span class="inline-flex size-2.5 rounded-full" :class="p.active ? 'bg-emerald-500' : 'bg-rose-400'" />
              {{ p.name }}
            </h3>
            <p v-if="p.location" class="text-xs text-slate-500 mt-1 flex items-center gap-1 truncate">
              <Icon icon="mdi:map-marker" class="flex-shrink-0" />
              <span class="truncate">{{ p.location }}</span>
            </p>
          </div>
          <div class="text-right flex-shrink-0">
            <span
              class="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full border flex items-center gap-1"
              :class="p.active ? 'text-emerald-700 border-emerald-200 bg-emerald-50' : 'text-rose-700 border-rose-200 bg-rose-50'"
            >
              <Icon :icon="p.active ? 'mdi:check-circle' : 'mdi:close-circle'" />
              {{ p.active ? 'Activa' : 'Inactiva' }}
            </span>
          </div>
        </header>

        <div class="px-5 pb-5 relative z-10">
          <div class="grid grid-cols-2 gap-3 text-xs text-slate-600">
            <div>
              <p class="text-slate-400 flex items-center gap-1">
                <Icon icon="mdi:sprout" />
                Cultivo
              </p>
              <p class="font-medium mt-1 truncate">{{ p.crop_type || '—' }}</p>
            </div>
            <div>
              <p class="text-slate-400 flex items-center gap-1">
                <Icon icon="mdi:ruler-square" />
                Área
              </p>
              <p class="font-medium mt-1">{{ fmtArea(p.area_m2) }}</p>
            </div>
            <div>
              <p class="text-slate-400 flex items-center gap-1">
                <Icon icon="mdi:latitude" />
                Lat
              </p>
              <p class="font-medium mt-1">{{ p.latitude ?? '—' }}</p>
            </div>
            <div>
              <p class="text-slate-400 flex items-center gap-1">
                <Icon icon="mdi:longitude" />
                Lng
              </p>
              <p class="font-medium mt-1">{{ p.longitude ?? '—' }}</p>
            </div>
          </div>

          <footer class="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <button @click="store.openEdit(p)" class="text-xs font-medium text-sky-700 hover:text-sky-800 flex items-center gap-1 transition-colors">
              <Icon icon="mdi:pencil" />
              Editar
            </button>
            <button @click="store.openDelete(p)" class="text-xs font-medium text-rose-700 hover:text-rose-800 flex items-center gap-1 transition-colors">
              <Icon icon="mdi:delete" />
              Eliminar
            </button>
          </footer>
        </div>

        <div class="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-sky-400 via-sky-500 to-cyan-400" />
      </article>
    </div>

    <!-- Paginación mejorada -->
    <div class="panel-soft p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div class="text-sm text-slate-600 flex items-center gap-1">
        <Icon icon="mdi:file-document-multiple" />
        <span>Página <strong>{{ store.page }}</strong> de <strong>{{ store.lastPage }}</strong> · {{ store.total }} resultados</span>
      </div>
      <div class="flex items-center gap-3">
        <label class="text-sm text-slate-600 flex items-center gap-2">
          <span>Por página</span>
          <div class="relative">
            <select :value="store.perPage" @change="changePerPage($event)" class="rounded-xl border border-slate-200 px-3 py-2 text-sm appearance-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="24">24</option>
            </select>
            <Icon icon="mdi:chevron-down" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none text-xs" />
          </div>
        </label>
        <div class="flex items-center gap-2">
          <button class="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors" :disabled="store.page <= 1" @click="changePage(store.page - 1)">
            <Icon icon="mdi:chevron-left" />
          </button>
          <button class="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors" :disabled="store.page >= store.lastPage" @click="changePage(store.page + 1)">
            <Icon icon="mdi:chevron-right" />
          </button>
        </div>
      </div>
    </div>

    <!-- Montaje de modales -->
    <MdlCreateParcel />
    <MdlUpdateParcel />
    <MdlDeleteParcel />
  </section>
</template>

<script setup lang="ts">
import { useParcelStore } from '../stores/ParcelStore';
import MdlCreateParcel from './MdlCreateParcel.vue';
import MdlUpdateParcel from './MdlUpdateParcel.vue';
import MdlDeleteParcel from './MdlDeleteParcel.vue';
import { Icon } from '@iconify/vue';

const store = useParcelStore();

function fmtArea(m2: number) {
  return m2 >= 10000 ? `${(m2 / 10000).toFixed(2)} ha` : `${m2.toLocaleString()} m²`;
}
function applyFilters() {
  store.setPage(1);
  store.fetchList({ page: 1 });
}
function resetFilters() {
  store.setFilters({ q: '', status: 'all', fromDate: '', toDate: '' });
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

<style scoped>
/* Textura de tierra para tarjetas de parcelas */
.texture-earth {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)),
    url("data:image/svg+xml,%3Csvg%20width='100'%20height='100'%20viewBox='0%200%20100%20100'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cg%20fill='none'%20fill-rule='evenodd'%3E%3Cg%20fill='%23766d5c'%20fill-opacity='0.4'%3E%3Cpath%20d='M0%2050%20L100%2050%20L100%2060%20L0%2060%20Z'/ %3E%3Cpath%20d='M50%200%20L50%20100%20L60%20100%20L60%200%20Z'/ %3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  background-repeat: repeat;
}


.texture-plants {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)),
    url("data:image/svg+xml,%3Csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cc fill='none'%3E%3Ccircle%20cx='30'%20cy='30'%20r='20'%20fill='%2310b981'%20fill-opacity='0.1'/%3E%3Ccircle%20cx='30'%20cy='30'%20r='10'%20fill='%2310b981'%20fill-opacity='0.2'/%3E%3C/c%3E%3C/svg%3E");
  background-repeat: repeat;
}


/* Textura de cultivos para tarjetas de parcelas */
.texture-crops {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)),
    url("data:image/svg+xml,%3Csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3E%3Crect%20x='0'%20y='0'%20width='30'%20height='30'%20fill='%23f59e0b'%20fill-opacity='0.1'/%3E%3Crect%20x='30'%20y='30'%20width='30'%20height='30'%20fill='%23f59e0b'%20fill-opacity='0.1'/%3E%3C/svg%3E");
  background-repeat: repeat;
}


/* Estilos para el panel suave */
.panel-soft {
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* Estilos para botones con gradiente */
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

.btn-sima:focus-visible {
  outline: none;
  ring: 2px;
  ring-color: white;
  ring-offset: 2px;
}

/* Estilos para botón de peligro */
.btn-danger {
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
  background-image: linear-gradient(135deg, #ff5277 0%, #ff3d3d 100%);
}

.btn-danger:hover {
  filter: brightness(1.04);
}
</style>