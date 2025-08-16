import { Room, Booking, BookingRequest } from '../types/booking';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response;
  }

  async searchRooms(
    checkIn: string, 
    checkOut: string, 
    maxPrice?: number,
    amenities?: string[]
  ): Promise<Room[]> {
    const params = new URLSearchParams();
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (maxPrice) params.append('maxPrice', maxPrice.toString());
    if (amenities?.length) {
      amenities.forEach(amenity => params.append('amenities', amenity));
    }

    const response = await this.fetchWithAuth(`/rooms?${params.toString()}`);
    return response.json();
  }

  async createBooking(booking: BookingRequest): Promise<Booking> {
    const response = await this.fetchWithAuth('/bookings/', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
    return response.json();
  }

  async getBooking(bookingId: string): Promise<Booking> {
    const response = await this.fetchWithAuth(`/bookings/${bookingId}`);
    return response.json();
  }

  async getBookingsByEmail(email: string): Promise<Booking[]> {
    const params = new URLSearchParams({ email });
    const response = await this.fetchWithAuth(`/bookings?${params.toString()}`);
    return response.json();
  }

  async cancelBooking(bookingId: string): Promise<void> {
    await this.fetchWithAuth(`/bookings/${bookingId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'cancelled' }),
    });
  }
}

export const apiService = new ApiService();