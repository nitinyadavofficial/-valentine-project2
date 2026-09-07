import type { Train } from '@/types';

export function formatTime(time: string): string {
  return time;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function getClassName(code: string): string {
  const classes: Record<string, string> = {
    '1A': 'AC First Class',
    '2A': 'AC 2 Tier',
    '3A': 'AC 3 Tier',
    'EC': 'Executive Chair Car',
    'CC': 'AC Chair Car',
    'SL': 'Sleeper',
    '2S': 'Second Seating',
  };
  return classes[code] || code;
}

export function getStationName(code: string, stations: { code: string; name: string }[]): string {
  const station = stations.find((s) => s.code === code);
  return station ? station.name : code;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calculateDelayStatus(delayMinutes: number): { label: string; color: string } {
  if (delayMinutes <= 0) return { label: 'On Time', color: 'green' };
  if (delayMinutes <= 15) return { label: `${delayMinutes} min late`, color: 'amber' };
  if (delayMinutes <= 60) return { label: `${delayMinutes} min late`, color: 'orange' };
  return { label: `${Math.floor(delayMinutes / 60)}h ${delayMinutes % 60}m late`, color: 'red' };
}

export function getSeatTypeLabel(type: string): string {
  const types: Record<string, string> = {
    LB: 'Lower Berth',
    MB: 'Middle Berth',
    UB: 'Upper Berth',
    SL: 'Side Lower',
    SU: 'Side Upper',
    WL: 'Window',
    RS: 'Reserved',
    AC: 'Seat',
  };
  return types[type] || type;
}

export function generatePNR(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

export function validateAadhaar(aadhaar: string): boolean {
  const cleaned = aadhaar.replace(/\s/g, '');
  return /^\d{12}$/.test(cleaned);
}

export function validatePAN(pan: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
}

export function validatePassport(passport: string): boolean {
  return /^[A-Z]{1}[0-9]{7}$/.test(passport.toUpperCase());
}

export function maskIdNumber(type: string, number: string): string {
  switch (type) {
    case 'AADHAAR':
      return `XXXX XXXX ${number.slice(-4)}`;
    case 'PAN':
      return `${number.slice(0, 5)}XXXX${number.slice(-1)}`;
    case 'PASSPORT':
      return `${number[0]}XXXXXXX`;
    default:
      return `****${number.slice(-4)}`;
  }
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(fn: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}