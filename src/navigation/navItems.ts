export const navItems = [
  { id: 'dashboard', icon: 'mdi:home', label: 'Dashboard', path: '/dashboard' },
  {
    id: 'parcels',
    icon: 'mdi:map',
    label: 'Parcelas',
    children: [
      { id: 'list', label: 'Todas las parcelas', path: '/sima/parcels' },
      { id: 'new', label: 'Nueva parcela', path: '/sima/parcels/new' },
    ],
  },
  {
    id: 'sensors',
    icon: 'mdi:thermometer',
    label: 'Sensores',
    children: [
      { id: 'types', label: 'Tipos de sensor', path: '/sima/sensors/types' },
      { id: 'readings', label: 'Lecturas', path: '/sima/sensors/readings' },
    ],
  },
  {
    id: 'actuators',
    icon: 'mdi:flash',
    label: 'Actuadores',
    children: [
      { id: 'list-act', label: 'Lista de actuadores', path: '/sima/actuators' },
      { id: 'events', label: 'Eventos', path: '/sima/events' },
    ],
  },
  {
    id: 'control-units',
    icon: 'mdi:chip',
    label: 'Control Units',
    children: [
      { id: 'list-cu', label: 'Lista de unidades', path: '/sima/control-units' },
      { id: 'new-cu', label: 'Nueva unidad', path: '/sima/control-units/new' },
    ],
  },
];
