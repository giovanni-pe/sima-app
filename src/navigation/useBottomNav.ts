// navigation/useBottomNav.ts
import { computed } from 'vue';
import { navTreeRef, type NavNode } from './navItems';

// Reutilizamos el tipo que ya tienes en BottomNav.vue
export interface BottomNavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
  disabled?: boolean;
}

function nodeToBottomItem(n: NavNode): BottomNavItem {
  const firstChildPath = n.children?.find(c => !!c.path)?.path;
  return {
    id: n.id,
    label: n.label,
    icon: n.icon,
    path: n.path ?? firstChildPath ?? '/',
    // Aquí podrías mapear badges reales (ej: notificaciones) según el id
    // badge: n.id === 'alerts' ? unreadCount.value : undefined,
  };
}

export function useBottomNav() {
  const items = computed<BottomNavItem[]>(() =>
    navTreeRef.value
      .filter(n => n && n.id && n.label && n.icon)
      .map(nodeToBottomItem)
  );
  return { items };
}
