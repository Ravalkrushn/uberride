# Uberride Backend API

Production-grade Uber clone backend built with Node.js, Express, MongoDB, Socket.io, and Razorpay.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Real-time:** Socket.io
- **Authentication:** JWT (7-day expiry)
- **Payments:** Razorpay
- **SMS:** Twilio
- **Maps:** Google Maps API
- **Notifications:** Firebase Cloud Messaging
- **File Upload:** Multer

## 📋 Prerequisites

- Node.js v14+
- MongoDB v4.4+
- npm or yarn
- Git

## 🔧 Installation

1. **Clone the repository**

```bash
git clone https://github.com/Ravalkrushn/uberride.git
cd uberride/backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Start development server**

```bash
npm run dev
```

Server will run on `http://localhost:4000`

## 📦 Installed Packages

```bash
npm install express dotenv cors mongoose bcrypt jsonwebtoken
npm install twilio @google/maps razorpay firebase-admin
npm install multer socket.io uuid
npm install nodemon --save-dev
```

## 📁 Project Structure

```
backend/
├── config/              # Configuration files
│   ├── firebase.config.js
│   ├── maps.config.js
│   └── payment.config.js
├── controllers/         # Request handlers
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── captain.controller.js
│   ├── ride.controller.js
│   ├── payment.controller.js
│   ├── rating.controller.js
│   ├── location.controller.js
│   └── admin.controller.js
├── models/             # MongoDB schemas
│   ├── user.model.js
│   ├── captain.model.js
│   ├── ride.model.js
│   ├── payment.model.js
│   └── rating.model.js
├── routes/             # API endpoints
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── captain.routes.js
│   ├── ride.routes.js
│   ├── payment.routes.js
│   ├── rating.routes.js
│   ├── location.routes.js
│   └── admin.routes.js
├── middlewares/        # Custom middleware
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   ├── upload.middleware.js
│   └── errorHandler.middleware.js
├── services/           # Business logic
│   ├── otp.service.js
│   ├── maps.service.js
│   ├── fare.service.js
│   ├── matching.service.js
│   └── notification.service.js
├── socket/             # Real-time socket.io
│   └── socket.js
├── utils/              # Helper functions
│   ├── apiResponse.js
│   ├── generateToken.js
│   ├── generateOTP.js
│   └── calculateDistance.js
├── uploads/            # File uploads directory
├── db/
│   └── db.js           # MongoDB connection
├── app.js              # Express app configuration
├── server.js           # Server entry point
└── package.json
```

## 🔐 Authentication

All protected routes require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

Tokens expire in 7 days. Use `/refresh-token` endpoint to get a new token.

## 📌 API Endpoints

### Auth Routes (`/api/auth`)

- `POST /register` - Register new rider
- `POST /register-captain` - Register new captain
- `POST /send-otp` - Send OTP via SMS
- `POST /verify-otp` - Verify OTP and auto-login
- `POST /login` - Login with email/password
- `POST /logout` - Logout
- `POST /refresh-token` - Get new JWT token

### User Routes (`/api/user`)

- `GET /profile` - Get user profile
- `PUT /update-profile` - Update profile
- `PUT /change-password` - Change password
- `POST /add-saved-address` - Save address
- `GET /saved-addresses` - Get saved addresses
- `DELETE /account` - Delete account

### Captain Routes (`/api/captain`)

- `GET /profile` - Get captain profile
- `PUT /update-profile` - Update profile
- `PUT /toggle-online` - Toggle online status
- `POST /upload-documents` - Upload license, RC, insurance
- `GET /earnings?period=today|week|month` - Get earnings
- `GET /performance-stats` - Get performance metrics

### Ride Routes (`/api/ride`)

- `POST /request` - Request a ride
- `GET /estimate-fare` - Get fare estimate
- `POST /accept/:rideId` - Captain accepts ride
- `POST /start/:rideId` - Start ride with OTP
- `POST /end/:rideId` - End ride
- `POST /cancel/:rideId` - Cancel ride
- `GET /history` - Ride history
- `GET /active` - Active rides
- `GET /:rideId` - Ride details

### Payment Routes (`/api/payment`)

- `POST /create-order` - Create Razorpay order
- `POST /verify-payment` - Verify payment signature
- `GET /history` - Payment history
- `POST /refund/:paymentId` - Request refund

### Rating Routes (`/api/rating`)

- `POST /rate` - Rate a ride
- `GET /my-ratings` - Get ratings received
- `GET /ride/:rideId` - Get ride ratings

### Location Routes (`/api/location`)

- `POST /update` - Update captain location
- `GET /nearby-captains` - Get nearby available captains
- `GET /availability` - Check captain availability in area

### Admin Routes (`/api/admin`)

- `GET /dashboard-stats` - Dashboard statistics
- `GET /users` - List all users
- `PUT /ban-user/:userId` - Ban user
- `GET /captains` - List all captains
- `PUT /approve-captain/:captainId` - Approve captain
- `PUT /suspend-captain/:captainId` - Suspend captain
- `GET /all-rides` - All rides
- `GET /revenue-report` - Revenue report
- `POST /create-promo` - Create promo code

## 🔌 Socket.io Events

### Captain Events

- `captain:updateLocation` - Update location (every 5s)
- `captain:acceptRide` - Accept ride request
- `captain:reachedPickup` - Notify reached pickup
- `captain:startRide` - Start ride with OTP
- `captain:shareLiveLocation` - Share live location
- `captain:endRide` - Complete ride
- `captain:cancelRide` - Cancel ride

### Rider Events

- `ride:request` - Request a ride (broadcasts to captains)
- `ride:verifyOTP` - Verify OTP for ride start
- `ride:cancelByRider` - Cancel ride

### Broadcast Events

- `captain:locationUpdated` - Captain location updated
- `ride:accepted` - Ride accepted by captain
- `ride:started` - Ride started
- `ride:completed` - Ride completed
- `captain:reachedPickup` - Captain reached pickup
- `captain:liveLocation` - Live captain location

## 💰 Fare Calculation

Fare = (Base + Distance×Rate + Duration×Rate) × SurgeMultiplier + Fees

- **Economy:** ₹25 base, ₹10/km, ₹2/min
- **Premium:** ₹50 base, ₹15/km, ₹3/min
- **XL:** ₹75 base, ₹20/km, ₹4/min
- **Surge:** 1x-3x based on demand
- **Platform Fee:** 15%
- **Tax:** 5%

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT authentication with 7-day expiry
- OTP verification via SMS
- MongoDB 2dsphere geospatial indexing
- CORS enabled
- Request validation
- Global error handling
- File upload validation (PDF, images only)

## 🚦 Geospatial Queries

MongoDB 2dsphere index enables:

- Finding nearby captains within radius
- Location-based matching
- Real-time captain tracking
- Distance calculations

## 📝 Environment Setup

Required environment variables:

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `GOOGLE_MAPS_API_KEY` - Google Maps API key
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET` - Razorpay credentials
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` - Twilio SMS
- `FIREBASE_*` - Firebase credentials

## 🧪 Testing

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Run with nodemon
npx nodemon server.js
```

## 📖 API Response Format

All responses follow standard format:

```json
{
  "success": true,
  "data": {...},
  "message": "Success message",
  "statusCode": 200,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## ⚠️ Error Handling

Global error handler catches:

- Validation errors
- Duplicate key errors (MongoDB)
- JWT errors
- File upload errors
- Custom API errors

## 🤝 Contributing

1. Create feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Author

**Raval Krushn** - Initial work - [GitHub](https://github.com/Ravalkrushn)

## 📧 Support

For support, email support@uberride.com or open an issue on GitHub.

---

**Version:** 1.0.0  
**Last Updated:** March 2025
