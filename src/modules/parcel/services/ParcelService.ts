import { api, normalizeList, type AnyListPayload, } from "@/lib/api"; // Axios preconfigurado (baseURL, interceptors)
import type { IParcel, Paginated } from "../Interfaces";
import type { ParcelFilters } from "../Interfaces";


const BASE_URL = "/parcels"; // Ajusta prefijo si usas /api/v1


function toQuery(params: Record<string, unknown>) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") return;
        if (typeof v === "boolean") qs.append(k, v ? "1" : "0");
        else qs.append(k, String(v));
    });
    return qs.toString();
}


export const ParcelService = {
    async list(opts: ParcelFilters & { page?: number; per_page?: number }): Promise<Paginated<IParcel>> {
        const query = toQuery({
            q: opts.q,
            active: opts.status === "active" ? 1 : opts.status === "inactive" ? 0 : undefined,
            from_date: opts.fromDate,
            to_date: opts.toDate,
            sort: opts.sort || "-created_at",
            page: opts.page ?? 1,
            per_page: opts.per_page ?? 12,
        });

        const res = await api.get<AnyListPayload<IParcel>>(`${BASE_URL}?${query}`);

        if (!res.success || res.data == null) {
            return {
                data: [],
                meta: {
                    current_page: opts.page ?? 1,
                    per_page: opts.per_page ?? 12,
                    total: 0,
                    last_page: 1,
                },
            };
        }

        const { data: rows, meta } = normalizeList<IParcel>(res.data, {
            page: opts.page ?? 1,
            perPage: opts.per_page ?? 12,
        });
        return { data: rows, meta }; 
    },


    async find(id: number): Promise<IParcel> {
        const res = await api.get<IParcel>(`${BASE_URL}/${id}`);
        if (!res.success || res.data == null) throw new Error(res.message ?? 'No encontrado');
        return res.data;
    },


    async create(body: Partial<IParcel>): Promise<IParcel> {
        const res = await api.post<IParcel>(BASE_URL, body);
        if (!res.success || res.data == null) throw new Error(res.message ?? 'No encontrado');
        return res.data;
    },


    async update(id: number, body: Partial<IParcel>): Promise<IParcel> {
        const res = await api.put<IParcel>(`${BASE_URL}/${id}`, body);
        if (!res.success || res.data == null) throw new Error(res.message ?? 'No encontrado');
        return res.data;
    },


    async remove(id: number): Promise<boolean> {
        const res = await api.delete(`${BASE_URL}/${id}`);
        if (!res.success || res.data == null) throw new Error(res.message ?? 'No encontrado');
        return true;
    },
};