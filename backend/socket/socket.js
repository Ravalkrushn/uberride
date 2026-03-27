const socketIO = require('socket.io');
const Captain = require('../models/captain.model');
const Ride = require('../models/ride.model');

// Store active connections
const captainConnections = new Map(); // Map of captainId -> socket
const userConnections = new Map(); // Map of userId -> socket
const activeRides = new Map(); // Map of rideId -> {raid, captain, rider}

/**
 * Initialize Socket.io
 * @param {object} server - HTTP server instance
 * @returns {object} Socket.io instance
 */
const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }
  });

  // Middleware to verify socket connection
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const userId = socket.handshake.auth.userId;
    const userType = socket.handshake.auth.userType; // 'rider' or 'captain'

    if (!token || !userId || !userType) {
      return next(new Error('Authentication failed'));
    }

    socket.userId = userId;
    socket.userType = userType;
    next();
  });

  // Connection event
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId} (${socket.userType})`);

    // Register connection
    if (socket.userType === 'captain') {
      captainConnections.set(socket.userId, socket);
    } else {
      userConnections.set(socket.userId, socket);
    }

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      if (socket.userType === 'captain') {
        captainConnections.delete(socket.userId);
      } else {
        userConnections.delete(socket.userId);
      }
    });

    // Captain events
    if (socket.userType === 'captain') {
      /**
       * Captain updates their location (emitted every 5 seconds)
       */
      socket.on('captain:updateLocation', async (data) => {
        try {
          const { latitude, longitude, captainId } = data;

          if (!latitude || !longitude || !captainId) {
            return socket.emit('error', { message: 'Invalid location data' });
          }

          // Update captain's location in database
          await Captain.findByIdAndUpdate(captainId, {
            currentLocation: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            lastLocationUpdate: new Date()
          });

          // Broadcast location to all riders (for live tracking)
          io.emit('captain:locationUpdated', {
            captainId,
            latitude,
            longitude,
            timestamp: new Date()
          });

          socket.emit('captain:locationUpdateSuccess', { success: true });
        } catch (error) {
          console.error('Location update error:', error);
          socket.emit('error', { message: 'Failed to update location' });
        }
      });

      /**
       * Captain accepts a ride request
       */
      socket.on('captain:acceptRide', async (data) => {
        try {
          const { rideId, captainId } = data;
          const ride = await Ride.findById(rideId).populate('rider');

          if (!ride) {
            return socket.emit('error', { message: 'Ride not found' });
          }

          // Update ride status
          ride.status = 'accepted';
          ride.captain = captainId;
          await ride.save();

          // Notify rider
          const riderSocket = userConnections.get(ride.rider._id.toString());
          if (riderSocket) {
            riderSocket.emit('ride:accepted', {
              rideId,
              captain: {
                name: ride.captain.name,
                phone: ride.captain.phone,
                vehicle: ride.captain.vehicleDetails
              }
            });
          }

          // Confirm to captain
          socket.emit('ride:acceptedSuccess', { rideId });

          // Track active ride
          activeRides.set(rideId, { rideId, captainId, riderId: ride.rider._id });
        } catch (error) {
          console.error('Ride accept error:', error);
          socket.emit('error', { message: 'Failed to accept ride' });
        }
      });

      /**
       * Captain reaches pickup location
       */
      socket.on('captain:reachedPickup', async (data) => {
        try {
          const { rideId } = data;
          const ride = await Ride.findByIdAndUpdate(
            rideId,
            { status: 'started' },
            { new: true }
          ).populate('rider');

          const riderSocket = userConnections.get(ride.rider._id.toString());
          if (riderSocket) {
            riderSocket.emit('captain:reachedPickup', {
              rideId,
              otp: ride.otp.code
            });
          }

          socket.emit('pickup:reached', { rideId });
        } catch (error) {
          console.error('Reached pickup error:', error);
          socket.emit('error', { message: 'Failed to update pickup status' });
        }
      });

      /**
       * Captain starts the ride
       */
      socket.on('captain:startRide', async (data) => {
        try {
          const { rideId, otpVerified } = data;

          if (!otpVerified) {
            return socket.emit('error', { message: 'OTP verification required' });
          }

          const ride = await Ride.findByIdAndUpdate(
            rideId,
            {
              status: 'started',
              startTime: new Date(),
              'otp.verified': true
            },
            { new: true }
          ).populate('rider');

          const riderSocket = userConnections.get(ride.rider._id.toString());
          if (riderSocket) {
            riderSocket.emit('ride:started', { rideId });
          }

          socket.emit('ride:startedSuccess', { rideId });
        } catch (error) {
          console.error('Start ride error:', error);
          socket.emit('error', { message: 'Failed to start ride' });
        }
      });

      /**
       * Captain shares live location during ride
       */
      socket.on('captain:shareLiveLocation', async (data) => {
        try {
          const { rideId, latitude, longitude, captainId } = data;
          const ride = await Ride.findById(rideId).populate('rider');

          if (!ride) return;

          const riderSocket = userConnections.get(ride.rider._id.toString());
          if (riderSocket) {
            riderSocket.emit('captain:liveLocation', {
              captainId,
              latitude,
              longitude,
              timestamp: new Date()
            });
          }
        } catch (error) {
          console.error('Live location error:', error);
        }
      });

      /**
       * Captain completes the ride
       */
      socket.on('captain:endRide', async (data) => {
        try {
          const { rideId } = data;
          const ride = await Ride.findByIdAndUpdate(
            rideId,
            {
              status: 'completed',
              endTime: new Date()
            },
            { new: true }
          ).populate('rider');

          const riderSocket = userConnections.get(ride.rider._id.toString());
          if (riderSocket) {
            riderSocket.emit('ride:completed', {
              rideId,
              fare: ride.fare,
              distance: ride.distance
            });
          }

          socket.emit('ride:completedSuccess', { rideId });
          activeRides.delete(rideId);
        } catch (error) {
          console.error('End ride error:', error);
          socket.emit('error', { message: 'Failed to end ride' });
        }
      });

      /**
       * Captain cancels ride
       */
      socket.on('captain:cancelRide', async (data) => {
        try {
          const { rideId, reason } = data;
          const ride = await Ride.findByIdAndUpdate(
            rideId,
            {
              status: 'cancelled',
              cancelReason: reason,
              cancelledBy: 'captain'
            },
            { new: true }
          ).populate('rider');

          const riderSocket = userConnections.get(ride.rider._id.toString());
          if (riderSocket) {
            riderSocket.emit('ride:captainCancelled', {
              rideId,
              reason
            });
          }

          socket.emit('ride:cancelledSuccess', { rideId });
          activeRides.delete(rideId);
        } catch (error) {
          console.error('Cancel ride error:', error);
          socket.emit('error', { message: 'Failed to cancel ride' });
        }
      });
    }

    // User/Rider events
    if (socket.userType === 'rider') {
      /**
       * Broadcast ride request to nearby captains
       */
      socket.on('ride:request', async (data) => {
        try {
          const {
            rideId,
            pickupLat,
            pickupLng,
            dropoffLat,
            dropoffLng,
            vehicleType,
            fare
          } = data;

          // Emit to all connected captains
          io.emit('ride:newRequest', {
            rideId,
            pickupLat,
            pickupLng,
            dropoffLat,
            dropoffLng,
            vehicleType,
            fare,
            timestamp: new Date()
          });

          socket.emit('ride:requestBroadcasted', { rideId });
        } catch (error) {
          console.error('Ride request error:', error);
          socket.emit('error', { message: 'Failed to broadcast ride' });
        }
      });

      /**
       * Rider cancels ride
       */
      socket.on('ride:cancelByRider', async (data) => {
        try {
          const { rideId, reason } = data;
          const ride = await Ride.findByIdAndUpdate(
            rideId,
            {
              status: 'cancelled',
              cancelReason: reason,
              cancelledBy: 'rider'
            },
            { new: true }
          );

          if (ride.captain) {
            const captainSocket = captainConnections.get(ride.captain.toString());
            if (captainSocket) {
              captainSocket.emit('ride:cancellByRider', {
                rideId,
                reason
              });
            }
          }

          socket.emit('ride:cancelledSuccess', { rideId });
          activeRides.delete(rideId);
        } catch (error) {
          console.error('Cancel ride error:', error);
          socket.emit('error', { message: 'Failed to cancel ride' });
        }
      });

      /**
       * Verify OTP for ride start
       */
      socket.on('ride:verifyOTP', async (data) => {
        try {
          const { rideId, otp } = data;
          const ride = await Ride.findById(rideId);

          if (!ride) {
            return socket.emit('error', { message: 'Ride not found' });
          }

          if (ride.otp.code === otp) {
            await Ride.findByIdAndUpdate(rideId, { 'otp.verified': true });
            socket.emit('otp:verified', { rideId, verified: true });

            const captainSocket = captainConnections.get(ride.captain.toString());
            if (captainSocket) {
              captainSocket.emit('otp:verifiedByRider', { rideId });
            }
          } else {
            socket.emit('error', { message: 'Invalid OTP' });
          }
        } catch (error) {
          console.error('OTP verification error:', error);
          socket.emit('error', { message: 'OTP verification failed' });
        }
      });
    }

    // Common errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
};

module.exports = { initializeSocket, captainConnections, userConnections };
