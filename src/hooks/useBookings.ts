
'use client';

import { useState, useEffect } from 'react';
import { Booking } from '../types/booking';
import { apiService } from '../lib/api';

export function useBookings(guestEmail?: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async () => {
    if (!guestEmail) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userBookings = await apiService.getBookingsByEmail(guestEmail);
      setBookings(userBookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [guestEmail]);

  const cancelBooking = async (bookingId: string) => {
    try {
      await apiService.cancelBooking(bookingId);
      await loadBookings(); // Refresh bookings
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
      return false;
    }
  };

  return {
    bookings,
    loading,
    error,
    loadBookings,
    cancelBooking,
  };
}