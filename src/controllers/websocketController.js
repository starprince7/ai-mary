const logger = require('../utils/logger');
const { WS_CONFIG } = require('../config');
const { createOpenAIWebSocket, sendConfigurationMessage, generateAiResponse } = require('../services/openai');
const { processMessage, formatMediaMessage } = require('../services/twilio');

/**
 * Handles WebSocket connections for media streaming
 * 
 * @param {Object} connection - Fastify WebSocket connection
 * @param {Object} req - HTTP request object
 * @param {Object} fastify - Fastify instance
 */
const handleMediaStream = (connection, req, fastify) => {
  logger.info('Twilio WebSocket connection established');

  // State variables
  let openaiWs = null;
  let streamSid = null;
  let callSid = null;
  let audioChunks = [];
  let isCallEnded = false;
  let openaiConnected = false;
  let reconnectAttempts = 0;

  // OpenAI WebSocket event handlers
  const handleOpenAIOpen = (ws) => {
    logger.info('Connected to OpenAI Realtime API');
    openaiConnected = true;
    reconnectAttempts = 0;
    sendConfigurationMessage(ws);
  };

  const handleOpenAIMessage = (ws, message) => {
    try {
      const response = JSON.parse(message.toString());
      
      if (response.text) {
        logger.info(`OpenAI transcription received`, { text: response.text });
        
        // Generate AI response
        generateAiResponse(response.text)
          .then(aiResponseText => {
            logger.info(`AI response generated`, { response: aiResponseText });
            
            // Send response back to Twilio
            if (streamSid && !isCallEnded) {
              const mediaMessage = formatMediaMessage(streamSid, aiResponseText);
              connection.socket.send(JSON.stringify(mediaMessage));
            }
          })
          .catch(err => {
            logger.error('Error generating AI response', { error: err.message });
          });
      }
    } catch (error) {
      logger.error('Error processing OpenAI response', { error: error.message });
    }
  };

  const handleOpenAIError = (ws, error) => {
    logger.error('OpenAI WebSocket error', { error: error.message });
    openaiConnected = false;
  };

  const handleOpenAIClose = (ws, code, reason) => {
    logger.info(`OpenAI WebSocket closed`, { code, reason });
    openaiConnected = false;
    
    // Attempt to reconnect if the call is still active
    if (!isCallEnded) {
      reconnectAttempts++;
      logger.info(`Attempting to reconnect to OpenAI`, { 
        attempt: reconnectAttempts, 
        maxAttempts: WS_CONFIG.reconnectAttempts 
      });
      
      if (reconnectAttempts <= WS_CONFIG.reconnectAttempts) {
        setTimeout(() => {
          openaiWs = createOpenAIWebSocket({
            onOpen: handleOpenAIOpen,
            onMessage: handleOpenAIMessage,
            onError: handleOpenAIError,
            onClose: handleOpenAIClose
          });
        }, WS_CONFIG.reconnectDelay * reconnectAttempts); // Exponential backoff
      } else {
        logger.error('Max reconnection attempts reached');
      }
    }
  };

  // Establish initial OpenAI connection
  openaiWs = createOpenAIWebSocket({
    onOpen: handleOpenAIOpen,
    onMessage: handleOpenAIMessage,
    onError: handleOpenAIError,
    onClose: handleOpenAIClose
  });

  // Twilio message handlers
  const handleStart = (sid, cid) => {
    streamSid = sid;
    callSid = cid;
    logger.info(`Call started`, { callSid });
  };

  const handleMedia = (payload) => {
    if (openaiConnected) {
      audioChunks.push(payload);
      
      // Send to OpenAI when we have enough data
      if (audioChunks.length >= 5) {
        const audioBuffer = Buffer.concat(audioChunks);
        openaiWs.send(audioBuffer);
        audioChunks = [];
      }
    }
  };

  const handleStop = () => {
    logger.info(`Call ended`, { callSid });
    isCallEnded = true;
    
    // Close OpenAI connection
    if (openaiConnected && openaiWs) {
      openaiWs.close();
    }
  };

  // Handle messages from Twilio
  connection.socket.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      processMessage(data, {
        onStart: handleStart,
        onMedia: handleMedia,
        onStop: handleStop
      });
    } catch (error) {
      logger.error('Error processing Twilio message', { error: error.message });
    }
  });

  // Handle WebSocket closure
  connection.socket.on('close', () => {
    logger.info('Twilio WebSocket connection closed');
    isCallEnded = true;
    
    // Clean up and close OpenAI connection if still open
    if (openaiConnected && openaiWs) {
      openaiWs.close();
    }
  });
};

module.exports = {
  handleMediaStream
}; 