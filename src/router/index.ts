// src/router/index.ts
import {
  createRouter,
  createWebHistory,

} from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import PublicRoute from '@/router/components/PublicRoute.vue';
import ProtectedRoute from '@/router/components/ProtectedRoute.vue';
import NotFound from '@/router/components/NotFound.vue';
import ErrorFallback from './components/ErrorFallBack.vue'; // ⇦ crea este .vue con el mismo markup del componente React
import Loading from '@/ui/Loading.vue';

import { useNavigation } from '@/router/useNavigation';

/* ─────────────────  Lazy imports de Auth  ───────────────── */
const Login = () => import('@/auth/pages/Login.vue');
const Register = () => import('@/auth/pages/Register.vue');

/* ─────────────  Redirección Dashboard genérico  ──────────── */
const DashboardRedirect = () => import('@/router/components/DashboardRedirect.vue');


const Dashboard = {
  setup() {
    const { goToDashboard } = useNavigation();
    goToDashboard();
    return {};
  },
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div>
        <div class="loader mx-auto mb-2" />
        <div class="text-center text-gray-500">Redirigiendo a tu panel...</div>
      </div>
    </div>
  `,
};

/* ──────────────────────  Rutas  ─────────────────────────── */
const routes: RouteRecordRaw[] = [
  /* ─── Públicas ─── */
  {
    path: '/',
    component: PublicRoute,
    children: [
      { path: '', name: 'Home', component: Login },
      { path: 'login', name: 'Login', component: Login },
      { path: 'register', name: 'Register', component: Register },
    ],
  },


  /* ─── Dashboard genérico ─── */
  {
    path: '/dashboard',
    component: ProtectedRoute,
    children: [{ path: '', component: Dashboard }],
  },
  {
    path: '/sima',
    component: ProtectedRoute,
    children: [
      {
        path: 'parcels',
        component: ParcelPage,
        meta: { suspense: { fallback: () => h(Loading, { fullScreen: true, text: 'Loading passenger dashboard...' }) } },
      },
       {
        path: 'control-units',
        component: ControlUnitPage,
        meta: { suspense: { fallback: () => h(Loading, { fullScreen: true, text: 'Loading passenger dashboard...' }) } },
      },
      
    ]
  },
 
  
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

/* ──────────────  Router instantiation  ───────────── */
export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

/* Meta typing extra */
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    guestOnly?: boolean;
    roles?: string[];
    permissions?: string[];
  }
}


export { useNavigation } from '@/router/useNavigation';
import RoleGuard from './components/RoleGuard.vue';

import { h } from 'vue';

export { RoleGuard };
export { routeRegistry } from '@/router/registry';
export type { RouteConfig, ModuleRoutes } from '@/router/types';

import { useAuthStore } from '@/auth/stores/auth';
import { useTripRedirectStore } from '@/router/stores/useTripRedirectStore';
import ParcelPage from '@/modules/parcel/pages/ParcelPage.vue';
import ControlUnitPage from '@/modules/control-unit/pages/ControlUnitPage.vue';

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  const tripRedirect = useTripRedirectStore();

  // 1. Asegura que la sesión esté cargada
  await auth.ensureInitialized();

  // 2. Evita bucle
  if (to.path.includes('/active-trip')) return next();

 
  next();
});
