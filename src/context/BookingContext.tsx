import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { Booking, Review, BookingStatus, ServiceType } from '../types';
import {
  getBookings, saveBookings, getReviews, saveReviews,
  getProfiles, saveProfiles, generateId,
} from '../utils/storage';

interface CreateBookingData {
  clientId: string;
  cleanerId: string;
  serviceType: ServiceType;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDurationHours: number;
  addressLine1: string;
  city: string;
  notes?: string;
  totalAmountCents: number;
}

interface BookingContextType {
  bookings: Booking[];
  reviews: Review[];
  isLoading: boolean;
  createBooking: (data: CreateBookingData) => Promise<Booking>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  submitReview: (bookingId: string, rating: number, comment: string) => Promise<void>;
  getClientBookings: (clientId: string) => Booking[];
  getCleanerBookings: (cleanerId: string) => Booking[];
  hasReviewForBooking: (bookingId: string) => boolean;
  refreshBookings: () => void;
}

export const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshBookings = useCallback(() => {
    setBookings(getBookings());
    setReviews(getReviews());
  }, []);

  useEffect(() => {
    refreshBookings();
  }, [refreshBookings]);

  const createBooking = useCallback((data: CreateBookingData): Promise<Booking> => {
    return new Promise(resolve => {
      setIsLoading(true);
      setTimeout(() => {
        const now = new Date().toISOString();
        const booking: Booking = {
          id: `booking-${generateId()}`,
          ...data,
          status: 'pending',
          paymentStatus: 'paid',
          createdAt: now,
          updatedAt: now,
        };
        const updated = [...getBookings(), booking];
        saveBookings(updated);
        setBookings(updated);
        setIsLoading(false);
        resolve(booking);
      }, 500);
    });
  }, []);

  const updateBookingStatus = useCallback((id: string, status: BookingStatus): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const updated = getBookings().map(b =>
          b.id === id ? { ...b, status, updatedAt: new Date().toISOString() } : b
        );
        saveBookings(updated);
        setBookings(updated);
        resolve();
      }, 350);
    });
  }, []);

  const submitReview = useCallback((bookingId: string, rating: number, comment: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const allBookings = getBookings();
        const booking = allBookings.find(b => b.id === bookingId);
        if (!booking) { reject(new Error('Booking not found')); return; }

        const existingReviews = getReviews();
        if (existingReviews.some(r => r.bookingId === bookingId)) {
          reject(new Error('Review already submitted'));
          return;
        }

        const review: Review = {
          id: `review-${generateId()}`,
          bookingId,
          clientId: booking.clientId,
          cleanerId: booking.cleanerId,
          rating,
          comment,
          createdAt: new Date().toISOString(),
          isPublic: true,
        };

        const updatedReviews = [...existingReviews, review];
        saveReviews(updatedReviews);
        setReviews(updatedReviews);

        // Update cleaner's aggregate rating
        const profiles = getProfiles();
        const cleanerReviews = updatedReviews.filter(r => r.cleanerId === booking.cleanerId);
        const avgRating = cleanerReviews.length > 0
          ? cleanerReviews.reduce((sum, r) => sum + r.rating, 0) / cleanerReviews.length
          : 0;
        const updatedProfiles = profiles.map(p =>
          p.userId === booking.cleanerId
            ? { ...p, averageRating: Math.round(avgRating * 10) / 10, totalReviews: cleanerReviews.length }
            : p
        );
        saveProfiles(updatedProfiles);

        resolve();
      }, 400);
    });
  }, []);

  const getClientBookings = useCallback((clientId: string) =>
    bookings.filter(b => b.clientId === clientId), [bookings]);

  const getCleanerBookings = useCallback((cleanerId: string) =>
    bookings.filter(b => b.cleanerId === cleanerId), [bookings]);

  const hasReviewForBooking = useCallback((bookingId: string) =>
    reviews.some(r => r.bookingId === bookingId), [reviews]);

  return (
    <BookingContext.Provider value={{
      bookings, reviews, isLoading,
      createBooking, updateBookingStatus, submitReview,
      getClientBookings, getCleanerBookings, hasReviewForBooking,
      refreshBookings,
    }}>
      {children}
    </BookingContext.Provider>
  );
}
