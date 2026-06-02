'use client';

import { useState } from 'react';

export default function SearchForm({ onSearch }: { onSearch: (params: any) => void }) {
  const [formData, setFormData] = useState({
    origin: 'NBO',
    destination: 'MBA',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.origin || !formData.destination || !formData.date) {
      alert('Please fill in all fields');
      return;
    }
    onSearch(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const maxDate = tomorrow.toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="card mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🔍 Search Flights</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From (Airport Code)</label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            placeholder="e.g., NBO"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength="3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">To (Airport Code)</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="e.g., MBA"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength="3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={formData.date}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full btn-primary font-bold"
          >
            Search Flights
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-4">
        💡 Tip: Try NBO→MBA or NBO→KIS to see available flights
      </p>
    </form>
  );
}
