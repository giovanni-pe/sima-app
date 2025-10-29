import { api, normalizeList, type AnyListPayload } from '@/lib/api';
import type { Sensor, PaginatedResponse } from '../Interfaces';

const BASE = '/sensors';

function toQueryString(params: Record<string, unknown>): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    if (typeof v === 'boolean') qs.append(k, v ? '1' : '0');
    else qs.append(k, String(v));
  });
  return qs.toString();
}

export const SensorService = {
  async list(params: Record<string, unknown> & { page?: number; per_page?: number }): Promise<PaginatedResponse<Sensor>> {
    const query = toQueryString(params);
    const url = query ? `${BASE}?${query}` : BASE;

    const res = await api.get<AnyListPayload<Sensor>>(url);
    if (!res.success || res.data == null) {
      return {
        data: [],
        meta: {
          current_page: params.page ?? 1,
          per_page: params.per_page ?? 12,
          total: 0,
          last_page: 1,
        },
      };
    }

    const { data, meta } = normalizeList<Sensor>(res.data, {
      page: params.page ?? 1,
      perPage: params.per_page ?? 12,
    });

    return { data, meta };
  },

  async create(payload: Partial<Sensor>): Promise<Sensor> {
    const res = await api.post<Sensor>(BASE, payload);
    if (!res.success || res.data == null) throw new Error(res.message ?? 'No se pudo crear');
    return res.data;
  },

  async update(id: number, payload: Partial<Sensor>): Promise<Sensor> {
    const res = await api.put<Sensor>(`${BASE}/${id}`, payload);
    if (!res.success || res.data == null) throw new Error(res.message ?? 'No se pudo actualizar');
    return res.data;
  },

  async remove(id: number): Promise<boolean> {
    const res = await api.delete(`${BASE}/${id}`);
    if (!res.success) throw new Error(res.message ?? 'No se pudo eliminar');
    return true;
  },

  async show(id: number): Promise<Sensor> {
    const res = await api.get<Sensor>(`${BASE}/${id}`);
    if (!res.success || res.data == null) throw new Error(res.message ?? 'No encontrado');
    return res.data;
  },
};
