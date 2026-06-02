'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import SearchForm from '@/components/SearchForm';
import TripResults from '@/components/TripResults';

export default function Home() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState<any>(null);

  const handleSearch = async (params: any) => {
    setLoading(true);
    setError('');
    setSearchParams(params);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/trips/search?origin=${params.origin}&destination=${params.destination}&date=${params.date}`
      );
      const data = await response.json();
      if (data.success) {
        setTrips(data.data);
      } else {
        setError('Failed to search flights');
      }
    } catch (err) {
      setError('Error searching flights. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container-custom py-8">
          <SearchForm onSearch={handleSearch} />
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Searching flights...</p>
            </div>
          )}
          
          {trips.length > 0 && !loading && (
            <TripResults trips={trips} searchParams={searchParams} />
          )}
          
          {trips.length === 0 && !loading && searchParams && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No flights found for your search. Try different dates or routes.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
