<script setup lang="ts">
import { Icon } from '@iconify/vue';
import ProfileMenuItem from './ProfileMenuItem.vue';
import { useAuthStore } from '@/auth/stores/auth'; // Vue Pinia version
import { useRouter } from 'vue-router';
import { computed } from 'vue';

defineProps<{
  closeMenu: () => void;
}>();

const auth = useAuthStore();
const router = useRouter();

const profileRoute = computed(() =>
  auth.user?.user_type === 'driver' || auth.user?.user_type === 'both'
    ? '/driver/profile'
    : '/passenger/profile'
);

const handleLogout = async () => {

  await auth.logout();
};
</script>

<template>
  <div
    class="
      w-auto min-w-[12rem] max-w-xs
      bg-white/90 backdrop-blur-lg border border-white/30
      rounded-3xl shadow-glam overflow-hidden
    "
  >
    <!-- Header con avatar y datos -->
    <div class="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
      <img
        v-if="auth.user?.avatar_url"
        :src="auth.user.avatar_url"
        alt="Avatar"
        class="w-10 h-10 rounded-full object-cover"
      />
      <Icon
        v-else
        icon="mdi:account-circle"
        class="w-10 h-10 text-gray-400"
      />
      <div class="flex flex-col overflow-hidden">
        <span class="font-semibold text-gray-900 truncate">
          {{ auth.user?.name }}
        </span>
        <span class="text-xs text-gray-500 truncate">
          {{ auth.user?.email }}
        </span>
      </div>
    </div>

    <!-- Opciones de menú -->
    <div class="py-2">
      <ProfileMenuItem
        icon="mdi:account-outline"
        @click="() => { closeMenu(); router.push(profileRoute) }"
      >
        Ver perfil
      </ProfileMenuItem>

      <ProfileMenuItem
        icon="mdi:pencil-outline"
        @click="() => { closeMenu(); router.push(`${profileRoute}?edit=1`) }"
      >
        Editar perfil
      </ProfileMenuItem>
    </div>

    <div class="mx-4 my-2 h-px bg-gray-200" />

    <!-- Logout -->
    <div class="py-2">
      <ProfileMenuItem icon="mdi:logout" @click="handleLogout">
        Cerrar sesión
      </ProfileMenuItem>
    </div>
  </div>
</template>
