"use client";

import Image from "next/image";
import { Room } from "../types/booking";

interface RoomCardProps {
  room: Room;
  onBook: (room: Room) => void;
  checkInDate: string;
  checkOutDate: string;
}

export default function RoomCard({
  room,
  onBook,
  checkInDate,
  checkOutDate,
}: RoomCardProps) {
  console.log("Rendering RoomCard for:", room);
  const nights =
    checkInDate && checkOutDate
      ? Math.ceil(
          (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 1;

  const totalPrice = parseFloat(room.room_type.base_price) * nights;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {room.imageUrl ? (
          <Image
            src={room.imageUrl ?? ""}
            alt={room.room_type.name}
            className="w-full h-full object-cover"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
        ) : (
          <span className="text-gray-500">No image available</span>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {room.room_type.name}
        </h3>
        <p className="text-gray-600 mb-2">{room.type}</p>
        <p className="text-gray-700 text-sm mb-4">{room.description}</p>

        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Amenities:</h4>
          <div className="flex flex-wrap gap-2">
            {room.room_type.amenities &&
              room.room_type.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {amenity}
                </span>
              ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${room.room_type.base_price}
            </span>
            <span className="text-gray-600">/night</span>
          </div>
          <div className="text-sm text-gray-600">
            Max {room.room_type.max_occupancy} guests
          </div>
        </div>

        {nights > 1 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <div className="text-sm text-gray-600">
              {nights} nights × ${room.room_type.base_price} ={" "}
              <span className="font-semibold">${totalPrice}</span>
            </div>
          </div>
        )}

        <button
          onClick={() => onBook(room)}
          disabled={!checkInDate || !checkOutDate}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Book Room
        </button>
      </div>
    </div>
  );
}
