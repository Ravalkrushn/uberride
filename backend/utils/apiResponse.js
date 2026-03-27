/**
 * Standard API Response Utility
 * Provides consistent response format across all endpoints
 */
class ApiResponse {
  /**
   * Create API response object
   * @param {number} statusCode - HTTP status code
   * @param {*} data - Response data
   * @param {string} message - Response message
   * @param {boolean} success - Success flag
   */
  constructor(statusCode, data, message = 'Success', success = true) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = success;
    this.timestamp = new Date().toISOString();
  }
}

module.exports = ApiResponse;
