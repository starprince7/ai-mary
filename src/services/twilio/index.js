/**
 * Generates TwiML response for incoming calls
 * 
 * @param {String} hostname - The hostname for the WebSocket URL
 * @returns {String} TwiML response
 */
const generateTwimlResponse = (hostname) => {
  return `
    <?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Start>
        <Stream url="wss://${hostname}/media-stream" />
      </Start>
      <Say>Hello, I'm your AI assistant. Please start speaking after the beep.</Say>
      <Pause length="1"/>
    </Response>
  `;
};

/**
 * Formats a media message to send back to Twilio
 * 
 * @param {String} streamSid - The stream SID
 * @param {String} content - The content to send
 * @returns {Object} Formatted media message
 */
const formatMediaMessage = (streamSid, content) => {
  return {
    streamSid: streamSid,
    event: 'media',
    media: {
      payload: Buffer.from(content).toString('base64')
    }
  };
};

/**
 * Process a message received from Twilio WebSocket
 * 
 * @param {Object} data - The parsed message data
 * @param {Function} callbacks.onStart - Callback for 'start' event
 * @param {Function} callbacks.onMedia - Callback for 'media' event
 * @param {Function} callbacks.onStop - Callback for 'stop' event
 */
const processMessage = (data, { onStart, onMedia, onStop }) => {
  if (data.event === 'start' && onStart) {
    onStart(data.streamSid, data.start.callSid);
  } 
  else if (data.event === 'media' && onMedia) {
    const payload = Buffer.from(data.media.payload, 'base64');
    onMedia(payload);
  } 
  else if (data.event === 'stop' && onStop) {
    onStop();
  }
};

module.exports = {
  generateTwimlResponse,
  formatMediaMessage,
  processMessage
}; 