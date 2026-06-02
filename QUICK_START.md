# 🚀 Quick Start Guide - Airline Booking System

## 5-Minute Setup

### Option 1: Docker Setup (Easiest)

```bash
# 1. Clone repository
git clone https://github.com/Muga8531/airline-booking-system.git
cd airline-booking-system

# 2. Setup environment
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# 3. Update credentials in .env files
# Get these from:
# - PayPal: https://developer.paypal.com
# - Gmail: https://myaccount.google.com/apppasswords

# 4. Start everything
docker-compose up --build
```

**Wait 2-3 minutes for startup...**

- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api
- Database: PostgreSQL on localhost:5432

---

## Publish to Production (3 Steps)

### Step 1: Deploy Backend

**Using Render.com (Recommended - Free Tier Available)**

```bash
# 1. Go to https://render.com
# 2. Sign up with GitHub
# 3. Click "New" → "Web Service"
# 4. Connect your GitHub repo
# 5. Configure:
```

**Environment Variables:**
```
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=generate_a_strong_random_key
PAYPAL_CLIENT_ID=your_paypal_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
PAYPAL_MODE=live
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
MERCHANT_EMAIL=lawrencemuga895@gmail.com
FRONTEND_URL=https://your-frontend-domain.com
SEAT_LOCK_DURATION=15
```

**Build Command:**
```
cd backend && npm run build
```

**Start Command:**
```
cd backend && npm start
```

✅ Backend deployed! Note your URL: `https://your-backend.onrender.com`

---

### Step 2: Deploy Database

**Using Render PostgreSQL (Easiest)**

Render.com automatically creates a PostgreSQL instance when you deploy. Copy the connection string.

**OR use AWS RDS / DigitalOcean Managed Database**

```bash
# After database is running, run migrations:
psql <DATABASE_URL> < database/schema.sql
psql <DATABASE_URL> < database/seed.sql
```

---

### Step 3: Deploy Frontend

**Using Vercel (Optimal for Next.js)**

```bash
# 1. Go to https://vercel.com
# 2. Sign up with GitHub
# 3. Click "Import Project"
# 4. Select your repository
# 5. Configure Environment Variables:
```

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

```bash
# 6. Click "Deploy"
# 7. Wait ~2 minutes for deployment
```

✅ Frontend deployed! Your domain: `https://your-project.vercel.app`

---

## Setup PayPal for Production

### 1. Get Production Credentials

```
1. Go to https://developer.paypal.com/dashboard
2. Click "Live" tab (not Sandbox)
3. Copy Client ID and Secret
4. Update in backend environment variables
5. Set PAYPAL_MODE=live
```

### 2. Configure Webhook

```
1. Go to Webhooks in PayPal Dashboard
2. Add webhook endpoint:
   https://your-backend.onrender.com/api/webhooks/paypal
3. Subscribe to events:
   - payment.capture.completed
   - checkout.order.completed
```

---

## After Deployment Checklist

- [ ] Backend is running: https://your-backend.onrender.com/health
- [ ] Frontend is accessible: https://your-frontend.vercel.app
- [ ] PayPal payments working
- [ ] Email confirmations received
- [ ] Database has sample data
- [ ] Seats lock correctly
- [ ] Bookings save with PNR

---

**System is now LIVE! 🎉**
