const admin = require('firebase-admin');

/**
 * Send push notification to user device
 * @param {string} deviceToken - FCM device token
 * @param {object} notification - Notification data {title, body, ...}
 * @param {object} data - Additional data to send
 * @returns {Promise<string>} Message ID
 */
const sendNotification = async (deviceToken, notification, data = {}) => {
  try {
    if (!deviceToken) {
      throw new Error('Device token is required');
    }

    const message = {
      token: deviceToken,
      notification: {
        title: notification.title || 'Uberride',
        body: notification.body || 'You have a new notification'
      },
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      webpush: {
        headers: {
          TTL: '86400'
        },
        data: {
          ...data,
          timestamp: new Date().toISOString()
        }
      },
      android: {
        ttl: 86400,
        notification: {
          title: notification.title,
          body: notification.body,
          sound: 'default',
          clickAction: notification.clickAction || 'FLUTTER_NOTIFICATION_CLICK'
        },
        data: {
          ...data,
          timestamp: new Date().toISOString()
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
            'content-available': 1
          }
        },
        headers: {
          'apns-priority': '10'
        }
      }
    };

    const messageId = await admin.messaging().send(message);
    return messageId;
  } catch (error) {
    console.error('Firebase notification error:', error);
    throw new Error(`Failed to send notification: ${error.message}`);
  }
};

/**
 * Send notifications to multiple devices
 * @param {array} deviceTokens - Array of FCM device tokens
 * @param {object} notification - Notification data
 * @param {object} data - Additional data
 * @returns {Promise<object>} Response with success/failure counts
 */
const sendNotificationToMultiple = async (deviceTokens, notification, data = {}) => {
  try {
    if (!Array.isArray(deviceTokens) || deviceTokens.length === 0) {
      throw new Error('Device tokens array is required');
    }

    const message = {
      notification: {
        title: notification.title || 'Uberride',
        body: notification.body || 'You have a new notification'
      },
      data: {
        ...data,
        timestamp: new Date().toISOString()
      }
    };

    const response = await admin.messaging().sendMulticast({
      ...message,
      tokens: deviceTokens
    });

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses.map((res) => ({
        success: res.success,
        messageId: res.messageId,
        error: res.error ? res.error.message : null
      }))
    };
  } catch (error) {
    console.error('Firebase multicast error:', error);
    throw new Error(`Failed to send multicast notification: ${error.message}`);
  }
};

/**
 * Send ride request notification to captain
 * @param {string} deviceToken - Captain's device token
 * @param {object} rideData - Ride details
 * @returns {Promise<string>} Message ID
 */
const sendRideRequestNotification = async (deviceToken, rideData) => {
  try {
    const notification = {
      title: 'New Ride Request',
      body: `New ride from ${rideData.pickup.address}`,
      clickAction: 'RIDE_REQUEST'
    };

    const data = {
      type: 'RIDE_REQUEST',
      rideId: rideData._id.toString(),
      pickup: rideData.pickup.address,
      dropoff: rideData.dropoff.address,
      fare: rideData.fare.toString(),
      distance: rideData.distance.toString(),
      pickupLat: rideData.pickup.coordinates.coordinates[1].toString(),
      pickupLng: rideData.pickup.coordinates.coordinates[0].toString()
    };

    return await sendNotification(deviceToken, notification, data);
  } catch (error) {
    console.error('Ride request notification error:', error);
    throw error;
  }
};

/**
 * Send ride accepted notification to rider
 * @param {string} deviceToken - Rider's device token
 * @param {object} captainData - Captain details
 * @returns {Promise<string>} Message ID
 */
const sendRideAcceptedNotification = async (deviceToken, captainData) => {
  try {
    const notification = {
      title: 'Ride Accepted',
      body: `${captainData.name} accepted your ride`,
      clickAction: 'RIDE_ACCEPTED'
    };

    const data = {
      type: 'RIDE_ACCEPTED',
      captainId: captainData._id.toString(),
      captainName: captainData.name,
      captainPhone: captainData.phone,
      vehicleModel: captainData.vehicleDetails.model,
      vehicleColor: captainData.vehicleDetails.color,
      licensePlate: captainData.vehicleDetails.plate,
      captainLat: captainData.currentLocation.coordinates[1].toString(),
      captainLng: captainData.currentLocation.coordinates[0].toString()
    };

    return await sendNotification(deviceToken, notification, data);
  } catch (error) {
    console.error('Ride accepted notification error:', error);
    throw error;
  }
};

/**
 * Send ride started notification
 * @param {string} deviceToken - Device token
 * @param {string} rideId - Ride ID
 * @returns {Promise<string>} Message ID
 */
const sendRideStartedNotification = async (deviceToken, rideId) => {
  try {
    const notification = {
      title: 'Ride Started',
      body: 'Your ride has started',
      clickAction: 'RIDE_STARTED'
    };

    const data = {
      type: 'RIDE_STARTED',
      rideId: rideId.toString()
    };

    return await sendNotification(deviceToken, notification, data);
  } catch (error) {
    console.error('Ride started notification error:', error);
    throw error;
  }
};

/**
 * Send ride completed notification
 * @param {string} deviceToken - Device token
 * @param {object} rideData - Ride details with fare and payment info
 * @returns {Promise<string>} Message ID
 */
const sendRideCompletedNotification = async (deviceToken, rideData) => {
  try {
    const notification = {
      title: 'Ride Completed',
      body: `Fare: ₹${rideData.fare}`,
      clickAction: 'RIDE_COMPLETED'
    };

    const data = {
      type: 'RIDE_COMPLETED',
      rideId: rideData._id.toString(),
      fare: rideData.fare.toString(),
      distance: rideData.distance.toString(),
      duration: rideData.duration.toString()
    };

    return await sendNotification(deviceToken, notification, data);
  } catch (error) {
    console.error('Ride completed notification error:', error);
    throw error;
  }
};

/**
 * Delete device token (when user logs out)
 * @param {string} deviceToken - Device token to delete
 * @returns {Promise<void>}
 */
const unsubscribeDevice = async (deviceToken) => {
  try {
    if (deviceToken) {
      await admin.messaging().unsubscribeFromTopic([deviceToken], 'all_users');
    }
  } catch (error) {
    console.error('Unsubscribe error:', error);
  }
};

module.exports = {
  sendNotification,
  sendNotificationToMultiple,
  sendRideRequestNotification,
  sendRideAcceptedNotification,
  sendRideStartedNotification,
  sendRideCompletedNotification,
  unsubscribeDevice
};
