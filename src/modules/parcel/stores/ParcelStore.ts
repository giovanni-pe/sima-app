// src/modules/parcel/stores/ParcelStore.ts
import { defineStore } from "pinia";
import type { IParcel, ParcelFilters, ParcelForm, ParcelState } from "../Interfaces";
import { ParcelService } from "../services/ParcelService";

/** Estado UI manejado desde componentes sin props/refs */
interface UIState {
  openCreate: boolean;
  openEdit: boolean;
  openDelete: boolean;
  busy: boolean;
  selected: IParcel | null;
  createForm: ParcelForm;
  editForm: ParcelForm;
}

type ParcelStateWithUI = ParcelState & { ui: UIState };

const emptyForm = (): ParcelForm => ({
  name: "",
  area_m2: 0,
  crop_type: "",
  location: "",
  latitude: undefined,
  longitude: undefined,
  active: true,
});

export const useParcelStore = defineStore("parcel", {
  state: (): ParcelStateWithUI => ({
    // Data
    items: [],
    loading: false,
    error: null,
    page: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
    filters: { q: "", status: "all", fromDate: "", toDate: "", sort: "-created_at" },

    // UI centralizada (consumida directo por los componentes)
    ui: {
      openCreate: false,
      openEdit: false,
      openDelete: false,
      busy: false,
      selected: null,
      createForm: emptyForm(),
      editForm: emptyForm(),
    },
  }),

  getters: {
    hasFilters: (s) =>
      !!(s.filters.q || s.filters.fromDate || s.filters.toDate || s.filters.status !== "all"),
  },

  actions: {
    // ====== Data ======
    async fetchList(partial?: Partial<ParcelFilters & { page: number; per_page: number }>) {
      this.loading = true;
      this.error = null;
      try {
        const resp = await ParcelService.list({
          q: partial?.q ?? this.filters.q,
          status: partial?.status ?? this.filters.status,
          fromDate: partial?.fromDate ?? this.filters.fromDate,
          toDate: partial?.toDate ?? this.filters.toDate,
          sort: partial?.sort ?? this.filters.sort,
          page: partial?.page ?? this.page,
          per_page: partial?.per_page ?? this.perPage,
        });
        this.items = resp.data as IParcel[];
        this.page = resp.meta.current_page;
        this.perPage = resp.meta.per_page;
        this.total = resp.meta.total;
        this.lastPage = resp.meta.last_page;
      } catch (e: any) {
        this.error = e?.message ?? "Error al cargar parcelas";
      } finally {
        this.loading = false;
      }
    },

    setFilters(p: Partial<ParcelFilters>) {
      if (p.q !== undefined) this.filters.q = p.q;
      if (p.status !== undefined) this.filters.status = p.status;
      if (p.fromDate !== undefined) this.filters.fromDate = p.fromDate || "";
      if (p.toDate !== undefined) this.filters.toDate = p.toDate || "";
      if (p.sort !== undefined) this.filters.sort = p.sort;
    },

    setPage(n: number) {
      this.page = n;
    },
    setPerPage(n: number) {
      this.perPage = n;
    },

    async createParcel(payload: Partial<IParcel>) {
      const created = await ParcelService.create(payload);
      this.setPage(1);
      await this.fetchList({ page: 1, per_page: this.perPage });
      return created;
    },

    async updateParcel(id: number, payload: Partial<IParcel>) {
      const updated = await ParcelService.update(id, payload);
      await this.fetchList({ page: this.page, per_page: this.perPage });
      return updated;
    },

    async deleteParcel(id: number) {
      await ParcelService.remove(id);
      const isLastItemOnPage = this.items.length === 1 && this.page > 1;
      const nextPage = isLastItemOnPage ? this.page - 1 : this.page;
      this.setPage(nextPage);
      await this.fetchList({ page: nextPage, per_page: this.perPage });
      return true;
    },

    // ====== UI helpers ======
    openCreate() {
      this.ui.createForm = emptyForm();
      this.ui.openCreate = true;
    },
    closeCreate() {
      this.ui.openCreate = false;
    },

    openEdit(p: IParcel) {
      console.log('llega parcela')
      this.ui.selected = p;
      this.ui.editForm = {
        name: p.name,
        area_m2: p.area_m2,
        crop_type: p.crop_type ?? "",
        location: p.location ?? "",
        latitude: p.latitude ?? undefined,
        longitude: p.longitude ?? undefined,
        active: p.active,
      };
      this.ui.openEdit = true;
    },
    closeEdit() {
      this.ui.openEdit = false;
      this.ui.selected = null;
    },

    openDelete(p: IParcel) {
      this.ui.selected = p;
      this.ui.openDelete = true;
    },
    closeDelete() {
      this.ui.openDelete = false;
      this.ui.selected = null;
    },

    setBusy(v: boolean) {
      this.ui.busy = v;
    },
  },
});
