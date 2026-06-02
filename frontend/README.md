# ✈️ Airline Booking System - Frontend

Next.js 14 + React 18 + Tailwind CSS frontend application.

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend runs on: http://localhost:3000

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` - PayPal Client ID

## Features

- Flight search and filtering
- User authentication (login/register)
- Seat selection with visual map
- Booking creation
- PayPal payment integration
- Booking history

## Project Structure

- `src/app/` - Pages and layout
- `src/components/` - Reusable components
- `src/lib/` - Utility functions
