const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Send OTP via SMS using Twilio
 * @param {string} phoneNumber - Recipient phone number with country code (e.g., +91XXXXXXXXXX)
 * @param {string} otp - OTP code to send
 * @returns {Promise<object>} Twilio message response
 */
const sendOTPSMS = async (phoneNumber, otp) => {
  try {
    // Validate phone number format
    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      throw new Error('Phone number must include country code (e.g., +91XXXXXXXXXX)');
    }

    const message = await client.messages.create({
      body: `Your Uberride OTP is: ${otp}. Valid for 10 minutes. Do not share with anyone.`,
      from: twilioPhoneNumber,
      to: phoneNumber
    });

    return {
      success: true,
      messageId: message.sid,
      message: 'OTP sent successfully'
    };
  } catch (error) {
    console.error('Twilio SMS Error:', error);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

/**
 * Send verification code via SMS
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} code - Verification code
 * @param {string} type - Type of verification (otp, password_reset, etc.)
 * @returns {Promise<object>} Twilio message response
 */
const sendVerificationSMS = async (phoneNumber, code, type = 'verification') => {
  try {
    let message;

    switch (type) {
      case 'password_reset':
        message = `Your password reset code is: ${code}. Valid for 15 minutes.`;
        break;
      case 'email_verification':
        message = `Your email verification code is: ${code}. Valid for 24 hours.`;
        break;
      default:
        message = `Your verification code is: ${code}`;
    }

    const response = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phoneNumber
    });

    return {
      success: true,
      messageId: response.sid
    };
  } catch (error) {
    console.error('Twilio SMS Error:', error);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

/**
 * Send alert/notification SMS
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} message - Message to send
 * @returns {Promise<object>} Twilio message response
 */
const sendAlertSMS = async (phoneNumber, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phoneNumber
    });

    return {
      success: true,
      messageId: response.sid
    };
  } catch (error) {
    console.error('Twilio SMS Error:', error);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

module.exports = {
  sendOTPSMS,
  sendVerificationSMS,
  sendAlertSMS
};
