import { api } from '@/lib/api';
import type { ControlUnit, PaginatedResponse } from '../Interfaces';

const BASE = '/control-units';

function toQueryString(params: Record<string, any>): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      qs.append(k, String(v));
    }
  });
  return qs.toString();
}

export const ControlUnitService = {
  async list(params: Record<string, any>) {
    const query = toQueryString(params);
    const url = query ? `${BASE}?${query}` : BASE;
    const data = await api.get<PaginatedResponse<ControlUnit>>(url);
    return data;
  },
  async create(payload: Partial<ControlUnit>) {
    const { data } = await api.post<{ success: boolean; data: ControlUnit }>(BASE, payload);
    return data.data;
  },
  async update(id: number, payload: Partial<ControlUnit>) {
    const { data } = await api.put<{ success: boolean; data: ControlUnit }>(`${BASE}/${id}`, payload);
    return data.data;
  },
  async remove(id: number) {
    const { data } = await api.delete<{ success: boolean }>(`${BASE}/${id}`);
    return data.success;
  },
  async show(id: number) {
    const { data } = await api.get<{ success: boolean; data: ControlUnit }>(`${BASE}/${id}`);
    return data.data;
  },
  async active() {
    const { data } = await api.get<{ success: boolean; data: ControlUnit[] }>(`${BASE}/active`);
    return data.data;
  }
};
