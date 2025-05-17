const WebSocket = require('ws');
const { OPENAI_CONFIG } = require('../../config');

/**
 * Establishes a WebSocket connection to OpenAI
 * 
 * @param {Object} options - Connection options
 * @param {Function} options.onOpen - Callback for connection open
 * @param {Function} options.onMessage - Callback for message received
 * @param {Function} options.onError - Callback for error
 * @param {Function} options.onClose - Callback for connection close
 * @returns {WebSocket} - WebSocket connection
 */
const createOpenAIWebSocket = ({ onOpen, onMessage, onError, onClose }) => {
  const ws = new WebSocket(OPENAI_CONFIG.wsUrl, {
    headers: {
      'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (onOpen) ws.on('open', () => onOpen(ws));
  if (onMessage) ws.on('message', (message) => onMessage(ws, message));
  if (onError) ws.on('error', (error) => onError(ws, error));
  if (onClose) ws.on('close', (code, reason) => onClose(ws, code, reason));
  
  return ws;
};

/**
 * Sends configuration message to OpenAI after connection is established
 * 
 * @param {WebSocket} ws - WebSocket connection 
 */
const sendConfigurationMessage = (ws) => {
  ws.send(JSON.stringify({
    model: OPENAI_CONFIG.whisperModel,
    encoding: OPENAI_CONFIG.encoding,
    sample_rate: OPENAI_CONFIG.sampleRate,
    response_format: OPENAI_CONFIG.responseFormat
  }));
};

/**
 * Generates a response based on user input
 * This is a placeholder function that would normally call OpenAI's API
 * 
 * @param {String} userInput - The user's input text
 * @returns {Promise<String>} - The AI-generated response
 */
const generateAiResponse = async (userInput) => {
  try {
    // In a real implementation, you would call OpenAI's text completion API
    // For this example, we'll simulate a response
    
    // For actual implementation, you would use OpenAI API for text completion
    // and then convert that text to speech using their TTS API
    
    // Simulated response for this example
    const responses = [
      `I heard you say: ${userInput}. How can I help with that?`,
      `Thanks for saying: ${userInput}. Is there anything else you'd like to know?`,
      `I understand you said: ${userInput}. Let me assist you with that.`
    ];
    
    // Pick a random response for demonstration
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return randomResponse;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I'm sorry, I couldn't process your request at this time.";
  }
};

module.exports = {
  createOpenAIWebSocket,
  sendConfigurationMessage,
  generateAiResponse
}; 