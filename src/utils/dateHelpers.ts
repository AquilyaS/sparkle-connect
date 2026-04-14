import type { DayOfWeek } from '../types';

const DAY_NAMES: Record<DayOfWeek, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

const DAY_SHORT: Record<DayOfWeek, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
};

const DAY_ORDER: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export function getDayFullName(day: DayOfWeek): string {
  return DAY_NAMES[day];
}

export function getDayShortName(day: DayOfWeek): string {
  return DAY_SHORT[day];
}

export function getDayOrder(): DayOfWeek[] {
  return DAY_ORDER;
}

export function formatDisplayDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatShortDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatMonthYear(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

export function isDateInPast(iso: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date < today;
}

export function generateNext28Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 1; i <= 28; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(toIsoDate(d));
  }
  return days;
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDayOfWeek(iso: string): DayOfWeek {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const jsDay = date.getDay(); // 0=Sun, 1=Mon...
  const mapping: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return mapping[jsDay];
}

export function formatTime(time: string): string {
  const [hourStr, minStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const min = minStr;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  return `${h}:${min} ${ampm}`;
}

export function generateTimeSlots(start: string, end: string): string[] {
  const slots: string[] = [];
  const [startH] = start.split(':').map(Number);
  const [endH] = end.split(':').map(Number);
  for (let h = startH; h <= endH - 1; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < endH - 1) {
      slots.push(`${String(h).padStart(2, '0')}:30`);
    }
  }
  return slots;
}

export function getMonthLabel(monthsAgo: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

export function isSameMonth(iso: string, monthsAgo: number): boolean {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  const [year, month] = iso.split('-').map(Number);
  return d.getFullYear() === year && d.getMonth() + 1 === month;
}
