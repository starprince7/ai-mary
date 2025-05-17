const { handleIncomingCall, handleHealthCheck } = require('../controllers/httpController');
const { handleMediaStream } = require('../controllers/websocketController');

/**
 * Registers HTTP and WebSocket routes with the Fastify instance
 * 
 * @param {Object} fastify - Fastify instance
 */
const registerRoutes = (fastify) => {
  // HTTP Routes
  fastify.post('/incoming-call', handleIncomingCall);
  fastify.get('/health', handleHealthCheck);
  
  // WebSocket Routes
  fastify.register(async function (fastify) {
    fastify.get('/media-stream', { websocket: true }, (connection, req) => {
      handleMediaStream(connection, req, fastify);
    });
  });
};

module.exports = registerRoutes; 