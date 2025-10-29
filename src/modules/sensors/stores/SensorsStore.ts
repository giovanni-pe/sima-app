import { defineStore } from 'pinia';
import type { Sensor, SensorFilters, ControlUnitOption } from '../Interfaces';
import { SensorService } from '../services/SensorsService';
import { ControlUnitLookupService } from '../services/ControlUnitLookupService';

export const useSensorStore = defineStore('sensors', {
  state: () => ({
    loading: false,
    items: [] as Sensor[],
    page: 1,
    perPage: 12,
    lastPage: 1,
    total: 0,
    filters: {
      q: '',
      type: 'all',
      active: 'all',
    } as SensorFilters,
    ui: {
      openCreate: false,
      openEdit: false,
      openDelete: false,
      openShow: false,
      busy: false,
      selected: null as Sensor | null,
      createForm: {
        name: '',
        type: '',
        control_unit_id: 0,
        active: true,
      } as Partial<Sensor>,
      editForm: {} as Partial<Sensor>,
      showData: null as Sensor | null,
    },
    cuOptions: [] as ControlUnitOption[],
    cuLoading: false,
  }),

  actions: {
    // LIST (GET /api/sensors)
    async fetchList(extra: Record<string, any> = {}) {
      this.loading = true;
      try {
        const params = {
          page: this.page,
          per_page: this.perPage,
          ...this.filters,
          ...extra,
        };
        const res = await SensorService.list(params);
        this.items = res.data;
        this.total = res.meta.total;
        this.perPage = res.meta.per_page;
        this.page = res.meta.current_page;
        this.lastPage = res.meta.last_page;
      } finally {
        this.loading = false;
      }
    },

    // Lookup de Control Units para el <select>
    async fetchControlUnitOptions(force = false) {
      if (this.cuOptions.length && !force) return;
      this.cuLoading = true;
      try {
        this.cuOptions = await ControlUnitLookupService.list();
      } finally {
        this.cuLoading = false;
      }
    },

    setPage(n: number) { this.page = n; },
    setPerPage(n: number) { this.perPage = n; },
    setFilters(f: Partial<SensorFilters>) { this.filters = { ...this.filters, ...f }; },

    openCreate() {
      this.ui.openCreate = true;
      void this.fetchControlUnitOptions(false);
    },
    closeCreate() {
      this.ui.openCreate = false;
      this.ui.createForm = { name: '', type: '', control_unit_id: 0, active: true };
    },

    openEdit(item: Sensor) {
      this.ui.selected = item;
      this.ui.editForm = { ...item };
      this.ui.openEdit = true;
      void this.fetchControlUnitOptions(false);
    },
    closeEdit() {
      this.ui.openEdit = false;
      this.ui.selected = null;
      this.ui.editForm = {};
    },

    openDelete(item: Sensor) {
      this.ui.selected = item;
      this.ui.openDelete = true;
    },
    closeDelete() {
      this.ui.openDelete = false;
      this.ui.selected = null;
    },

    openShow(item: Sensor) {
      this.ui.selected = item;
      this.ui.openShow = true;
      this.show(item.id);
    },
    closeShow() {
      this.ui.openShow = false;
      this.ui.selected = null;
      this.ui.showData = null;
    },

    // CREATE (POST /api/sensors)
    async createSensor(payload: Partial<Sensor>) {
      const created = await SensorService.create(payload);
      this.items.unshift(created);
      this.total += 1;
    },

    // UPDATE (PUT /api/sensors/{id})
    async updateSensor(id: number, payload: Partial<Sensor>) {
      const updated = await SensorService.update(id, payload);
      const i = this.items.findIndex(x => x.id === id);
      if (i >= 0) this.items[i] = updated;
    },

    // DELETE (DELETE /api/sensors/{id})
    async deleteSensor(id: number) {
      const ok = await SensorService.remove(id);
      if (ok) {
        this.items = this.items.filter(x => x.id !== id);
        this.total = Math.max(0, this.total - 1);
      }
    },

    // SHOW (GET /api/sensors/{id})
    async show(id: number) {
      this.ui.showData = await SensorService.show(id);
    },
  },
});
