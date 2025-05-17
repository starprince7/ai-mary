/**
 * A simple logger utility for consistent logging throughout the application
 * In a real-world application, this could be replaced with a more sophisticated logging library
 */

const logLevels = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

/**
 * Formats a log message with timestamp and other details
 * 
 * @param {String} level - Log level
 * @param {String} message - Log message
 * @param {Object} details - Additional details to include in the log
 * @returns {String} Formatted log message
 */
const formatLog = (level, message, details = {}) => {
  const timestamp = new Date().toISOString();
  return {
    timestamp,
    level,
    message,
    ...(Object.keys(details).length > 0 ? { details } : {})
  };
};

/**
 * Logs an error message
 * 
 * @param {String} message - Log message
 * @param {Object} details - Additional details
 */
const error = (message, details = {}) => {
  console.error(JSON.stringify(formatLog(logLevels.ERROR, message, details)));
};

/**
 * Logs a warning message
 * 
 * @param {String} message - Log message
 * @param {Object} details - Additional details
 */
const warn = (message, details = {}) => {
  console.warn(JSON.stringify(formatLog(logLevels.WARN, message, details)));
};

/**
 * Logs an info message
 * 
 * @param {String} message - Log message
 * @param {Object} details - Additional details
 */
const info = (message, details = {}) => {
  console.info(JSON.stringify(formatLog(logLevels.INFO, message, details)));
};

/**
 * Logs a debug message
 * 
 * @param {String} message - Log message
 * @param {Object} details - Additional details
 */
const debug = (message, details = {}) => {
  console.debug(JSON.stringify(formatLog(logLevels.DEBUG, message, details)));
};

module.exports = {
  error,
  warn,
  info,
  debug
}; 