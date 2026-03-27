# Uber Clone - Frontend

Production-ready React frontend for the Uber clone application with real-time location tracking, ride management, and payment integration.

## Technology Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v6
- **Real-time:** Socket.io Client
- **Maps:** Google Maps API (@react-google-maps/api)
- **HTTP Client:** Axios with JWT interceptor
- **Payments:** Razorpay integration ready
- **State Management:** React Context API
- **Charts:** Recharts (Admin analytics)
- **Notifications:** React Hot Toast
- **Icons:** React Icons

## Project Structure

```
src/
├── config/               # Configuration files
│   ├── axios.config.js   # Axios instance with JWT interceptor
│   └── socket.config.js  # Socket.io client configuration
├── contexts/             # React Context files
│   ├── AuthContext.jsx   # Authentication state management
│   ├── SocketContext.jsx # Real-time socket connection
│   ├── RideContext.jsx   # Active ride state management
│   └── LocationContext.jsx # GPS location tracking
├── hooks/                # Custom React hooks
│   ├── useAuth.js        # Auth context wrapper
│   ├── useSocket.js      # Socket context wrapper
│   ├── useLocation.js    # Location context wrapper
│   ├── useRide.js        # Ride context wrapper
│   ├── useGoogleMaps.js  # Google Maps utility
│   └── useFare.js        # Fare calculation utility
├── services/             # API service layer
│   ├── auth.service.js   # Authentication APIs
│   ├── user.service.js   # User profile APIs
│   ├── captain.service.js # Captain profile APIs
│   ├── ride.service.js   # Ride management APIs
│   ├── payment.service.js # Payment processing APIs
│   ├── rating.service.js # Rating/review APIs
│   ├── location.service.js # Location APIs
│   └── maps.service.js   # Google Maps APIs
├── components/           # Reusable components
│   └── common/          # Common UI components
│       ├── Button.jsx    # Button variants
│       ├── InputField.jsx # Form input
│       ├── Modal.jsx     # Modal dialog
│       ├── MapContainer.jsx # Map wrapper
│       └── ... (27 more)
├── pages/                # Page components
│   ├── auth/            # Authentication pages
│   ├── rider/           # Rider app pages
│   ├── captain/         # Captain app pages
│   └── admin/           # Admin dashboard pages
├── router/               # Routing configuration
│   └── AppRouter.jsx    # All routes with protection
├── utils/                # Utility functions
│   ├── storage.js       # LocalStorage wrapper
│   ├── formatCurrency.js # Currency formatting
│   ├── formatTime.js    # Time formatting
│   ├── formatDistance.js # Distance formatting
│   └── rideStatus.js    # Ride status utilities
├── App.jsx              # Main app component
├── App.css              # Global component styles
├── index.css            # Tailwind + base styles
└── main.jsx             # Vite entry point
```

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Required variables:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 3. Start Development Server

```bash
npm run dev
```

Application opens at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm run preview
```

## Key Features

### Authentication

- Phone number based registration & login (OTP verification)
- JWT token management with auto-refresh
- Role-based access control (Rider, Captain, Admin)
- 401 auto-logout redirect to landing page

### Rider Features

- Real-time map with GPS tracking
- Pickup & dropoff selection with address autocomplete
- Vehicle type selection (Economy, Premium, XL)
- Live fare estimation
- Driver tracking en-route
- In-trip OTP verification
- Ride rating & review system
- Wallet management
- Ride history

### Captain Features

- Online/offline toggle with location tracking
- Incoming ride requests (30s countdown)
- Navigation to pickup location
- OTP verification for trip start
- Earnings tracking (daily/weekly/monthly)
- Performance statistics & ratings
- Document upload (License, Registration, Insurance)
- Bank account management

### Admin Dashboard

- User & captain management
- Ride management & monitoring
- Dynamic pricing configuration
- Payout management
- Analytics with charts (revenue, ride trends)
- Performance metrics

## API Integration

All API requests use centralized axios instance with:

- Automatic JWT token attachment to headers
- Request/response interceptors
- 401 response auto-logout handling
- Error handling with toast notifications

### Authentication Flow

```
Login → JWT Token → axios interceptor → auto-attach to all requests
401 Response → logout → localStorage cleared → redirect to /landing
```

### Socket Events (Real-time)

**Rider Events:**

- `ride_accepted` - Driver accepted the ride
- `driver_arrived` - Driver at pickup location
- `trip_started` - Trip OTP verified
- `trip_ended` - Captain completed the trip
- `driver_location_update` - Driver location in real-time

**Captain Events:**

- `new_ride_request` - New ride available (30s timeout)
- `ride_cancelled` - Rider cancelled the ride
- `otp_verified` - Trip start OTP verified
- `payment_received` - Payment credited

**General Events:**

- `connect` - Socket connection established
- `disconnect` - Socket connection lost
- `error` - Socket error occurred

## Development Guidelines

### Component Architecture

- Use React Hooks for functional components
- Custom hooks for business logic (useAuth, useSocket, etc.)
- Context API for global state (no Redux)
- Props drilling minimized via contexts

### Error Handling

- Toast notifications for user feedback
- Error boundaries for critical sections
- Try-catch in async operations
- Graceful fallbacks for maps/API failures

### Styling

- Tailwind CSS utility classes
- Custom colors defined in tailwind.config.js
- Mobile-first responsive design (max-width: 480px focus)
- No component CSS files - all inline/utility

### Code Organization

- One component per file
- Descriptive file names matching component names
- Consistent import order (React → external libs → local)
- Comments for complex logic only

## Authentication

### JWT Token

- Stored in localStorage key: `token`
- Attached via axios interceptor to all `/api/` requests
- Header: `Authorization: Bearer <token>`
- Expires: 7 days (backend)
- Auto-refresh on 401 response

### User Data

- `localStorage.getItem('user')` contains user object
- `localStorage.getItem('userType')` contains role (rider/captain/admin)

## Debugging

Enable debug mode in `.env`:

```env
VITE_ENABLE_DEBUG_MODE=true
```

View socket events in console:

```javascript
// Add to SocketContext or main
window.debugSocket = (on) => {
  if (on) {
    socket.onAny((eventName, ...args) => {
      console.log("Socket Event:", eventName, args);
    });
  }
};
```

## Troubleshooting

### CORS Issues

- Backend CORS enabled for `http://localhost:3000`
- Check `VITE_API_BASE_URL` matches backend URL

### Google Maps Not Loading

- Verify `VITE_GOOGLE_MAPS_API_KEY` is valid
- Check API restrictions in Google Cloud Console
- Maps API must be enabled in project

### Socket Connection Failed

- Ensure backend Socket.io server running on port 5000
- Check `VITE_SOCKET_URL` environment variable
- Verify VPN/Firewall not blocking WebSocket

### 401 Unauthorized

- Token may have expired
- Refresh page to re-authenticate
- Check localStorage has valid token/user data

## Performance Optimization

- Lazy loading routes with React.lazy() (ready for implementation)
- Code splitting enabled in vite.config.js
- Image optimization for profile photos
- Location tracking debounced (5s captain, 10s rider)
- Fare calculation debounced (800ms)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Follow existing code patterns
3. Test on mobile and desktop
4. Commit with descriptive messages

## License

Proprietary - All rights reserved

## Support & Contact

For issues or questions related to this frontend implementation, contact the development team.
