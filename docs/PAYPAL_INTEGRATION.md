# PayPal Integration Guide

## Setup PayPal Developer Account

### Step 1: Create Developer Account
1. Go to https://developer.paypal.com
2. Sign up or login
3. Go to Dashboard
4. Navigate to Apps & Credentials

### Step 2: Create Merchant Account
1. Click on "Create App"
2. Select "Merchant" app type
3. Name: "Airline Booking System"
4. Accept PayPal User Agreement
5. Click "Create App"

### Step 3: Get Credentials
1. Go to Apps & Credentials tab
2. Select **Sandbox** mode (for testing)
3. Find your app in the list
4. Copy:
   - **Client ID** - for frontend
   - **Secret** - for backend

### Step 4: Set Webhook URL
1. In your app settings, go to Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/paypal`
3. Subscribe to events:
   - `payment.capture.completed`
   - `checkout.order.completed`

## Merchant Account Configuration

**Merchant Email:** lawrencemuga895@gmail.com

### Update .env files:

**backend/.env:**
```env
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_secret
PAYPAL_MODE=sandbox  # Change to 'live' for production
```

**frontend/.env.local:**
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id
```

## Testing Payment Flow

### Test Buyer Account (Sandbox)
1. Go to Accounts in PayPal Developer Dashboard
2. Create a Buyer account
3. Use these credentials to test payments

### Test Credit Card Numbers
- **Visa:** 4532015112830366 (CVV: 123, Exp: 12/2025)
- **Mastercard:** 5425233010103442 (CVV: 222, Exp: 12/2025)

### Complete Order Flow
1. Search and select flight
2. Lock seats for 15 minutes
3. Enter passenger details
4. Click "Pay with PayPal"
5. Redirect to PayPal sandbox
6. Complete payment
7. Webhook confirms order
8. Email confirmation sent
9. PNR generated

## Webhook Verification

### Webhook Events

```json
{
  "event_type": "CHECKOUT.ORDER.COMPLETED",
  "resource": {
    "id": "order_id",
    "status": "COMPLETED",
    "purchase_units": [
      {
        "reference_id": "booking_reference",
        "payments": {
          "captures": [
            {
              "id": "transaction_id"
            }
          ]
        }
      }
    ]
  }
}
```

### Webhook Handler
Endpoint: `POST /api/webhooks/paypal`

Actions:
1. Find payment by order ID
2. Update payment status to 'completed'
3. Update booking status to 'confirmed'
4. Mark seats as booked
5. Generate PNR
6. Send confirmation emails

## Production Checklist

- [ ] Switch to Live mode in PayPal
- [ ] Update `PAYPAL_MODE=live`
- [ ] Use production Client ID and Secret
- [ ] Update webhook URL to production domain
- [ ] Test payment with real credentials
- [ ] Configure email notifications
- [ ] Set up monitoring and logging
- [ ] Enable webhook signature verification

## Troubleshooting

### Order Not Capturing
- Check webhook logs in PayPal Dashboard
- Verify webhook URL is publicly accessible
- Check backend logs for errors

### Payment Status Stuck on 'pending'
- Check if webhook was received
- Verify webhook signature
- Manually trigger webhook retry

### Email Not Sending
- Verify SMTP credentials
- Check email service logs
- Ensure merchant email is correct

## Support

PayPal Developer Support: https://developer.paypal.com/support
