const logger = require('../utils/logger');
const { generateTwimlResponse } = require('../services/twilio');

/**
 * Handles incoming Twilio calls and responds with TwiML
 * 
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 */
const handleIncomingCall = (request, reply) => {
  try {
    const twiml = generateTwimlResponse(request.hostname);
    
    logger.info('Incoming call received', { hostname: request.hostname });
    
    reply
      .code(200)
      .header('Content-Type', 'text/xml')
      .send(twiml);
  } catch (error) {
    logger.error('Error handling incoming call', { error: error.message });
    reply.code(500).send({ error: 'Internal Server Error' });
  }
};

/**
 * Handles health check requests
 * 
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 */
const handleHealthCheck = (request, reply) => {
  reply.send({ status: 'ok' });
};

module.exports = {
  handleIncomingCall,
  handleHealthCheck
}; 