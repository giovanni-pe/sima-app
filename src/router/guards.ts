// src/router/guards.ts
import type { User } from '../auth/types';

/**
 * Comprueba si el usuario tiene al menos uno
 * de los roles requeridos.
 */
export const hasRequiredRole = (
  user: User | null,
  requiredRoles?: string[],
): boolean => {
  if (!requiredRoles?.length) return true;
  if (!user) return false;

  return requiredRoles.some(role => user.roles.includes(role));
};

/**
 * Comprueba si el usuario posee al menos
 * uno de los permisos requeridos.
 */
export const hasRequiredPermission = (
  user: User | null,
  requiredPermissions?: string[],
): boolean => {
  if (!requiredPermissions?.length) return true;
  if (!user) return false;

  return requiredPermissions.some(p => user.permissions.includes(p));
};

/**
 * Devuelve `true` si el usuario cumple tanto los
 * roles como los permisos solicitados.
 */
export const canAccessRoute = (
  user: User | null,
  roles?: string[],
  permissions?: string[],
): boolean =>
  hasRequiredRole(user, roles) && hasRequiredPermission(user, permissions);
