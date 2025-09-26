// src/auth/services/authApi.ts
import { api } from '../../lib/api';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from '@/auth/types';

export const authApi = {
  /* ─────────────── login ─────────────── */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { success, data, message } =
      await api.post<AuthResponse>('/auth/login', credentials);

    if (!success || !data) throw new Error(message || 'Error en login');
    return data;
  },

  /* ─────────────── registro ─────────────── */
  async register(data: RegisterData): Promise<AuthResponse> {
    const { success, data: d, message } =
      await api.post<AuthResponse>('/auth/register', data);

    if (!success || !d) throw new Error(message || 'Error en registro');
    return d;
  },

  /* ─────────────── perfil ─────────────── */
  async getProfile(): Promise<User> {
    const { success, data, message } = await api.get<User>('/auth/profile');
    if (!success || !data) throw new Error(message || 'Error al obtener perfil');
    return data;
  },

  async updateProfile(payload: Partial<User>): Promise<User> {
    const { success, data, message } =
      await api.put<User>('/auth/profile', payload);

    if (!success || !data)
      throw new Error(message || 'Error al actualizar perfil');
    return data;
  },

  /* ─────────────── logout ─────────────── */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout', {});
    } catch (err) {
      // Continuar incluso si la API falla
      console.warn('Logout API call failed:', err);
    }
  },

  /* ─────────────── registro de conductor ─────────────── */
  async registerDriver(driverData: unknown): Promise<unknown> {
    const { success, data, message } =
      await api.post('/auth/register-driver', driverData);

    if (!success) throw new Error(message || 'Error al registrar conductor');
    return data;
  },
};
