export interface IParcel {
id: number;
name: string;
location?: string | null;
area_m2: number;
user_id?: number | null;
latitude?: number | null;
longitude?: number | null;
crop_type?: string | null;
active: boolean;
created_at?: string;
updated_at?: string;
}


export type ParcelStatusFilter = "all" | "active" | "inactive";


export interface ParcelFilters {
q?: string;
status?: ParcelStatusFilter; // all | active | inactive
fromDate?: string; // YYYY-MM-DD
toDate?: string; // YYYY-MM-DD
sort?: string; // -created_at, name, etc.
}


export interface PaginationMeta {
current_page: number;
per_page: number;
total: number;
last_page: number;
}


export interface Paginated<T> {
data: T[];
meta: PaginationMeta;
}


export interface ParcelForm {
name: string;
location?: string | null;
area_m2: number;
user_id?: number | null;
latitude?: number | null;
longitude?: number | null;
crop_type?: string | null;
active?: boolean;
}


export interface ParcelState {
items: IParcel[];
loading: boolean;
error: string | null;
page: number;
perPage: number;
total: number;
lastPage: number;
filters: Required<Pick<ParcelFilters, "q" | "status" | "fromDate" | "toDate">> & { sort: string };
}