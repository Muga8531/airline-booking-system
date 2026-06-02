# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### Auth Routes

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "0712345678"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "0712345678",
    "created_at": "2024-01-10T10:30:00Z"
  },
  "token": "eyJhbGc..."
}
```

---

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "token": "eyJhbGc...",
  "message": "Login successful"
}
```

---

#### Verify Token
```http
POST /auth/verify
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "0712345678",
    "created_at": "2024-01-10T10:30:00Z"
  }
}
```

---

### Trip Routes

#### Search Trips
```http
GET /trips/search?origin=NBO&destination=MBA&date=2024-01-15
```

**Query Parameters:**
- `origin` (required): Origin airport code (e.g., NBO)
- `destination` (required): Destination airport code (e.g., MBA)
- `date` (required): Travel date (YYYY-MM-DD)

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "trip_date": "2024-01-15",
      "departure_time": "10:00:00",
      "arrival_time": "12:30:00",
      "aircraft_type": "Boeing 737",
      "available_seats": 45,
      "total_seats": 180,
      "price_per_seat": 3500,
      "status": "scheduled",
      "origin_city": "Nairobi",
      "origin_code": "NBO",
      "destination_city": "Mombasa",
      "destination_code": "MBA",
      "duration_minutes": 150,
      "airline_name": "Jambojet",
      "airline_code": "JJ"
    }
  ]
}
```

---

#### Get Trip Details
```http
GET /trips/1
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "route_id": 1,
    "trip_date": "2024-01-15",
    "departure_time": "10:00:00",
    "arrival_time": "12:30:00",
    "aircraft_type": "Boeing 737",
    "total_seats": 180,
    "available_seats": 45,
    "price_per_seat": 3500,
    "status": "scheduled",
    "created_at": "2024-01-10T10:30:00Z",
    "updated_at": "2024-01-10T10:30:00Z",
    "origin_city": "Nairobi",
    "origin_code": "NBO",
    "destination_city": "Mombasa",
    "destination_code": "MBA",
    "distance_km": 480,
    "duration_minutes": 150,
    "airline_name": "Jambojet",
    "airline_code": "JJ",
    "logo_url": "https://example.com/logo.png"
  }
}
```

---

#### Get Seats for Trip
```http
GET /trips/1/seats
```

**Response (200):**
```json
{
  "success": true,
  "total": 180,
  "available": 45,
  "data": [
    {
      "id": 1,
      "seat_number": "A1",
      "seat_class": "economy",
      "status": "available",
      "passenger_id": null
    },
    {
      "id": 2,
      "seat_number": "A2",
      "seat_class": "economy",
      "status": "booked",
      "passenger_id": 5
    }
  ]
}
```

---

### Booking Routes

#### Lock Seats
```http
POST /bookings/seat-locks
Authorization: Bearer <token>
Content-Type: application/json

{
  "tripId": 1,
  "seatIds": [1, 2, 3]
}
```

**Response (200):**
```json
{
  "success": true,
  "lockToken": "550e8400-e29b-41d4-a716-446655440000",
  "expiresAt": "2024-01-15T10:45:00Z",
  "duration_minutes": 15,
  "message": "Seats locked for 15 minutes"
}
```

---

#### Create Booking
```http
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "tripId": 1,
  "lockToken": "550e8400-e29b-41d4-a716-446655440000",
  "totalPrice": 10500,
  "passengers": [
    {
      "seatId": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "0712345678",
      "idDocument": "ID123456"
    },
    {
      "seatId": 2,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "0712345679",
      "idDocument": "ID123457"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "booking": {
    "id": 100,
    "booking_reference": "ABC123",
    "created_at": "2024-01-15T10:25:00Z"
  },
  "message": "Booking created successfully"
}
```

---

#### Initiate Payment
```http
POST /bookings/100/payment
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "orderId": "8DD14235-4A6E-4D21-9B9F-F10DD4D68E2B",
  "links": [
    {
      "rel": "approve",
      "href": "https://www.sandbox.paypal.com/checkoutnow?token=EC-...",
      "method": "GET"
    },
    {
      "rel": "self",
      "href": "https://api.sandbox.paypal.com/v2/checkout/orders/8DD14235-4A6E-4D21-9B9F-F10DD4D68E2B",
      "method": "GET"
    }
  ]
}
```

---

#### Get Booking Details
```http
GET /bookings/100
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 100,
    "booking_reference": "ABC123",
    "user_id": 1,
    "trip_id": 1,
    "status": "pending",
    "total_price": 10500,
    "number_of_passengers": 2,
    "created_at": "2024-01-15T10:25:00Z",
    "trip_date": "2024-01-15",
    "departure_time": "10:00:00",
    "arrival_time": "12:30:00",
    "price_per_seat": 3500,
    "origin_city": "Nairobi",
    "origin_code": "NBO",
    "destination_city": "Mombasa",
    "destination_code": "MBA",
    "airline_name": "Jambojet",
    "passengers": [
      {
        "id": 200,
        "passenger_name": "John Doe",
        "passenger_email": "john@example.com",
        "passenger_phone": "0712345678",
        "seat_number": "A1"
      }
    ],
    "payment": {
      "id": 50,
      "booking_id": 100,
      "paypal_order_id": "8DD14235-4A6E-4D21-9B9F-F10DD4D68E2B",
      "amount": 10500,
      "currency": "KES",
      "payment_method": "paypal",
      "payment_status": "pending",
      "webhook_verified": false
    }
  }
}
```

---

#### Get User's Bookings
```http
GET /bookings
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 100,
      "booking_reference": "ABC123",
      "status": "confirmed",
      "total_price": 10500,
      "number_of_passengers": 2,
      "created_at": "2024-01-15T10:25:00Z",
      "trip_date": "2024-01-15",
      "departure_time": "10:00:00",
      "price_per_seat": 3500,
      "origin_code": "NBO",
      "destination_code": "MBA",
      "origin_city": "Nairobi",
      "destination_city": "Mombasa",
      "airline_name": "Jambojet"
    }
  ]
}
```

---

### Webhook Routes

#### PayPal Webhook
```http
POST /webhooks/paypal
Content-Type: application/json

{
  "event_type": "CHECKOUT.ORDER.COMPLETED",
  "resource": {
    "id": "8DD14235-4A6E-4D21-9B9F-F10DD4D68E2B",
    "status": "COMPLETED",
    "purchase_units": [
      {
        "reference_id": "ABC123",
        "payments": {
          "captures": [
            {
              "id": "TRANSACTION-ID"
            }
          ]
        }
      }
    ]
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "bookingReference": "ABC123"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields: origin, destination, date"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Trip not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to search trips"
}
```

---

## Rate Limiting

- 100 requests per 15 minutes per IP
- Limit applies to all endpoints

---

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "first_name": "Test",
    "last_name": "User"
  }'

# Search trips
curl http://localhost:5000/api/trips/search?origin=NBO&destination=MBA&date=2024-01-15

# Lock seats (requires token)
curl -X POST http://localhost:5000/api/bookings/seat-locks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tripId": 1,
    "seatIds": [1, 2]
  }'
```
