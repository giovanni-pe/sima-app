#!/usr/bin/env ts-node
/**
 * SIMA-UNAS Module Scaffolder (Vue 3 + TypeScript)
 * ------------------------------------------------
 * Crea la estructura:
 * src/modules/<kebab>/
 *   Interfaces/index.ts
 *   components/List<Pascal>.vue
 *   components/MdlCreate<Pascal>.vue
 *   components/MdlUpdate<Pascal>.vue
 *   components/MdlDelete<Pascal>.vue
 *   services/<Pascal>Service.ts
 *   stores/<Pascal>Store.ts
 *   pages/<Pascal>Page.vue
 *
 * Uso:
 *   npx ts-node scaffold-module.ts Parcel
 *   npx ts-node scaffold-module.ts Parcel --base src/modules --force
 *
 * Opciones:
 *   --base <ruta>   Directorio base de módulos (default: src/modules)
 *   --force         Sobrescribe archivos existentes
 *   --dry           Simulación (no escribe archivos)
 *
 * Requisitos:
 *   - Node 18+
 *   - ts-node o tsx (o compila este archivo a JS con tsc y ejecútalo con node)
 */

import { promises as fs } from 'node:fs';
import * as path from 'node:path';

type Flags = {
  base: string;
  force: boolean;
  dry: boolean;
};

function parseArgs(argv: string[]) {
  const positional: string[] = [];
  const flags: Flags = { base: 'src/modules', force: false, dry: false };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--force') flags.force = true;
    else if (a === '--dry') flags.dry = true;
    else if (a === '--base') {
      const v = argv[++i];
      if (!v) throw new Error('--base requiere una ruta');
      flags.base = v;
    } else if (a.startsWith('--base=')) {
      flags.base = a.split('=')[1]!;
    } else if (a.startsWith('-')) {
      throw new Error(`Opción no reconocida: ${a}`);
    } else {
      positional.push(a);
    }
  }

  if (positional.length < 1) {
    console.error('❌ Debes indicar el nombre del módulo. Ej: Parcel');
    console.error('   Ejemplo: npx ts-node scaffold-module.ts Parcel --base src/modules');
    process.exit(1);
  }

  return { name: positional[0]!, flags };
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const toWords = (s: string) =>
  s
    .replace(/[_\-]+/g, ' ')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .trim()
    .split(/\s+/);

const toPascal = (s: string) => toWords(s).map(w => capitalize(w.toLowerCase())).join('');
const toCamel = (s: string) => {
  const p = toPascal(s);
  return p.charAt(0).toLowerCase() + p.slice(1);
};
const toKebab = (s: string) =>
  toWords(s)
    .join('-')
    .replace(/[^a-zA-Z0-9\-]/g, '-')
    .replace(/\-+/g, '-')
    .toLowerCase();

const pluralize = (s: string) => (s.endsWith('s') ? s : s + 's');

function fill(tpl: string, ctx: Record<string, string>) {
  return tpl
    .replaceAll('{{Pascal}}', ctx.Pascal)
    .replaceAll('{{camel}}', ctx.camel)
    .replaceAll('{{kebab}}', ctx.kebab)
    .replaceAll('{{kebabPlural}}', ctx.kebabPlural);
}

async function ensureDir(dir: string, dry: boolean) {
  if (dry) return;
  await fs.mkdir(dir, { recursive: true });
}

async function writeFileSafe(file: string, content: string, force: boolean, dry: boolean) {
  if (!force) {
    try {
      await fs.access(file);
      console.log(`⏭️  Existe, no se sobreescribe: ${file}`);
      return;
    } catch {}
  }
  if (dry) {
    console.log(`📝 (dry) escribiría: ${file}`);
    return;
  }
  await fs.writeFile(file, content, 'utf8');
  console.log(`✅ creado: ${file}`);
}

const TPL = {
  interfacesIndex: `// Auto-generado por scaffolder
export interface {{Pascal}} {
  id: number;
  name: string;
  areaHa?: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface {{Pascal}}Filter {
  q?: string;
  status?: 'active' | 'inactive' | 'all';
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
`,

  listVue: `<template>
  <div class="rounded-xl border bg-white p-4">
    <div class="mb-3 flex items-center justify-between gap-2">
      <h3 class="text-lg font-semibold">{{ title ?? '${'Lista de ' + '${' + 'singular' + '}' }' }}</h3>
      <div class="flex items-center gap-2">
        <input
          v-model="localFilter.q"
          @keyup.enter="applyFilter"
          type="text"
          placeholder="Buscar..."
          class="rounded-lg border px-3 py-2 text-sm"
        />
        <button class="rounded-xl px-3 py-2 text-sm shadow bg-black text-white" @click="emit('create')">
          Nuevo {{ singular }}
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b">
            <th class="py-2 pr-2">ID</th>
            <th class="py-2 pr-2">Nombre</th>
            <th class="py-2 pr-2">Estado</th>
            <th class="py-2 pr-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in items" :key="row.id" class="border-b hover:bg-gray-50">
            <td class="py-2 pr-2">{{ row.id }}</td>
            <td class="py-2 pr-2">{{ row.name }}</td>
            <td class="py-2 pr-2">
              <span :class="row.status === 'active' ? 'text-green-600' : 'text-gray-500'">{{ row.status }}</span>
            </td>
            <td class="py-2 pr-2 text-right">
              <button class="px-2 py-1 text-xs rounded-lg border" @click="emit('edit', row)">Editar</button>
              <button class="ml-2 px-2 py-1 text-xs rounded-lg border" @click="emit('delete', row)">Eliminar</button>
            </td>
          </tr>
          <tr v-if="!items?.length">
            <td colspan="4" class="py-6 text-center text-gray-500">Sin datos</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-3 flex items-center justify-end gap-2 text-sm">
      <button class="rounded-lg border px-2 py-1" :disabled="page <= 1" @click="emit('page', page - 1)">Anterior</button>
      <span>Página {{ page }} / {{ pageCount }}</span>
      <button class="rounded-lg border px-2 py-1" :disabled="page >= pageCount" @click="emit('page', page + 1)">Siguiente</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import type { {{Pascal}} } from '../Interfaces';

const props = defineProps<{
  items: {{Pascal}}[];
  loading?: boolean;
  page: number;
  pageCount: number;
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'edit', row: {{Pascal}}): void;
  (e: 'delete', row: {{Pascal}}): void;
  (e: 'create'): void;
  (e: 'page', n: number): void;
  (e: 'apply-filter', f: Record<string, any>): void;
}>();

const localFilter = reactive({ q: '' });
const singular = '{{Pascal}}';

function applyFilter() {
  emit('apply-filter', { ...localFilter });
}
</script>
`,

  modalCreate: `<template>
  <div v-if="open" class="fixed inset-0 z-50 grid place-items-center bg-black/40">
    <div class="w-[520px] rounded-2xl bg-white p-5">
      <h3 class="mb-3 text-lg font-semibold">Crear {{ singular }}</h3>
      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label class="mb-1 block text-sm">Nombre</label>
          <input v-model="form.name" class="w-full rounded-lg border px-3 py-2" required />
        </div>
        <div class="mb-3">
          <label class="mb-1 block text-sm">Estado</label>
          <select v-model="form.status" class="w-full rounded-lg border px-3 py-2">
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <button type="button" class="rounded-lg border px-3 py-2" @click="emit('close')">Cancelar</button>
          <button type="submit" class="rounded-xl bg-black px-3 py-2 text-white">Guardar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: 'close'): void; (e: 'submit', payload: any): void }>();
const singular = '{{Pascal}}';

const form = reactive<{ name: string; status: 'active' | 'inactive' }>({ name: '', status: 'active' });

watch(
  () => props.open,
  (v) => {
    if (v) { form.name = ''; form.status = 'active'; }
  }
);

function onSubmit() {
  emit('submit', { ...form });
}
</script>
`,

  modalUpdate: `<template>
  <div v-if="open" class="fixed inset-0 z-50 grid place-items-center bg-black/40">
    <div class="w-[520px] rounded-2xl bg-white p-5">
      <h3 class="mb-3 text-lg font-semibold">Actualizar {{ singular }}</h3>
      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label class="mb-1 block text-sm">Nombre</label>
          <input v-model="form.name" class="w-full rounded-lg border px-3 py-2" required />
        </div>
        <div class="mb-3">
          <label class="mb-1 block text-sm">Estado</label>
          <select v-model="form.status" class="w-full rounded-lg border px-3 py-2">
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <button type="button" class="rounded-lg border px-3 py-2" @click="emit('close')">Cancelar</button>
          <button type="submit" class="rounded-xl bg-black px-3 py-2 text-white">Guardar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { {{Pascal}} } from '../Interfaces';

const props = defineProps<{ open: boolean; row?: {{Pascal}} | null }>();
const emit = defineEmits<{ (e: 'close'): void; (e: 'submit', payload: any): void }>();
const singular = '{{Pascal}}';

const form = reactive<{ name: string; status: 'active' | 'inactive' }>({ name: '', status: 'active' });

watch(
  () => props.row,
  (v) => {
    if (v) {
      form.name = (v as any).name ?? '';
      form.status = (v as any).status ?? 'active';
    }
  },
  { immediate: true }
);

function onSubmit() {
  emit('submit', { ...form });
}
</script>
`,

  modalDelete: `<template>
  <div v-if="open" class="fixed inset-0 z-50 grid place-items-center bg-black/40">
    <div class="w-[520px] rounded-2xl bg-white p-5">
      <h3 class="mb-4 text-lg font-semibold">Eliminar {{ singular }}</h3>
      <p class="mb-6 text-sm text-gray-600">¿Seguro que deseas eliminar este registro? Esta acción no se puede deshacer.</p>
      <div class="flex justify-end gap-2">
        <button class="rounded-lg border px-3 py-2" @click="emit('close')">Cancelar</button>
        <button class="rounded-xl bg-red-600 px-3 py-2 text-white" @click="emit('confirm')">Eliminar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: 'close'): void; (e: 'confirm'): void }>();
const singular = '{{Pascal}}';
</script>
`,

  service: `// Auto-generado por scaffolder
// Ajusta este import a tu helper HTTP (axios) real:
import { api } from '@/lib/api';
import type { {{Pascal}}, {{Pascal}}Filter, Paginated } from '../Interfaces';

const base = '/{{kebabPlural}}';

export const {{Pascal}}Service = {
  async list(params: {{Pascal}}Filter = {}): Promise<Paginated<{{Pascal}}>> {
    const { data } = await api.get<Paginated<{{Pascal}}>>(base, { params });
    return data;
  },
  async get(id: number): Promise<{{Pascal}}> {
    const { data } = await api.get<{{Pascal}}>(\`\${base}/\${id}\`);
    return data;
  },
  async create(payload: Partial<{{Pascal}}>): Promise<{{Pascal}}> {
    const { data } = await api.post<{{Pascal}}>(base, payload);
    return data;
  },
  async update(id: number, payload: Partial<{{Pascal}}>): Promise<{{Pascal}}> {
    const { data } = await api.put<{{Pascal}}>(\`\${base}/\${id}\`, payload);
    return data;
  },
  async remove(id: number): Promise<void> {
    await api.delete(\`\${base}/\${id}\`);
  },
};
`,

  store: `// Auto-generado por scaffolder
import { defineStore } from 'pinia';
import type { {{Pascal}}, {{Pascal}}Filter, Paginated } from '../Interfaces';
import { {{Pascal}}Service } from '../services/{{Pascal}}Service';

type State = {
  items: {{Pascal}}[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  filter: {{Pascal}}Filter;
  current?: {{Pascal}} | null;
};

export const use{{Pascal}}Store = defineStore('{{camel}}', {
  state: (): State => ({
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    loading: false,
    filter: { q: '', status: 'all', page: 1, pageSize: 10 },
    current: null,
  }),
  actions: {
    async fetch() {
      this.loading = true;
      try {
        const res = await {{Pascal}}Service.list({ ...this.filter, page: this.page, pageSize: this.pageSize });
        this.items = res.data;
        this.total = res.total;
      } finally {
        this.loading = false;
      }
    },
    async create(payload: Partial<{{Pascal}}>) {
      const row = await {{Pascal}}Service.create(payload);
      await this.fetch();
      return row;
    },
    async update(id: number, payload: Partial<{{Pascal}}>) {
      const row = await {{Pascal}}Service.update(id, payload);
      await this.fetch();
      return row;
    },
    async remove(id: number) {
      await {{Pascal}}Service.remove(id);
      await this.fetch();
    },
    setFilter(filter: Partial<{{Pascal}}Filter>) {
      this.filter = { ...this.filter, ...filter, page: 1 };
    },
    setPage(n: number) {
      this.page = Math.max(1, n);
    },
    setCurrent(row?: {{Pascal}} | null) {
      this.current = row ?? null;
    },
  },
});
`,

  page: `<template>
  <div class="space-y-4">
    <List{{Pascal}}
      :items="store.items"
      :loading="store.loading"
      :page="store.page"
      :page-count="pageCount"
      title="{{Pascal}}"
      @create="openCreate()"
      @edit="openUpdate"
      @delete="openDelete"
      @page="onPage"
      @apply-filter="onFilter"
    />

    <MdlCreate{{Pascal}} :open="mdlCreate" @close="mdlCreate=false" @submit="onCreate" />
    <MdlUpdate{{Pascal}} :open="mdlUpdate" :row="store.current" @close="mdlUpdate=false" @submit="onUpdate" />
    <MdlDelete{{Pascal}} :open="mdlDelete" @close="mdlDelete=false" @confirm="onDelete" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { use{{Pascal}}Store } from '../stores/{{Pascal}}Store';

import List{{Pascal}} from '../components/List{{Pascal}}.vue';
import MdlCreate{{Pascal}} from '../components/MdlCreate{{Pascal}}.vue';
import MdlUpdate{{Pascal}} from '../components/MdlUpdate{{Pascal}}.vue';
import MdlDelete{{Pascal}} from '../components/MdlDelete{{Pascal}}.vue';

const store = use{{Pascal}}Store();

const mdlCreate = ref(false);
const mdlUpdate = ref(false);
const mdlDelete = ref(false);

const pageCount = computed(() => Math.max(1, Math.ceil(store.total / store.pageSize)));

onMounted(() => {
  store.fetch();
});

function onPage(n: number) {
  store.setPage(n);
  store.fetch();
}

function onFilter(f: Record<string, any>) {
  store.setFilter(f);
  store.fetch();
}

function openCreate() {
  mdlCreate.value = true;
}

function openUpdate(row: any) {
  store.setCurrent(row);
  mdlUpdate.value = true;
}

function openDelete(row: any) {
  store.setCurrent(row);
  mdlDelete.value = true;
}

async function onCreate(payload: any) {
  await store.create(payload);
  mdlCreate.value = false;
}

async function onUpdate(payload: any) {
  if (!store.current) return;
  await store.update((store.current as any).id, payload);
  mdlUpdate.value = false;
}

async function onDelete() {
  if (!store.current) return;
  await store.remove((store.current as any).id);
  mdlDelete.value = false;
}
</script>
`,
};

async function main() {
  const { name, flags } = parseArgs(process.argv);
  const Pascal = toPascal(name);
  const camel = toCamel(name);
  const kebab = toKebab(name);
  const kebabPlural = pluralize(kebab);

  const ctx = { Pascal, camel, kebab, kebabPlural };

  const baseDir = path.resolve(process.cwd(), flags.base);
  const modDir = path.join(baseDir, kebab);

  const dirs = {
    interfaces: path.join(modDir, 'Interfaces'),
    components: path.join(modDir, 'components'),
    services: path.join(modDir, 'services'),
    stores: path.join(modDir, 'stores'),
    pages: path.join(modDir, 'pages'),
  };

  console.log(`🔧 Generando módulo "${Pascal}" en: ${modDir}`);
  if (flags.dry) console.log('⚠️  Modo simulación (dry-run): no se escribirán archivos');

  await ensureDir(dirs.interfaces, flags.dry);
  await ensureDir(dirs.components, flags.dry);
  await ensureDir(dirs.services, flags.dry);
  await ensureDir(dirs.stores, flags.dry);
  await ensureDir(dirs.pages, flags.dry);

  // Archivos
  const files: Array<[string, string]> = [
    [path.join(dirs.interfaces, 'index.ts'), fill(TPL.interfacesIndex, ctx)],
    [path.join(dirs.components, `List${Pascal}.vue`), fill(TPL.listVue, ctx)],
    [path.join(dirs.components, `MdlCreate${Pascal}.vue`), fill(TPL.modalCreate, ctx)],
    [path.join(dirs.components, `MdlUpdate${Pascal}.vue`), fill(TPL.modalUpdate, ctx)],
    [path.join(dirs.components, `MdlDelete${Pascal}.vue`), fill(TPL.modalDelete, ctx)],
    [path.join(dirs.services, `${Pascal}Service.ts`), fill(TPL.service, ctx)],
    [path.join(dirs.stores, `${Pascal}Store.ts`), fill(TPL.store, ctx)],
    [path.join(dirs.pages, `${Pascal}Page.vue`), fill(TPL.page, ctx)],
  ];

  for (const [file, content] of files) {
    await writeFileSafe(file, content, flags.force, flags.dry);
  }

  console.log('\n🎉 Listo.');
  console.log(`\nSiguiente paso (ejemplo):`);
  console.log(`  - Importa la tienda:  import { use${Pascal}Store } from '@/modules/${kebab}/stores/${Pascal}Store'`);
  console.log(`  - Usa la página:      src/modules/${kebab}/pages/${Pascal}Page.vue`);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
