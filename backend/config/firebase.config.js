const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

/**
 * Initialize Firebase Admin SDK
 */
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length > 0) {
      console.log('Firebase Admin SDK already initialized');
      return admin;
    }

    // Get service account key from environment file or direct path
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
      ? path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
      : path.resolve(__dirname, '../config/firebase-service-account.json');

    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(`Firebase service account file not found at ${serviceAccountPath}`);
    }

    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });

    console.log('Firebase Admin SDK initialized successfully');
    return admin;
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
    throw new Error(`Failed to initialize Firebase: ${error.message}`);
  }
};

/**
 * Get Firestore database instance
 */
const getFirestore = () => {
  try {
    return admin.firestore();
  } catch (error) {
    console.error('Error getting Firestore:', error);
    throw new Error('Firestore not available');
  }
};

/**
 * Get Firebase Messaging instance for push notifications
 */
const getMessaging = () => {
  try {
    return admin.messaging();
  } catch (error) {
    console.error('Error getting Messaging:', error);
    throw new Error('Firebase Messaging not available');
  }
};

/**
 * Get Firebase Storage bucket
 */
const getStorage = () => {
  try {
    return admin.storage().bucket();
  } catch (error) {
    console.error('Error getting Storage:', error);
    throw new Error('Firebase Storage not available');
  }
};

module.exports = {
  initializeFirebase,
  getFirestore,
  getMessaging,
  getStorage,
  admin
};
