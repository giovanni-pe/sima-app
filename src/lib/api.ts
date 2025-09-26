import { APP_CONFIG } from './constants';
import { useAuthStore } from '../auth/stores/auth';
import { router } from '@/router';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiRequestConfig {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

class ApiClient {
  private readonly baseURL = APP_CONFIG.API_BASE_URL;
  private readonly defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  /*───────────────────────────  Helpers  ───────────────────────────*/

  private getToken() {
    return localStorage.getItem(`${APP_CONFIG.STORAGE_PREFIX}token`);
  }

  private buildHeaders(custom?: Record<string, string>) {
    const headers = { ...this.defaultHeaders, ...custom };
    const token = this.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }
private async parseResponse<T>(res: Response): Promise<ApiResponse<T>> {
  const isJson = res.headers.get('content-type')?.includes('application/json');
  if (!isJson) throw new Error('Invalid response format');

  const data: ApiResponse<T> = await res.json();

  //  Manejo especial para 404 con mensaje conocido
  if (!res.ok) {
    if (res.status === 4010) {
      const auth = useAuthStore();
      await auth.logout();
      router.replace('/login');
    }


    if (res.status === 404 && data.message === 'No hay viaje activo') {
      return { success: false, message: data.message, data: null as any };
    }

    throw new Error(data.message || 'API error');
  }

  return data;
}


  /*───────────────────────────  Método genérico  ───────────────────────────*/

  async request<T = unknown>(
    endpoint: string,
    { method = 'GET', body, headers, signal }: ApiRequestConfig = {},
  ): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseURL}${endpoint}`, {
        method,
        headers: this.buildHeaders(headers),
        body: body ? JSON.stringify(body) : undefined,
        signal,
      });
      return await this.parseResponse<T>(res);
    } catch (err) {
      if (err instanceof Error) throw err;
      throw new Error('Network error');
    }
  }

  /*───────────────────────────  Convenience helpers  ───────────────────────────*/

  get    = <T>(e: string, s?: AbortSignal)          => this.request<T>(e, { method: 'GET', signal: s });
  post   = <T>(e: string, b: unknown, s?: AbortSignal) => this.request<T>(e, { method: 'POST', body: b, signal: s });
  put    = <T>(e: string, b: unknown, s?: AbortSignal) => this.request<T>(e, { method: 'PUT',  body: b, signal: s });
  patch  = <T>(e: string, b: unknown, s?: AbortSignal) => this.request<T>(e, { method: 'PATCH',body: b, signal: s });
  delete = <T>(e: string, s?: AbortSignal)          => this.request<T>(e, { method: 'DELETE', signal: s });
}

export const api = new ApiClient();
