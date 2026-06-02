# 🚀 Setup & Deployment Guide

## Quick Start with Docker (Recommended)

### Prerequisites
- Docker & Docker Compose installed
- PayPal Developer Account
- Gmail account for SMTP

### Step 1: Clone & Configure

```bash
git clone https://github.com/Muga8531/airline-booking-system.git
cd airline-booking-system

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

### Step 2: Update Environment Variables

**backend/.env:**
```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_actual_client_id
PAYPAL_CLIENT_SECRET=your_actual_secret
PAYPAL_MODE=sandbox

# Email (Gmail)
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

**frontend/.env.local:**
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_actual_client_id
```

### Step 3: Run with Docker

```bash
docker-compose up --build
```

This will:
- Create PostgreSQL database
- Run database migrations with sample data
- Start backend on http://localhost:5000
- Start frontend on http://localhost:3000

### Step 4: Access the System

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health**: http://localhost:5000/health

---

## Local Setup (Without Docker)

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update database credentials in .env
# DATABASE_HOST=localhost (not postgres)

# Run database migrations
npm run migrate

# Start backend
npm run dev
```

Backend runs on: http://localhost:5000

### Frontend Setup

```bash
cd frontend
npm install

cp .env.local.example .env.local

npm run dev
```

Frontend runs on: http://localhost:3000

### Database Setup (PostgreSQL)

```bash
# Install PostgreSQL if not already installed
# macOS:
brew install postgresql

# Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL
postgres -D /usr/local/var/postgres

# Create database and run migrations
psql -U postgres
```

```sql
CREATE DATABASE airline_booking;
\c airline_booking
\i database/schema.sql
\i database/seed.sql
```

---

## Deployment to Production

### Option 1: Render.com (Recommended)

**Backend Deployment:**

1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect GitHub repository
5. Set environment variables:
   ```
   DATABASE_URL=postgresql://user:pass@host/db
   JWT_SECRET=your_prod_secret
   PAYPAL_CLIENT_ID=prod_id
   PAYPAL_CLIENT_SECRET=prod_secret
   PAYPAL_MODE=live
   FRONTEND_URL=https://yourdomain.com
   ```
6. Deploy

**Frontend Deployment:**

1. Go to Vercel (recommended for Next.js)
2. Import repository
3. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=prod_id
   ```
4. Deploy

**Database:**
- Use Render PostgreSQL or AWS RDS
- Update `DATABASE_URL` in backend env vars

---

### Option 2: Heroku (Legacy)

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create backend app
heroku create airline-booking-api
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set PAYPAL_CLIENT_ID=your_id
heroku config:set PAYPAL_CLIENT_SECRET=your_secret

# Deploy
git push heroku main
```

---

### Option 3: Self-Hosted (VPS)

**Using Ubuntu 20.04:**

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Clone repository
git clone https://github.com/Muga8531/airline-booking-system.git
cd airline-booking-system

# Setup backend
cd backend
npm install
npm run build

# Setup PM2 for process management
npm install -g pm2
pm2 start dist/src/app.js --name "airline-backend"

# Setup Nginx as reverse proxy
sudo apt-get install -y nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/default
```

**Nginx configuration:**
```nginx
upstream backend {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://frontend:3000;
    }
}
```

---

## Environment Variables Checklist

### Backend

- [ ] `DATABASE_URL` or database credentials
- [ ] `JWT_SECRET` (use a strong key)
- [ ] `PAYPAL_CLIENT_ID`
- [ ] `PAYPAL_CLIENT_SECRET`
- [ ] `PAYPAL_MODE` (sandbox or live)
- [ ] `SMTP_USER` (Gmail address)
- [ ] `SMTP_PASSWORD` (Gmail app password)
- [ ] `MERCHANT_EMAIL` (lawrencemuga895@gmail.com)
- [ ] `FRONTEND_URL` (production URL)
- [ ] `SEAT_LOCK_DURATION` (minutes, default 15)

### Frontend

- [ ] `NEXT_PUBLIC_API_URL` (backend URL)
- [ ] `NEXT_PUBLIC_PAYPAL_CLIENT_ID`

---

## Monitoring & Maintenance

### View Logs

**Docker:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

**Heroku:**
```bash
heroku logs --tail
```

**PM2:**
```bash
pm2 logs
pm2 monit
```

### Database Backups

```bash
# PostgreSQL backup
pg_dump airline_booking > backup.sql

# Restore
psql airline_booking < backup.sql
```

### Performance Monitoring

- Monitor seat lock cleanup job runs
- Track PayPal API response times
- Monitor email delivery status
- Check database query performance

---

## Troubleshooting Deployment

### Backend won't start
```bash
# Check logs
docker-compose logs backend

# Verify database connection
docker-compose exec postgres psql -U postgres -c "\l"
```

### Frontend shows blank page
```bash
# Check browser console for API errors
# Verify NEXT_PUBLIC_API_URL is correct
# Check CORS settings in backend
```

### PayPal integration failing
- Verify credentials in .env
- Ensure webhook URL is publicly accessible
- Check PAYPAL_MODE matches account type
- Review PayPal dashboard for errors

### Email not sending
- Verify Gmail SMTP credentials
- Enable "Less secure app access" or use App Password
- Check SMTP_USER and SMTP_PASSWORD
- Review email service logs

---

## Production Checklist

- [ ] All environment variables set
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] Error monitoring setup (Sentry, etc.)
- [ ] Rate limiting configured
- [ ] CORS properly restricted
- [ ] PayPal webhook verified
- [ ] Email templates tested
- [ ] Database indexes created
- [ ] Performance tested under load
