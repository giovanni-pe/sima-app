// src/router/types.ts
import type { Component } from 'vue';

/**
 * Representa una ruta individual dentro de un módulo.
 * La propiedad `component` se define como una función
 * de importación diferida (`() => import('…')`) que
 * devuelve una Promesa con el componente Vue.
 */
export interface RouteConfig {
  path: string;
  component: () => Promise<Component>; // lazy-load
  roles?: string[];
  permissions?: string[];
  layout?: 'default' | 'minimal' | 'dashboard';
}

/**
 * Conjunto de rutas que pertenecen a un mismo módulo (feature).
 * Se registra en `routeRegistry`.
 */
export interface ModuleRoutes {
  moduleName: string;      // nombre interno del módulo (p. ej. 'passenger')
  basePath:   string;      // prefijo de URL (p. ej. '/passenger')
  routes:     RouteConfig[];
}
