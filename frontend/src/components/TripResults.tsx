'use client';

import Link from 'next/link';
import { format } from 'date-fns';

export default function TripResults({ trips, searchParams }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        ✈️ Available Flights ({trips.length})
      </h2>
      <div className="space-y-4">
        {trips.map((trip: any) => (
          <div
            key={trip.id}
            className="card border-l-4 border-blue-600 hover:shadow-lg transition-shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              {/* Departure */}
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Departure</p>
                <p className="text-2xl font-bold text-gray-800">{trip.departure_time}</p>
                <p className="text-sm font-semibold text-blue-600">{trip.origin_code}</p>
                <p className="text-xs text-gray-600">{trip.origin_city}</p>
              </div>

              {/* Duration */}
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase font-semibold">Duration</p>
                <p className="text-lg font-bold text-gray-800">
                  {Math.floor(trip.duration_minutes / 60)}h {trip.duration_minutes % 60}m
                </p>
                <div className="flex items-center justify-center mt-2">
                  <div className="w-8 h-0.5 bg-blue-600"></div>
                  <span className="text-blue-600 mx-2">✈️</span>
                  <div className="w-8 h-0.5 bg-blue-600"></div>
                </div>
              </div>

              {/* Arrival */}
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Arrival</p>
                <p className="text-2xl font-bold text-gray-800">{trip.arrival_time}</p>
                <p className="text-sm font-semibold text-blue-600">{trip.destination_code}</p>
                <p className="text-xs text-gray-600">{trip.destination_city}</p>
              </div>

              {/* Airline */}
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Airline</p>
                <p className="text-lg font-bold text-gray-800">{trip.airline_name}</p>
                <p className="text-xs text-gray-600">{trip.aircraft_type}</p>
              </div>

              {/* Price & Action */}
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-semibold">Price from</p>
                <p className="text-2xl font-bold text-green-600">KES {trip.price_per_seat.toLocaleString()}</p>
                <p className="text-xs text-gray-600 mb-3">{trip.available_seats} seats available</p>
                <Link
                  href={`/booking/${trip.id}`}
                  className="btn-primary w-full text-center"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
