import { defineStore } from 'pinia';
import type { ControlUnit, ControlUnitFilters, ParcelOption } from '../Interfaces';
import { ControlUnitService } from '../services/ControlUnitService';
import { ParcelLookupService } from '../services/ParcelLookupService';

export const useControlUnitStore = defineStore('controlUnits', {
  state: () => ({
    loading: false,
    items: [] as ControlUnit[],
    page: 1,
    perPage: 12,
    lastPage: 1,
    total: 0,
    filters: {
      q: '',
      status: 'all',
      active: 'all',
      fromInstalled: '',
      toInstalled: '',
      fromSeen: '',
      toSeen: '',
    } as ControlUnitFilters,
    ui: {
      openCreate: false,
      openEdit: false,
      openDelete: false,
      busy: false,
      selected: null as ControlUnit | null,
      createForm: {
        serial_code: '',
        model: '',
        installed_at: '',
        status: 'offline',
        parcel_id: 0,
        mqtt_client_id: '',
        mqtt_username: '',
        mqtt_password_enc: '',
        status_topic: '',
        lwt_topic: '',
        last_seen_at: '',
        active: true,
      } as Partial<ControlUnit>,
      editForm: {} as Partial<ControlUnit>,
    },
     parcelOptions: [] as ParcelOption[],
    parcelOptionsLoading: false,
  }),
  actions: {
    async fetchList(extra: Record<string, any> = {}) {
      this.loading = true;
      try {
        const params = {
          page: this.page,
          per_page: this.perPage,
          ...this.filters,
          ...extra,
        };
        const res = await ControlUnitService.list(params);
        this.items = res.data;
        this.total = res.meta.total;
        this.perPage = res.meta.per_page;
        this.page = res.meta.current_page;
        this.lastPage = res.meta.last_page;
      } finally {
        this.loading = false;
      }
      
    },
     async fetchParcelOptions(force = false) {
      if (this.parcelOptions.length && !force) return; // cache simple
      this.parcelOptionsLoading = true;
      try {
        const res = await ParcelLookupService.list();
        this.parcelOptions = Array.isArray(res) ? res :  [];
        
      } finally {
        this.parcelOptionsLoading = false;
      }
    },

    setPage(n: number) { this.page = n; },
    setPerPage(n: number) { this.perPage = n; },
    setFilters(f: Partial<ControlUnitFilters>) { this.filters = { ...this.filters, ...f }; },

    openCreate() { this.ui.openCreate = true; 
      void this.fetchParcelOptions(false); 
    },

    closeCreate() {
      this.ui.openCreate = false;
      this.ui.createForm = {
        serial_code: '',
        model: '',
        installed_at: '',
        status: 'offline',
        parcel_id: 0,
        mqtt_client_id: '',
        mqtt_username: '',
        mqtt_password_enc: '',
        status_topic: '',
        lwt_topic: '',
        last_seen_at: '',
        active: true,
      };
    },

    openEdit(item: ControlUnit) {
      this.ui.selected = item;
      this.ui.editForm = { ...item };
      this.ui.openEdit = true;
       void this.fetchParcelOptions(false);
    },
    closeEdit() {
      this.ui.openEdit = false;
      this.ui.selected = null;
      this.ui.editForm = {};
    },

    openDelete(item: ControlUnit) {
      this.ui.selected = item;
      this.ui.openDelete = true;
    },
    closeDelete() {
      this.ui.openDelete = false;
      this.ui.selected = null;
    },

    async createUnit(payload: Partial<ControlUnit>) {
      const created = await ControlUnitService.create(payload);
      this.items.unshift(created);
      this.total += 1;
    },

    async updateUnit(id: number, payload: Partial<ControlUnit>) {
      const updated = await ControlUnitService.update(id, payload);
      const i = this.items.findIndex(x => x.id === id);
      if (i >= 0) this.items[i] = updated;
    },

    async deleteUnit(id: number) {
      const ok = await ControlUnitService.remove(id);
      if (ok) {
        this.items = this.items.filter(x => x.id !== id);
        this.total = Math.max(0, this.total - 1);
      }
    },
  }
});
