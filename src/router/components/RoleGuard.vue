<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { useAuthStore } from '../../auth/stores/auth';
import { canAccessRoute } from '../guards';

interface Props {
  roles?: string[];
  permissions?: string[];
}

const props = defineProps<Props>();
const auth  = useAuthStore();

/** `true` si el usuario pasa los roles / permisos requeridos */
const allowed = computed(() =>
  canAccessRoute(auth.user, props.roles, props.permissions),
);
</script>

<template>
  <div>
    <!-- Contenido protegido -->
    <slot v-if="allowed" />

    <!-- Fallback por defecto o personalizado -->
    <slot
      v-else
      name="fallback"
      :message="'You don\'t have permission to view this page'"
    >
      <div class="p-4 text-center text-red-600">
        You don't have permission to view this page
      </div>
    </slot>
  </div>
</template>
