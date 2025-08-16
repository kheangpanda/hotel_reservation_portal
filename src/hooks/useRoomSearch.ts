'use client';

import { useState } from 'react';
import { Room } from '../types/booking';
import { apiService } from '../lib/api';

export function useRoomSearch() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchRooms = async (
    checkIn: string,
    checkOut: string,
    maxPrice?: number,
    amenities?: string[]
  ) => {
    if (!checkIn || !checkOut) {
      setError('Please select both check-in and check-out dates');
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setError('Check-out date must be after check-in date');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await apiService.searchRooms(checkIn, checkOut, maxPrice, amenities);
      console.log("results == ",results)
      setRooms(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search rooms');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setRooms([]);
    setError(null);
  };

  return {
    rooms,
    loading,
    error,
    searchRooms,
    clearSearch,
  };
}