export type UserRole = 'client' | 'cleaner';
export type ServiceType = 'regular' | 'deep_clean' | 'vacancy' | 'office' | 'specialty' | 'event' | 'rental' | 'post_construction';
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'declined';
export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export type CleanerBadge = 'top_rated' | 'quick_responder' | 'verified' | 'eco_friendly';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  location: string;
  phone?: string;
  createdAt: string;
}

export interface ServiceOffering {
  type: ServiceType;
  label: string;
  durationHours: number;
  basePrice: number; // cents
}

export interface TimeSlot {
  start: string; // "09:00"
  end: string;   // "17:00"
}

export interface CleanerProfile {
  userId: string;
  bio: string;
  yearsExperience: number;
  servicesOffered: ServiceOffering[];
  hourlyRate: number; // cents
  availability: Partial<Record<DayOfWeek, TimeSlot | null>>;
  coverageAreaMiles: number;
  languages: string[];
  insuranceCertified: boolean;
  backgroundChecked: boolean;
  averageRating: number;
  totalReviews: number;
  totalJobsCompleted: number;
  badges: CleanerBadge[];
}

export interface CleanerListing {
  user: User;
  profile: CleanerProfile;
}

export interface Booking {
  id: string;
  clientId: string;
  cleanerId: string;
  serviceType: ServiceType;
  scheduledDate: string;  // "2026-05-10"
  scheduledTime: string;  // "14:00"
  estimatedDurationHours: number;
  addressLine1: string;
  city: string;
  notes?: string;
  status: BookingStatus;
  totalAmountCents: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  clientId: string;
  cleanerId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  isPublic: boolean;
}

export interface AuthSession {
  userId: string;
  role: UserRole;
  token: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface FilterState {
  search: string;
  location: string;
  serviceType: string;
  maxPrice: number;
  minRating: number;
  sortBy: string;
}
