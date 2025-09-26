<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick,onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useNavigation } from '@/router/useNavigation';
import { cn } from '@/lib/utils';

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  disabled?: boolean;
  children?: SidebarNavItem[];
  badge?: string | number;
}

interface Props {
  items: SidebarNavItem[];
  className?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['toggle']);
const { navigate, isCurrentPathStartsWith } = useNavigation();

// Cambio principal: inicializar como expandido por defecto
const expanded = ref(true);
const openSubmenu = ref<string | null>(null);
const mobileMenuOpen = ref(false);
const focusedItem = ref<string | null>(null);
const isHovering = ref(false);
const scrollPosition = ref(0);

// Auto-collapse en móvil, pero mantener expandido en laptop/desktop
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024;
  // Solo colapsar en móvil, mantener expandido en laptop+
  if (isMobile.value) {
    expanded.value = false;
  } else {
    // En laptop y desktop, mantener expandido por defecto
    expanded.value = true;
  }
};

onMounted(() => {
  checkMobile();
  emit('toggle', expanded.value);
  window.addEventListener('resize', checkMobile);

  // Restaurar scroll position
  const nav = document.querySelector('.sidebar-nav');
  if (nav) {
    nav.scrollTop = scrollPosition.value;
  }
});

// Guardar posición de scroll
const handleScroll = (event: Event) => {
  scrollPosition.value = (event.target as HTMLElement).scrollTop;
};

// Mejoras en la navegación por teclado
const handleKeyDown = (event: KeyboardEvent, item: SidebarNavItem) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleItemClick(item);
  } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    navigateWithKeyboard(event.key === 'ArrowDown' ? 'down' : 'up');
  }
};

const navigateWithKeyboard = (direction: 'up' | 'down') => {
  const flatItems = getFlatItemsList();
  const currentIndex = flatItems.findIndex(item => item.id === focusedItem.value);
  const nextIndex = direction === 'down'
    ? Math.min(currentIndex + 1, flatItems.length - 1)
    : Math.max(currentIndex - 1, 0);

  focusedItem.value = flatItems[nextIndex]?.id || null;
  nextTick(() => {
    const element = document.querySelector(`[data-item-id="${focusedItem.value}"]`) as HTMLElement;
    element?.focus();
  });
};

const getFlatItemsList = (): SidebarNavItem[] => {
  const flatItems: SidebarNavItem[] = [];
  const addItems = (items: SidebarNavItem[]) => {
    items.forEach(item => {
      flatItems.push(item);
      if (item.children && openSubmenu.value === item.id) {
        addItems(item.children);
      }
    });
  };
  addItems(props.items);
  return flatItems;
};

function toggleSidebar() {
  if (isMobile.value) {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  } else {
    expanded.value = !expanded.value;
    emit('toggle', expanded.value);
  }
}

function handleItemClick(item: SidebarNavItem) {
  if (item.disabled) return;

  if (item.children) {
    openSubmenu.value = openSubmenu.value === item.id ? null : item.id;
  } else if (item.path) {
    navigate(item.path);
    // Cerrar menú móvil después de navegar
    if (isMobile.value) {
      mobileMenuOpen.value = false;
    }
  }
}

// Auto-expand en hover para sidebar colapsado
watch(isHovering, (hovering) => {
  if (!isMobile.value && !expanded.value && hovering) {
    // Expandir temporalmente en hover
    document.documentElement.style.setProperty('--sidebar-hover-width', '18rem');
  } else {
    document.documentElement.style.setProperty('--sidebar-hover-width', '5rem');
  }
});

const sidebarClass = computed(() =>
  cn(
    'fixed top-0 left-0 h-screen z-40 transition-all duration-300 ease-out',
    'bg-gradient-to-b from-[#EAF6FF] via-[#F0F8FF] to-[#EAF6FF]',
    'border-r border-[#D0EFFF]/60 backdrop-blur-xl shadow-2xl',
    // Desktop - expandido por defecto
    'hidden lg:flex flex-col',
    expanded.value ? 'w-72' : 'w-20 hover:w-72',
    // Mobile overlay
    isMobile.value && mobileMenuOpen.value && 'lg:hidden flex w-80',
    props.className
  )
);

const overlayClass = computed(() =>
  cn(
    'fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden',
    'transition-opacity duration-300',
    mobileMenuOpen.value ? 'opacity-100' : 'opacity-0 pointer-events-none'
  )
);

// Indicador de carga para navegación
const isNavigating = ref(false);
watch(() => isCurrentPathStartsWith, () => {
  isNavigating.value = true;
  setTimeout(() => {
    isNavigating.value = false;
  }, 200);
});

// Limpiar event listeners
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<template>
  <!-- Mobile Overlay -->
  <div :class="overlayClass" @click="mobileMenuOpen = false" />

  <!-- Mobile Toggle Button -->
  <button v-if="isMobile" @click="toggleSidebar" class="fixed top-4 left-4 z-50 lg:hidden bg-white/90 backdrop-blur-md 
           rounded-xl p-3 shadow-lg border border-blue-100/40
           hover:scale-105 active:scale-95 transition-all duration-200"
    :aria-label="mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'">
    <Icon :icon="mobileMenuOpen ? 'lucide:x' : 'lucide:menu'" class="w-5 h-5 text-[#0F172A]" />
  </button>

  <aside :class="sidebarClass" @mouseenter="!isMobile && (isHovering = true)"
    @mouseleave="!isMobile && (isHovering = false)" role="navigation"
    :aria-label="isMobile ? 'Menú principal móvil' : 'Navegación lateral'">
    <!-- Header con mejor jerarquía visual -->
    <div class="flex items-center justify-between px-4 py-4 border-b border-[#D0EFFF]/40">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <Icon icon="mdi:leaf" class="w-5 h-5 text-white" />
        </div>
        <div class="transition-all duration-300" :class="{
          'opacity-0 w-0 overflow-hidden': !expanded && !isHovering,
          'opacity-100 w-auto': expanded || isHovering
        }">
          <h1 class="text-lg font-bold text-[#0F172A] tracking-wide whitespace-nowrap">
            SIMA-UNAS
          </h1>
          <p class="text-xs text-[#64748B] font-medium">
            Sistema Agrícola
          </p>
        </div>
      </div>

      <button v-if="!isMobile" @click="toggleSidebar" class="rounded-lg p-2 hover:bg-blue-100/50 active:bg-blue-200/50
               transition-all duration-200 group" :title="expanded ? 'Colapsar sidebar' : 'Expandir sidebar'"
        :aria-label="expanded ? 'Colapsar sidebar' : 'Expandir sidebar'">
        <Icon :icon="expanded ? 'lucide:panel-left-close' : 'lucide:panel-left-open'"
          class="w-5 h-5 text-[#475569] group-hover:text-blue-600 transition-colors" />
      </button>
    </div>

    <!-- Indicador de carga -->
    <div v-if="isNavigating" class="h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse" />

    <!-- Navigation con scroll mejorado -->
    <nav class="sidebar-nav flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 
             scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent" @scroll="handleScroll">
      <div class="flex flex-col gap-1">
        <template v-for="(item, index) in props.items" :key="item.id">
          <div>
            <!-- Item principal con mejor accesibilidad -->
            <button :data-item-id="item.id" @click="handleItemClick(item)" @keydown="handleKeyDown($event, item)"
              @focus="focusedItem = item.id" @blur="focusedItem = null" :disabled="item.disabled" :class="[
                'relative flex items-center w-full text-left px-4 py-3.5 rounded-xl',
                'transition-all duration-200 group font-medium text-sm',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 focus:ring-offset-transparent',
                // Estados activo/hover mejorados
                isCurrentPathStartsWith(item.path || '')
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                  : 'text-[#374151] hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 hover:scale-[1.01]',
                // Estados de disable
                item.disabled && 'opacity-40 cursor-not-allowed grayscale hover:scale-100'
              ]" :aria-expanded="item.children ? openSubmenu === item.id : undefined"
              :aria-haspopup="item.children ? 'true' : undefined">
              <!-- Icono con mejor spacing -->
              <div class="flex items-center justify-center w-6 h-6 flex-shrink-0">
                <Icon :icon="item.icon" class="w-5 h-5 transition-transform group-hover:scale-110" />
              </div>

              <!-- Label con animaciones -->
              <span class="ml-4 truncate transition-all duration-300 flex-1" :class="{
                'opacity-0 w-0 overflow-hidden': !expanded && !isHovering,
                'opacity-100 w-auto': expanded || isHovering
              }">
                {{ item.label }}
              </span>

              <!-- Badge opcional -->
              <span v-if="item.badge && (expanded || isHovering)" class="ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white
                       transition-all duration-300">
                {{ item.badge }}
              </span>

              <!-- Chevron para submenús -->
              <Icon v-if="item.children && (expanded || isHovering)"
                :icon="openSubmenu === item.id ? 'lucide:chevron-down' : 'lucide:chevron-right'"
                class="ml-2 w-4 h-4 transition-transform duration-200 flex-shrink-0"
                :class="openSubmenu === item.id && 'rotate-180'" />

              <!-- Indicador visual para item activo -->
              <div v-if="isCurrentPathStartsWith(item.path || '')"
                class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
            </button>

            <!-- Submenús con animaciones mejoradas -->
            <transition enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0 -translate-y-2" enter-to-class="opacity-100 max-h-96 translate-y-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 max-h-96 translate-y-0" leave-to-class="opacity-0 max-h-0 -translate-y-2">
              <div v-if="item.children && openSubmenu === item.id && (expanded || isHovering)"
                class="ml-8 mt-1 space-y-1 border-l-2 border-blue-100/50 pl-4 overflow-hidden">
                <button v-for="sub in item.children" :key="sub.id" :data-item-id="sub.id" @click="handleItemClick(sub)"
                  @keydown="handleKeyDown($event, sub)" :disabled="sub.disabled" :class="[
                    'w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium',
                    'transition-all duration-200 group relative',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500/40',
                    isCurrentPathStartsWith(sub.path || '')
                      ? 'bg-blue-100 text-blue-700 font-semibold shadow-sm'
                      : 'text-[#6B7280] hover:bg-blue-50/50 hover:text-blue-600',
                    sub.disabled && 'opacity-40 cursor-not-allowed'
                  ]">
                  {{ sub.label }}

                  <!-- Badge para subitems -->
                  <span v-if="sub.badge"
                    class="ml-auto px-1.5 py-0.5 text-xs font-bold rounded-full bg-orange-500 text-white">
                    {{ sub.badge }}
                  </span>
                </button>
              </div>
            </transition>
          </div>
        </template>
      </div>
    </nav>

    <!-- Footer mejorado -->
    <div class="mt-auto border-t border-[#D0EFFF]/40 p-4">
      <!-- Estado del sistema -->
      <div v-if="expanded || isHovering"
        class="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/40">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span class="text-xs font-semibold text-green-700">Sistema Online</span>
        </div>
        <p class="text-xs text-green-600/80">Todos los servicios funcionando</p>
      </div>

      <!-- Info y versión -->
      <div v-if="expanded || isHovering" class="mb-3 transition-all duration-300">
        <div class="flex items-center gap-2 mb-2">
          <span
            class="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2.5 py-1 rounded-full font-bold">
            BETA v1.2
          </span>
          <Icon icon="lucide:zap" class="w-3 h-3 text-amber-500" />
        </div>
        <p class="text-xs text-[#6B7280] leading-relaxed">
          Informática y Sistemas<br />
          <span class="font-semibold text-[#374151]">Universidad Nacional Agraria de la Selva</span>
        </p>
      </div>

      <!-- Botón de logout mejorado -->
      <button class="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl
               bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold
               hover:from-red-600 hover:to-pink-600 hover:shadow-lg hover:shadow-red-500/25
               active:scale-95 transition-all duration-200 group" @click="() => navigate('/logout')">
        <Icon icon="mdi:logout" class="w-4 h-4 group-hover:rotate-12 transition-transform" />
        <span v-if="expanded || isHovering" class="transition-all duration-300">
          Cerrar sesión
        </span>
      </button>
    </div>
  </aside>

</template>

<style scoped>
/* Scrollbar personalizado */
.sidebar-nav {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Variables CSS para hover states */
:root {
  --sidebar-hover-width: 5rem;
}
</style>