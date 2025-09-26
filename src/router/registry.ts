// src/router/registry.ts
import type { ModuleRoutes } from './types';

class RouteRegistry {
  private modules = new Map<string, ModuleRoutes>();

  registerModule(moduleRoutes: ModuleRoutes) {
    this.modules.set(moduleRoutes.moduleName, moduleRoutes);
  }

  getModule(moduleName: string) {
    return this.modules.get(moduleName);
  }

  getAllModules() {
    return Array.from(this.modules.values());
  }

  getRoutesByBasePath(basePath: string) {
    return Array.from(this.modules.values())
      .find(m => m.basePath === basePath);
  }
}

export const routeRegistry = new RouteRegistry();
