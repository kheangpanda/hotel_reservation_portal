export interface RoomType {
  id: string;
  name: string;
  description: string;
  base_price: string;
  max_occupancy: number;
  amenities: string[];
}

export interface Room {
  id: string;
  room_number: string;
  room_type: RoomType;
  floor_number: number;
  imageUrl?: string;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface Guest {
  id?: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  phone: string;
  address?: string;
  date_of_birth?: string;
  nationality?: string;
}

export interface Booking {
  id: string;
  guestId: string;
  guest: Guest;
  roomId: string;
  room: Room;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface BookingRequest {
  guest_details: Guest;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
}