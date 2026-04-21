import type { BookingStatus, ServiceType, CleanerBadge } from '../types';
import { 
  Sparkles, 
  Home, 
  Building2, 
  PartyPopper, 
  CalendarDays, 
  Brush, 
  HardHat,
  LucideIcon 
} from 'lucide-react';

export function getServiceIcon(type: ServiceType): LucideIcon {
  const icons: Record<ServiceType, LucideIcon> = {
    regular: Sparkles,
    deep_clean: Brush,
    vacancy: Home,
    office: Building2,
    specialty: Sparkles,
    event: PartyPopper,
    rental: CalendarDays,
    post_construction: HardHat,
  };
  return icons[type];
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatCentsShort(cents: number): string {
  const dollars = cents / 100;
  if (Number.isInteger(dollars)) return `$${dollars}`;
  return `$${dollars.toFixed(0)}`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function getInitials(first: string, last: string): string {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export function getServiceLabel(type: ServiceType): string {
  const labels: Record<ServiceType, string> = {
    regular: 'Regular Cleaning',
    deep_clean: 'Deep Clean',
    vacancy: 'Vacancy Cleaning',
    office: 'Office Cleaning',
    specialty: 'Specialty Cleaning',
    event: 'Event Cleaning',
    rental: 'Short-term Rental Cleaning',
    post_construction: 'Post-Construction Cleaning',
  };
  return labels[type];
}

export function getStatusLabel(status: BookingStatus): string {
  const labels: Record<BookingStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    declined: 'Declined',
  };
  return labels[status];
}

export function getStatusColorClasses(status: BookingStatus): string {
  const colors: Record<BookingStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-teal-100 text-teal-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-600',
    declined: 'bg-red-100 text-red-800',
  };
  return colors[status];
}

export function getBadgeLabel(badge: CleanerBadge): string {
  const labels: Record<CleanerBadge, string> = {
    top_rated: 'Top Rated',
    quick_responder: 'Quick Responder',
    verified: 'Verified',
    eco_friendly: 'Eco Friendly',
  };
  return labels[badge];
}

export function getBadgeColorClasses(badge: CleanerBadge): string {
  const colors: Record<CleanerBadge, string> = {
    top_rated: 'bg-yellow-100 text-yellow-800',
    quick_responder: 'bg-purple-100 text-purple-800',
    verified: 'bg-blue-100 text-blue-800',
    eco_friendly: 'bg-green-100 text-green-800',
  };
  return colors[badge];
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}
