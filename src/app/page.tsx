"use client";

import { useState } from "react";
import { Room, BookingRequest } from "../types/booking";
import { useRoomSearch } from "../hooks/useRoomSearch";
import { useBookings } from "../hooks/useBookings";
import { apiService } from "../lib/api";
import DatePicker from "../components/DatePicker";
import RoomCard from "../components/RoomCard";
import BookingForm from "../components/BookingForm";
import BookingCard from "../components/BookingCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function HotelBookingApp() {
  const [activeTab, setActiveTab] = useState<"search" | "bookings">("search");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState(""); // For tracking user bookings
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Use custom hooks
  const {
    rooms,
    loading: searchLoading,
    error: searchError,
    searchRooms,
  } = useRoomSearch();

  const {
    bookings,
    loading: bookingsLoading,
    error: bookingsError,
    cancelBooking,
  } = useBookings(guestEmail);

  const handleSearch = () => {
    searchRooms(
      checkInDate,
      checkOutDate,
      maxPrice ? parseInt(maxPrice) : undefined
    );
  };

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleBookingSubmit = async (booking: BookingRequest) => {
    setIsBooking(true);
    setBookingError(null);

    try {
      await apiService.createBooking(booking);
      setGuestEmail(booking.guest.email); // Track this user's bookings
      setSelectedRoom(null);
      setActiveTab("bookings");
      alert("Booking confirmed successfully!");
    } catch (error) {
      setBookingError(
        error instanceof Error ? error.message : "Error creating booking"
      );
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    const success = await cancelBooking(bookingId);
    if (success) {
      alert("Booking cancelled successfully");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Hotel Booking</h1>
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("search")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "search"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Search Rooms
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "bookings"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                My Bookings ({bookings.length})
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "search" && (
          <div>
            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Search Available Rooms
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price (Optional)
                  </label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Enter max price"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleSearch}
                    disabled={searchLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {searchLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      "Search Rooms"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {searchError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Search Error
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {searchError}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {rooms.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Available Rooms ({rooms.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onBook={handleBookRoom}
                      checkInDate={checkInDate}
                      checkOutDate={checkOutDate}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No results message */}
            {!searchLoading &&
              !searchError &&
              rooms.length === 0 &&
              checkInDate &&
              checkOutDate && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-center">
                  <p className="text-yellow-800">
                    No rooms found for the selected dates and criteria.
                  </p>
                </div>
              )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                My Bookings
              </h2>
              {!guestEmail && (
                <div className="flex items-center space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email to view bookings"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Error Display */}
            {bookingsError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error Loading Bookings
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {bookingsError}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {bookingsLoading && (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {/* No bookings state */}
            {!bookingsLoading &&
              !bookingsError &&
              bookings.length === 0 &&
              guestEmail && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600 mb-4">
                    No bookings found for this email address.
                  </p>
                  <button
                    onClick={() => setActiveTab("search")}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Search Rooms
                  </button>
                </div>
              )}

            {/* Bookings List */}
            {!bookingsLoading && bookings.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancelBooking}
                  />
                ))}
              </div>
            )}

            {/* Initial state - no email entered */}
            {!guestEmail && !bookingsLoading && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 mb-4">
                  Enter your email address above to view your bookings.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Booking Form Modal */}
      {selectedRoom && (
        <BookingForm
          room={selectedRoom}
          initialCheckIn={checkInDate}
          initialCheckOut={checkOutDate}
          onSubmit={handleBookingSubmit}
          onCancel={() => {
            setSelectedRoom(null);
            setBookingError(null);
          }}
          isLoading={isBooking}
        />
      )}

      {/* Booking Error Modal */}
      {bookingError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-red-800 mb-4">
              Booking Error
            </h3>
            <p className="text-gray-700 mb-6">{bookingError}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setBookingError(null)}
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
