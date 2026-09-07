# RailGo — Smart Railway Booking Platform

A modern, premium railway ticket booking and live train tracking web application built with React, TypeScript, Tailwind CSS, and Node.js/Express.

## Features

- **Smart Train Search** - Search trains between stations with real-time availability
- **Live Train Tracking** - GPS-based real-time tracking with interactive route maps
- **Multi-step Booking** - Passenger details, seat selection, and secure payment
- **PNR Status** - Check booking status with passenger-wise details
- **My Trips Dashboard** - Manage upcoming, past, and cancelled bookings
- **User Profile** - Saved passengers, payment methods, preferences
- **Offers & Discounts** - Promotional deals and loyalty rewards
- **Dark/Light Mode** - Beautiful theming with persistence
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Framer Motion for animations
- React Router v6 for navigation
- React Hook Form + Zod for forms
- Zustand for state management
- Lucide React for icons
- React Hot Toast for notifications

### Backend
- Node.js + Express
- JWT Authentication
- bcryptjs for password hashing
- Zod for validation
- Helmet, CORS, Morgan for security/logging

## Project Structure

```
railgo/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/           # Basic components (Button, Input, Card, etc.)
│   │   │   ├── layout/       # Layout components (Navbar, Footer)
│   │   │   └── ...
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── context/          # React context providers
│   │   ├── store/            # Zustand stores
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utility functions & mock data
│   │   ├── App.tsx           # Main app with routing
│   │   └── main.tsx          # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── backend/                  # Express backend
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   ├── config/           # Configuration
│   │   └── index.js          # Entry point
│   ├── package.json
│   └── .env
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:3000

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on http://localhost:4000

## Key Pages

1. **Home** (`/`) - Hero with search, popular routes, features
2. **Search** (`/search`) - Train results with filters and sorting
3. **Train Details** (`/train/:number`) - Complete timetable, route, amenities
4. **Booking** (`/booking/:number`) - 4-step booking flow
5. **Payment** (`/payment/:id`) - Multiple payment methods
6. **Confirmation** (`/confirmation/:id`) - Booking success with e-ticket
7. **Live Tracking** (`/tracking`) - Real-time GPS tracking with map
8. **PNR Status** (`/pnr`) - PNR enquiry with passenger details
9. **My Trips** (`/trips`) - Dashboard with all bookings
10. **Profile** (`/profile`) - Account, passengers, payments, settings
11. **Offers** (`/offers`) - Discounts and promotional deals
12. **Login/Register** - Authentication pages

## Mock Data

The application includes realistic Indian railway mock data:
- 20+ major stations (LKO, NDLS, CNB, BCT, HWH, etc.)
- 5 trains with full routes, classes, and coach compositions
- Live tracking simulation for demo purposes
- Booking and PNR test data

## API Endpoints

### Trains
- `GET /api/trains/search` - Search trains
- `GET /api/trains/stations` - List stations
- `GET /api/trains/:number` - Train details
- `GET /api/trains/:number/availability` - Seat availability

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - User bookings
- `GET /api/bookings/:id` - Booking details
- `POST /api/bookings/:id/cancel` - Cancel booking

### Tracking
- `GET /api/tracking/:number/live` - Live train status
- `GET /api/tracking/live/all` - All live trains

### PNR
- `POST /api/pnr/check` - Check PNR status

### Users
- `GET /api/users/profile` - User profile
- `PUT /api/users/profile` - Update profile
- `GET/POST/PUT/DELETE /api/users/passengers` - Saved passengers
- `GET/POST/PUT/DELETE /api/users/payments` - Saved payments

## Live Tracking (Demo)

The live tracking feature uses simulated GPS data for demonstration. In production, connect to real railway APIs:

```javascript
// Backend abstraction ready for real API
GET /api/tracking/:trainNumber/live
// Returns: current station, coordinates, speed, delay, next station, ETA
```

## Design System

- **Colors**: Navy, Primary Blue, Cyan, Amber accents
- **Typography**: Inter font family
- **Components**: Glassmorphism, rounded cards, smooth shadows
- **Animations**: Framer Motion transitions, micro-interactions
- **Icons**: Lucide React consistent icon set

## Security

- Input validation with Zod
- JWT authentication with HttpOnly cookies ready
- Password hashing with bcrypt
- Rate limiting (100 req/15min)
- Helmet security headers
- CORS configuration
- No hardcoded secrets

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render/AWS)
```bash
npm start
# Set environment variables
```

## License

MIT License - Feel free to use for learning or commercial projects.

---

Built with ❤️ for Indian Railways travelers. Demo live data for demonstration purposes only.