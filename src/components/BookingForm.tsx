"use client";

import { useState } from "react";
import { Room, Guest, BookingRequest } from "../types/booking";
import DatePicker from "./DatePicker";

interface BookingFormProps {
  room: Room;
  initialCheckIn: string;
  initialCheckOut: string;
  onSubmit: (booking: BookingRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function BookingForm({
  room,
  initialCheckIn,
  initialCheckOut,
  onSubmit,
  onCancel,
  isLoading = false,
}: BookingFormProps) {
  const [checkInDate, setCheckInDate] = useState(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);
  const [guest, setGuest] = useState<Guest>({
    first_name: "",
    last_name: "",
    full_name: "N/A",
    email: "",
    phone: "",
    address: "",
    date_of_birth: "2025-01-01",
    nationality: "N/A",
  });
  const [errors, setErrors] = useState<Partial<Guest>>({});

  const validateForm = () => {
    const newErrors: Partial<Guest> = {};

    if (!guest.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!guest.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!guest.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(guest.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!guest.phone.trim()) newErrors.phone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const booking: BookingRequest = {
      guest_details: guest,
      room_id: room.id,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
    };

    await onSubmit(booking);
  };

  const nights = Math.ceil(
    (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const totalPrice = parseFloat(room.room_type.base_price) * nights;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">
            Book {room.room_type.name}
          </h2>
          <p className="text-gray-600 mt-1">{room.room_type.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              label="Check-in Date"
              value={checkInDate}
              onChange={setCheckInDate}
              min={new Date().toISOString().split("T")[0]}
            />
            <DatePicker
              label="Check-out Date"
              value={checkOutDate}
              onChange={setCheckOutDate}
              min={checkInDate || new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {nights} nights × ${room.room_type.base_price}
              </span>
              <span className="text-xl font-semibold">${totalPrice}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Guest Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={guest.first_name}
                  onChange={(e) =>
                    setGuest({ ...guest, first_name: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.first_name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={guest.last_name}
                  onChange={(e) =>
                    setGuest({ ...guest, last_name: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.last_name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={guest.email}
                onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={guest.phone}
                onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !checkInDate || !checkOutDate}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Booking..." : `Book for $${totalPrice}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
