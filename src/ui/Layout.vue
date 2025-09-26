<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import SidebarWeb from '@/ui/SidebarWeb.vue';
import BottomNav from '@/ui/BottomNav.vue';
import type { BottomNavItem } from '@/ui/BottomNav.vue';
import { navItems as allNavItems } from '@/navigation/navItems';
import MqttStatus from './MqttStatus.vue';
import ProfileMenu from './ProfileMenu.vue';

const menuOpen = ref(false);
const sidebarExpanded = ref(true);
const isLoading = ref(false);
const currentTime = ref(new Date());
const notifications = ref<any[]>([]);

const headerScrolled = ref(false);
const isMobile = ref(false);
const showQuickActions = ref(false);

const handleScroll = () => { headerScrolled.value = window.scrollY > 10; };
const checkMobile = () => {
  const wasMobile = isMobile.value;
  isMobile.value = window.innerWidth < 1024;
  if (wasMobile !== isMobile.value) {
    sidebarExpanded.value = !isMobile.value;
  }
};
const updateTime = () => { currentTime.value = new Date(); };
let timeInterval: NodeJS.Timeout;

onMounted(() => {
  checkMobile();
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', checkMobile);
  timeInterval = setInterval(updateTime, 60000);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', checkMobile);
  if (timeInterval) clearInterval(timeInterval);
});

function toggleMenu() { menuOpen.value = !menuOpen.value; }
function closeMenu() { menuOpen.value = false; }

const layoutShift = computed(() => (isMobile.value ? '' : (sidebarExpanded.value ? 'lg:pl-72' : 'lg:pl-20')));
function handleToggle(expanded: boolean) { sidebarExpanded.value = expanded; }

const formattedTime = computed(() =>
  currentTime.value.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false })
);
const formattedDate = computed(() =>
  currentTime.value.toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
);

const hasNotifications = computed(() => notifications.value.length > 0);

const quickActions = [
  { id: 'dashboard', icon: 'lucide:bar-chart-3', label: 'Dashboard', action: () => console.log('Dashboard') },
  { id: 'reports', icon: 'lucide:file-text', label: 'Reportes', action: () => console.log('Reports') },
  { id: 'alerts', icon: 'lucide:bell', label: 'Alertas', action: () => console.log('Alerts') }
];

/** ---------- Mapeo para la barra inferior móvil ---------- */
/** Toma cada item raíz y usa su `path` o, si es menú, el path del primer hijo */
const bottomNavItems = computed<BottomNavItem[]>(() =>
  allNavItems
    .filter(n => n && n.id && n.label && n.icon) // saneo básico
    .map(n => {
      const firstChildPath = Array.isArray(n.children) ? n.children.find(c => !!c.path)?.path : undefined;
      const path = (n as any).path ?? firstChildPath ?? '/';
      return {
        id: n.id,
        label: n.label,
        icon: n.icon,
        path,
        // Puedes usar badges reales: ej. notificaciones, pendientes, etc.
        badge: n.id === 'alerts' ? notifications.value.length : undefined,
      } as BottomNavItem;
    })
);
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] text-[#1E293B]">
    <SidebarWeb :items="allNavItems" :class="sidebarExpanded ? 'w-72' : 'w-20'" @toggle="handleToggle" />

    <div :class="['transition-all duration-300 ease-out', layoutShift]">
      <header
        :class="[
          'sticky top-0 z-30 px-4 py-3 flex items-center justify-between',
          'transition-all duration-300 ease-out backdrop-blur-xl',
          headerScrolled ? 'bg-white/80 shadow-lg border-b border-slate-200/60 py-2' : 'bg-white/60 border-b border-slate-100/40',
          isMobile && 'pl-16'
        ]"
      >
        <!-- izquierda -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3">
            <div v-if="!isMobile || sidebarExpanded" class="transition-all duration-300">
              <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                SIMA-UNAS
              </h1>
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <Icon icon="lucide:calendar" class="w-3 h-3" />
                <span>{{ formattedDate }}</span>
              </div>
            </div>
          </div>
          <nav v-if="!isMobile" class="hidden md:flex items-center gap-2 text-sm">
            <Icon icon="lucide:home" class="w-4 h-4 text-slate-400" />
            <Icon icon="lucide:chevron-right" class="w-4 h-4 text-slate-300" />
            <span class="text-slate-600 font-medium">Dashboard</span>
          </nav>
        </div>

        <!-- derecha -->
        <div class="flex items-center gap-3">
          <div v-if="!isMobile" class="hidden lg:flex items-center gap-1">
            <button
              v-for="action in quickActions"
              :key="action.id"
              @click="action.action"
              class="p-2 rounded-lg hover:bg-slate-100/80 transition-all duration-200 group tooltip-container"
              :title="action.label"
            >
              <Icon :icon="action.icon" class="w-5 h-5 text-slate-500 group-hover:text-slate-700 transition-colors" />
            </button>
          </div>
          <div v-if="!isMobile" class="w-px h-6 bg-slate-200" />
          <div v-if="!isMobile" class="hidden sm:flex items-center gap-2 text-sm">
            <Icon icon="lucide:clock" class="w-4 h-4 text-slate-400" />
            <span class="font-mono text-slate-600">{{ formattedTime }}</span>
          </div>
          <div class="relative"><MqttStatus /></div>
          <button class="relative p-2 rounded-lg hover:bg-slate-100/80 transition-all duration-200 group"
                  :class="hasNotifications && 'animate-pulse'">
            <Icon icon="lucide:bell" class="w-5 h-5 text-slate-500 group-hover:text-slate-700 transition-colors" />
            <div v-if="hasNotifications" class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
          </button>

          <div class="relative">
            <button @click="toggleMenu"
              class="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100/80 transition-all duration-200 group"
              :class="menuOpen && 'bg-slate-100/80'" aria-label="Menú de usuario">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                <Icon icon="lucide:user" class="w-4 h-4" />
              </div>
              <Icon icon="lucide:chevron-down" class="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-all duration-200"
                    :class="menuOpen && 'rotate-180'" />
            </button>

            <transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0 scale-95 -translate-y-1"
                        enter-to-class="opacity-100 scale-100 translate-y-0" leave-active-class="transition-all duration-150 ease-in"
                        leave-from-class="opacity-100 scale-100 translate-y-0" leave-to-class="opacity-0 scale-95 -translate-y-1">
              <div v-if="menuOpen" class="absolute top-full right-0 mt-2 z-50">
                <div class="flex justify-end px-4">
                  <div class="w-3 h-3 bg-white transform rotate-45 -translate-y-1/2 border-l border-t border-slate-200 shadow-sm" />
                </div>
                <div class="bg-white rounded-2xl shadow-xl border border-slate-200/60 min-w-[16rem] max-w-[20rem] overflow-hidden backdrop-blur-xl">
                  <ProfileMenu :closeMenu="closeMenu" />
                </div>
              </div>
            </transition>

            <div v-if="menuOpen" @click="closeMenu" class="fixed inset-0 z-40" />
          </div>
        </div>
      </header>

      <!-- 👇 padding extra en móvil para no tapar el contenido con la barra inferior -->
      <main :class="['min-h-[calc(100vh-theme(spacing.16))] p-4 sm:p-6', isMobile ? 'pb-24' : '']">
        <div class="max-w-none mx-auto">
          <div class="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/40 shadow-sm min-h-[600px] transition-all duration-300">
            <slot />
          </div>
        </div>
      </main>

      <footer class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 opacity-50" />
        <div class="relative px-6 py-8 text-center">
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Icon icon="mdi:leaf" class="w-6 h-6 text-white" />
              </div>
              <div class="text-left">
                <div class="font-semibold text-slate-700">SIMA-UNAS</div>
                <div class="text-xs text-slate-500">v1.2.0 Beta</div>
              </div>
            </div>
            <div class="hidden sm:block w-px h-10 bg-slate-200" />
            <div class="text-sm text-slate-600">
              <span>&copy; {{ new Date().getFullYear() }} </span>
              <span class="font-medium">Universidad Nacional Agraria de la Selva</span>
              <br class="sm:hidden" />
              <span class="text-slate-500"> - Sistema Integral de Monitoreo Agrícola</span>
            </div>
          </div>
          <div class="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
            <a href="#" class="hover:text-blue-600 transition-colors duration-200">Política de Privacidad</a>
            <span>•</span>
            <a href="#" class="hover:text-blue-600 transition-colors duration-200">Términos de Uso</a>
            <span>•</span>
            <a href="#" class="hover:text-blue-600 transition-colors duration-200">Soporte</a>
          </div>
        </div>
      </footer>
    </div>

    <div v-if="isMobile && menuOpen" @click="closeMenu" class="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden" />

    <!-- 👇 Renderiza la barra inferior en móvil -->
    <BottomNav v-if="isMobile" :items="bottomNavItems" />
  </div>
</template>

<style scoped>
/* (igual que tu versión actual) */
html { scroll-behavior: smooth; }
.tooltip-container { position: relative; }
.tooltip-container::after {
  content: attr(title);
  position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8); color: white; padding: 0.5rem; border-radius: 0.375rem;
  font-size: 0.75rem; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s; margin-bottom: 0.5rem;
}
.tooltip-container:hover::after { opacity: 1; }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
.animate-shimmer { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  background-size: 200% 100%; animation: shimmer 2s infinite; }
@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; } }
:focus-visible { outline: 2px solid #3B82F6; outline-offset: 2px; border-radius: 0.375rem; }
</style>
