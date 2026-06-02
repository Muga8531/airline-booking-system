# System Architecture & Design

## High-Level Overview

The system is built with a modern microservices-inspired architecture:

```
Frontend (Next.js)
    ↓
Backend API (Node.js/Express)
    ↓
Database (PostgreSQL)
    ↓
External Services (PayPal, Gmail)
```

## Data Flow - Complete Booking Process

### 1. User Searches Flights
- User enters origin, destination, date
- Frontend calls `/api/trips/search`
- Backend queries database for available trips
- Database returns trips with seat availability
- Frontend displays results

### 2. User Selects Seats
- User clicks seats on visual map
- Frontend calls `/api/bookings/seat-locks`
- Backend locks seats for 15 minutes
- Returns lock token to frontend
- Database stores seat locks with expiry time

### 3. User Enters Passenger Details
- User fills passenger information form
- Frontend stores data temporarily
- Ready for booking creation

### 4. Create Booking
- Frontend sends: lock token + passenger data
- Backend validates lock token
- Generates unique PNR (e.g., ABC123)
- Creates booking record with status "pending"
- Stores passenger details
- Returns booking ID to frontend

### 5. Initiate PayPal Payment
- Frontend calls `/api/bookings/:id/payment`
- Backend calls PayPal API to create order
- Stores order ID in payments table
- Returns PayPal checkout link
- Frontend redirects user to PayPal

### 6. Complete Payment
- User authorizes payment on PayPal
- PayPal processes transaction
- Redirects back to application
- Frontend shows success message

### 7. Webhook Confirmation
- PayPal sends webhook to `/api/webhooks/paypal`
- Backend receives `CHECKOUT.ORDER.COMPLETED` event
- Updates payment status to "completed"
- Updates booking status to "confirmed"
- Marks seats as "booked"
- Releases temporary locks

### 8. Send Confirmations
- Backend sends booking confirmation email
- Includes: PNR, passenger names, flight details
- Sends payment receipt email
- Email address from Gmail SMTP

### 9. Booking Complete
- User receives confirmation emails
- Can view booking in "My Bookings"
- Ready for check-in at airport

## Database Schema

```sql
users
  id, email, password (hashed), name, phone, created_at

airlines
  id, name, code, logo_url

routes
  id, airline_id, origin_code, destination_code, distance, duration

trips
  id, route_id, trip_date, departure_time, arrival_time, 
  total_seats, available_seats, price_per_seat, status

seats
  id, trip_id, seat_number, seat_class, status, passenger_id

seat_locks
  id, trip_id, seat_id, user_id, lock_token, expires_at, is_active

bookings
  id, booking_reference (PNR), user_id, trip_id, status, 
  total_price, number_of_passengers, created_at

booking_passengers
  id, booking_id, seat_id, passenger_name, email, phone, id_document

payments
  id, booking_id, paypal_order_id, transaction_id, amount,
  payment_status, webhook_verified, created_at
```

## Security Layers

1. **HTTPS/TLS** - Encrypted transport
2. **CORS** - Control cross-origin requests
3. **Rate Limiting** - 100 req/15 min per IP
4. **JWT Authentication** - Secure token-based auth
5. **Input Validation** - Joi schemas
6. **Parameterized Queries** - SQL injection prevention
7. **Password Hashing** - bcrypt with 10 rounds
8. **PayPal Webhook Verification** - Signature validation

## Seat Locking Mechanism

### Problem Being Solved
Prevent double-booking when multiple users select same seat simultaneously

### Solution
1. When user selects seats, lock them for 15 minutes
2. Lock stored in `seat_locks` table with expiry time
3. Check for active locks before creating booking
4. Background job cleans up expired locks every minute
5. Database constraint prevents duplicate bookings

### Lock Flow
```
User selects seat
    ↓
POST /api/bookings/seat-locks
    ↓
Backend checks if seat already locked
    ├─ If yes: Return error "Seat already locked"
    └─ If no: Create lock with token + expiry
    ↓
Database: INSERT into seat_locks
    ↓
Return lock_token to frontend
    ↓
User proceeds to payment
    ↓
On booking creation: Validate lock_token
    ├─ If valid: Create booking
    └─ If expired: Ask user to reselect seats
    ↓
On payment confirmation: Release lock
```

## Payment Processing Flow

```
User clicks "Pay with PayPal"
    ↓
Frontend: POST /api/bookings/:id/payment
    ↓
Backend: Call PayPal API
    ├─ Create order with booking reference
    ├─ Set amount and currency
    └─ Return approval URL
    ↓
Database: INSERT into payments (status: pending)
    ↓
Frontend: Redirect to PayPal checkout
    ↓
User: Authorize payment on PayPal
    ↓
PayPal: Process transaction
    ├─ Deduct funds
    └─ Generate transaction ID
    ↓
PayPal: Send POST to webhook endpoint
    ├─ Event: CHECKOUT.ORDER.COMPLETED
    └─ Include order ID & transaction ID
    ↓
Backend: Receive webhook
    ├─ Verify event authenticity
    ├─ Find payment by order ID
    ├─ Update payment status: completed
    ├─ Update booking status: confirmed
    └─ Mark seats: booked
    ↓
Backend: Send emails
    ├─ Booking confirmation
    └─ Payment receipt
    ↓
Frontend: Redirect to success page
    ↓
User: Receives confirmation emails with PNR
```

## Deployment Architecture

```
Vercel (Frontend)
    ↓ HTTPS
Render (Backend)
    ↓ SQL
PostgreSQL (Database)
    ↓ API calls
PayPal API
Gmail SMTP
```

### Scalability Considerations

**Current capacity:**
- 1000 concurrent users
- Millions of bookings in database
- Sub-second search response
- Real-time seat availability

**For higher scale:**
- Add Redis caching for searches
- Use message queue for emails
- Database read replicas
- CDN for static assets
- Load balancer for multiple backends

## Error Handling

1. **Database errors** - Logged, generic response to user
2. **PayPal errors** - Retry logic, notify user
3. **Email errors** - Logged but don't block booking
4. **Validation errors** - Clear error messages to user
5. **Authentication errors** - 401 Unauthorized
6. **Authorization errors** - 403 Forbidden

## Monitoring & Maintenance

**Key metrics to monitor:**
- API response times
- Database query performance
- PayPal webhook latency
- Email delivery rate
- Seat lock effectiveness
- Booking success rate

**Automated tasks:**
- Cleanup expired seat locks (every minute)
- Database backups (daily)
- Email retry (on failure)
- PayPal webhook retry (up to 20 times)

## Testing Strategy

**Backend tests:**
- Unit tests for models
- Integration tests for APIs
- Payment flow tests with PayPal sandbox
- Seat locking tests

**Frontend tests:**
- Component tests
- User flow tests
- Payment integration tests
- Responsive design tests

**Manual tests:**
- End-to-end booking flow
- Payment with test credit cards
- Email confirmation receipt
- Error scenarios handling
