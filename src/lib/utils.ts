// src/lib/utils.ts
export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);

export const formatDistance = (km: number): string =>
  km < 1 ? `${Math.round(km * 1_000)}m` : `${km.toFixed(1)}km`;

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}min`;
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 9
    ? `+51 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
    : phone;
};

export const generateId = (): string => Math.random().toString(36).slice(2, 11);

/* Debounce genérico */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/* Distancia Haversine en km */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const R = 6_371; // radio Tierra km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const isValidEmail  = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
export const isValidPhone  = (p: string) => /^9\d{8}$/.test(p.replace(/\D/g, ''));

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/* Construye className condicional al estilo clsx/twMerge */
export const cn = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(' ');
