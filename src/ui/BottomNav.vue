<!-- ui/BottomNav.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useNavigation } from '@/router/useNavigation';
import { cn } from '@/lib/utils';

export interface BottomNavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
  disabled?: boolean;
}
interface Props { items: BottomNavItem[]; className?: string; }
const props = defineProps<Props>();

const { navigate, isCurrentPathStartsWith } = useNavigation();

const rootClass = computed(() =>
  cn(
    'fixed bottom-0 left-0 right-0 z-50',
    'bg-white/80 backdrop-blur-2xl border-t border-blue-100/50',
    'shadow-mid lg:hidden',
    props.className,
  ),
);
</script>

<template>
  <div :class="rootClass">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r
                from-blue-400 to-purple-400 rounded-full opacity-60" />

    <div class="flex items-center justify-around px-2 py-3">
      <button
        v-for="item in props.items"
        :key="item.id"
        :disabled="item.disabled"
        @click="!item.disabled && navigate(item.path)"
        :class="[
          'group', /* 👈 habilita group-hover */
          'relative flex flex-col items-center justify-center flex-1 max-w-[75px] px-3 py-2 rounded-2xl',
          'transition-all duration-300 ease-out transform-gpu',
          isCurrentPathStartsWith(item.path)
            ? 'bg-gradient-to-b from-blue-50/90 to-blue-100/60 text-blue-600 shadow-glam scale-105 -translate-y-1 border border-blue-200/50'
            : 'text-gray-600 hover:text-blue-600 hover:bg-gradient-to-b hover:from-gray-50/80 hover:to-gray-100/40 hover:scale-[1.02] border border-transparent hover:border-gray-200/30',
          item.disabled && 'opacity-30 cursor-not-allowed grayscale scale-95',
        ]"
      >
        <span
          :class="[
            'relative w-8 h-8 mb-2 flex items-center justify-center transition-all duration-300',
            isCurrentPathStartsWith(item.path) ? 'scale-110' : 'group-hover:scale-105',
          ]"
        >
          <Icon
            :icon="item.icon"
            :class="[
              'w-6 h-6 transition-all duration-300',
              isCurrentPathStartsWith(item.path)
                ? 'drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)] filter brightness-110'
                : 'group-hover:brightness-110',
            ]"
          />
          <span
            v-if="isCurrentPathStartsWith(item.path)"
            class="absolute inset-0 rounded-full bg-blue-400/20 blur-sm scale-150 animate-pulse"
          />
        </span>

        <span
          :class="[
            'text-xs font-medium truncate w-full text-center transition-all duration-300 tracking-wide',
            isCurrentPathStartsWith(item.path) && 'text-blue-700 font-semibold drop-shadow-sm',
          ]"
        >
          {{ item.label }}
        </span>

        <span
          v-if="item.badge && item.badge > 0"
          class="absolute -top-1 -right-1 min-w-[22px] h-[22px] rounded-full flex items-center justify-center
                 bg-gradient-to-r from-red-500 via-red-600 to-pink-500
                 text-white text-xs font-bold
                 shadow-glam border-2 border-white/80 animate-pulse
                 before:absolute before:inset-0
                 before:bg-gradient-to-r before:from-red-400/50 before:to-pink-400/50
                 before:blur-sm before:scale-150"
        >
          <span class="relative z-10">
            {{ item.badge > 99 ? '99+' : item.badge }}
          </span>
        </span>

        <span
          class="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none
                 before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full
                 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
                 before:skew-x-12 before:transition-all before:duration-700 group-hover:before:left-[100%]"
        />
      </button>
    </div>

    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
    <div class="h-safe-area-inset-bottom bg-gradient-to-b from-white/50 to-white/80" />
  </div>
</template>
