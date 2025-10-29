import { api } from '@/lib/api';
import type { ControlUnitOption } from '../Interfaces';

export const ControlUnitLookupService = {
    async list(): Promise<ControlUnitOption[]> {
        const { data } = await api.get<any>('/control-units/active');
        return Array.isArray(data) ? data as ControlUnitOption[] : (data.data ?? []);
    },
};