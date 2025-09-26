import { api } from "@/lib/api"; // Axios preconfigurado (baseURL, interceptors)
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


const { data } = await api.get(`${BASE_URL}?${query}`);


// Normaliza payload de Laravel (Resource o LengthAwarePaginator)
const payload = (Array.isArray(data?.data)) ? data : { data, meta: {} };
const meta = payload.meta || {
current_page: Number(data?.current_page ?? opts.page ?? 1),
per_page: Number(data?.per_page ?? opts.per_page ?? 12),
total: Number(data?.total ?? (payload.data?.length ?? 0)),
last_page: Number(data?.last_page ?? 1)
};


return { data: payload.data as IParcel[], meta };
},


async find(id: number): Promise<IParcel> {
const { data } = await api.get(`${BASE_URL}/${id}`);
return (data?.data ?? data) as IParcel;
},


async create(body: Partial<IParcel>): Promise<IParcel> {
const { data } = await api.post(BASE_URL, body);
return (data?.data ?? data) as IParcel;
},


async update(id: number, body: Partial<IParcel>): Promise<IParcel> {
const { data } = await api.put(`${BASE_URL}/${id}`, body);
return (data?.data ?? data) as IParcel;
},


async remove(id: number): Promise<boolean> {
const { data } = await api.delete(`${BASE_URL}/${id}`);
return !!(data?.success ?? true);
},
};