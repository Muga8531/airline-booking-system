'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">✈️ Airline Booking</h3>
            <p className="text-gray-400 text-sm">Your trusted flight booking platform with secure PayPal payments.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/bookings" className="hover:text-white transition">My Bookings</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: lawrencemuga895@gmail.com</li>
              <li>Phone: +254 712 345 678</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Airline Booking System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
