// navigation/navItems.ts
import { ref, type Ref } from 'vue';

export interface NavNode {
  id: string;
  label: string;
  icon?: string;      // opcional para permitir hijos sin icon
  path?: string;
  children?: NavNode[];
  badge?: number;
  disabled?: boolean;
}

// Tu árbol tal cual (tipado)
export const navItems: NavNode[] = [
  { id: 'dashboard', icon: 'mdi:home', label: 'Dashboard', path: '/dashboard' },
  {
    id: 'parcels',
    icon: 'mdi:map',
    label: 'Parcelas',
    children: [
      { id: 'list', label: 'Todas las parcelas', path: '/sima/parcels' },
      { id: 'new',  label: 'Nueva parcela',      path: '/sima/parcels/new' },
    ],
  },
  {
    id: 'sensors',
    icon: 'mdi:thermometer',
    label: 'Sensores',
    children: [
      { id: 'list',    label: 'Lista',            path: '/sima/sensors' },
      { id: 'types',   label: 'Tipos de sensor',  path: '/sima/sensors/types' },
      { id: 'readings',label: 'Lecturas',         path: '/sima/sensors/readings' },
    ],
  },
  {
    id: 'control-units',
    icon: 'mdi:chip',
    label: 'Control Units',
    children: [
      { id: 'list-cu', label: 'Lista de unidades', path: '/sima/control-units' },
      { id: 'new-cu',  label: 'Nueva unidad',      path: '/sima/control-units/new' },
    ],
  },
];

// Ref reactivo para que useBottomNav pueda leer .value
export const navTreeRef: Ref<NavNode[]> = ref(navItems);

// (Opcional) Helper para reemplazar dinámicamente el árbol
export function setNav(nodes: NavNode[]) {
  navTreeRef.value = nodes;
}
