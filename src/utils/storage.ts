import { mockUsers, mockCleanerProfiles, mockBookings, mockReviews } from '../data';
import type { User, CleanerProfile, Booking, Review } from '../types';

const KEYS = {
  users: 'cm_users',
  profiles: 'cm_profiles',
  bookings: 'cm_bookings',
  reviews: 'cm_reviews',
  session: 'cm_session',
  favorites: 'cm_favorites',
  seeded: 'cm_seeded_v2',
};

export { KEYS };

export function get<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function set<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage might be unavailable (private mode, full, etc.)
  }
}

export function remove(key: string): void {
  localStorage.removeItem(key);
}

export function seedIfEmpty(): void {
  if (get<boolean>(KEYS.seeded)) return;
  // Clear stale data from previous seed versions
  localStorage.removeItem('cm_seeded');
  set<User[]>(KEYS.users, mockUsers);
  set<CleanerProfile[]>(KEYS.profiles, mockCleanerProfiles);
  set<Booking[]>(KEYS.bookings, mockBookings);
  set<Review[]>(KEYS.reviews, mockReviews);
  set<boolean>(KEYS.seeded, true);
}

export function getUsers(): User[] {
  return get<User[]>(KEYS.users) ?? [];
}

export function getProfiles(): CleanerProfile[] {
  return get<CleanerProfile[]>(KEYS.profiles) ?? [];
}

export function getBookings(): Booking[] {
  return get<Booking[]>(KEYS.bookings) ?? [];
}

export function getReviews(): Review[] {
  return get<Review[]>(KEYS.reviews) ?? [];
}

export function saveUsers(users: User[]): void {
  set(KEYS.users, users);
}

export function saveProfiles(profiles: CleanerProfile[]): void {
  set(KEYS.profiles, profiles);
}

export function saveBookings(bookings: Booking[]): void {
  set(KEYS.bookings, bookings);
}

export function saveReviews(reviews: Review[]): void {
  set(KEYS.reviews, reviews);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
