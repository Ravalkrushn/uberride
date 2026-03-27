const mongoose = require('mongoose');

/**
 * Captain Schema - Represents ride drivers/captains in the system
 * Includes license verification, vehicle details, and real-time location tracking
 */
const captainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Captain name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      match: [/^[0-9]{10}$/, 'Phone must be 10 digits']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    profilePhoto: {
      type: String,
      default: null
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true
    },
    vehicleDetails: {
      model: {
        type: String,
        required: [true, 'Vehicle model is required']
      },
      color: {
        type: String,
        required: [true, 'Vehicle color is required']
      },
      plate: {
        type: String,
        required: [true, 'License plate is required'],
        unique: true
      },
      type: {
        type: String,
        enum: ['economy', 'premium', 'xl'],
        default: 'economy'
      }
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
      }
    },
    rating: {
      average: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
      },
      count: {
        type: Number,
        default: 0
      }
    },
    totalRides: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'suspended', 'rejected'],
      default: 'pending'
    },
    documents: {
      license: {
        url: String,
        verified: {
          type: Boolean,
          default: false
        }
      },
      rc: {
        url: String,
        verified: {
          type: Boolean,
          default: false
        }
      },
      insurance: {
        url: String,
        verified: {
          type: Boolean,
          default: false
        }
      }
    },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    bankVerified: {
      type: Boolean,
      default: false
    },
    lastLocationUpdate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Create geospatial index for location-based queries
captainSchema.index({ currentLocation: '2dsphere' });
captainSchema.index({ email: 1, phone: 1 });
captainSchema.index({ status: 1, isOnline: 1 });

module.exports = mongoose.model('Captain', captainSchema);
