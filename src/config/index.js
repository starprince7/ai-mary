require('dotenv').config();

// Server configuration
const SERVER_CONFIG = {
  port: process.env.PORT || 3000,
  host: '0.0.0.0',
};

// OpenAI configuration
const OPENAI_CONFIG = {
  apiKey: process.env.OPENAI_API_KEY,
  voiceModel: process.env.OPENAI_VOICE_MODEL || 'tts-1',
  voice: process.env.OPENAI_VOICE || 'alloy',
  whisperModel: 'whisper-1',
  encoding: 'mulaw',
  sampleRate: 8000,
  responseFormat: 'json',
  wsUrl: 'wss://api.openai.com/v1/audio/speech',
};

// Twilio configuration
const TWILIO_CONFIG = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
};

// WebSocket configuration
const WS_CONFIG = {
  reconnectAttempts: 3,
  reconnectDelay: 1000, // in milliseconds
};

// Validate required configuration
const validateConfig = () => {
  if (!OPENAI_CONFIG.apiKey) {
    throw new Error('OPENAI_API_KEY is required. Please add it to your .env file.');
  }
};

module.exports = {
  SERVER_CONFIG,
  OPENAI_CONFIG,
  TWILIO_CONFIG,
  WS_CONFIG,
  validateConfig,
}; 