import { api } from '@/lib/api';

const BASE = '/parcels';

function toQueryString(params: Record<string, any>): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.append(k, String(v));
  });
  return qs.toString();
}

export interface ParcelOption {
  id: number;
  name: string;
  location?: string | null;
  active?: boolean;
}

export type ParcelLookupResponse = {
  data: ParcelOption[];
  // si tu backend devuelve paginación, puedes añadir meta aquí
};

export const ParcelLookupService = {
  async list(params: Record<string, any> = {}) {
    // ejemplo: solo activas y hasta 200 resultados
    const query = toQueryString({ status: 'active', per_page: 200, ...params });
    const url = query ? `${BASE}?${query}` : BASE;
    const data = await api.get<ParcelLookupResponse>(url);
    return  data.data; // tolerante si no hay envoltura data
  }
};
