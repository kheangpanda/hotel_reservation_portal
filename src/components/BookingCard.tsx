"use client";

import { Booking } from "../types/booking";

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => Promise<void>;
  isLoading?: boolean;
}

export default function BookingCard({
  booking,
  onCancel,
  isLoading = false,
}: BookingCardProps) {
  const checkInDate = new Date(booking.checkInDate).toLocaleDateString();
  const checkOutDate = new Date(booking.checkOutDate).toLocaleDateString();
  const createdDate = new Date(booking.createdAt).toLocaleDateString();

  const nights = Math.ceil(
    (new Date(booking.checkOutDate).getTime() -
      new Date(booking.checkInDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const canCancel =
    booking.status === "confirmed" &&
    new Date(booking.checkInDate) > new Date();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {booking.room.name}
          </h3>
          <p className="text-gray-600">{booking.room.type}</p>
          <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            booking.status === "confirmed"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Guest Information</h4>
          <p className="text-gray-700">
            {booking.guest.firstName} {booking.guest.lastName}
          </p>
          <p className="text-gray-600 text-sm">{booking.guest.email}</p>
          <p className="text-gray-600 text-sm">{booking.guest.phone}</p>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Stay Details</h4>
          <p className="text-gray-700">Check-in: {checkInDate}</p>
          <p className="text-gray-700">Check-out: {checkOutDate}</p>
          <p className="text-gray-600 text-sm">{nights} nights</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${booking.totalPrice}
            </span>
            <span className="text-gray-600 text-sm ml-2">Total</span>
          </div>
          <div className="text-sm text-gray-600">Booked on {createdDate}</div>
        </div>

        {canCancel && (
          <button
            onClick={() => onCancel(booking.id)}
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Cancelling..." : "Cancel Booking"}
          </button>
        )}
      </div>
    </div>
  );
}
