const fastify = require('fastify')({ logger: true });
const fastifyWebsocket = require('@fastify/websocket');
const { SERVER_CONFIG, validateConfig } = require('./config');
const registerRoutes = require('./routes');
const logger = require('./utils/logger');

// Register plugins
fastify.register(fastifyWebsocket);

// Initialize the application
const init = async () => {
  try {
    // Validate required configuration
    validateConfig();
    
    // Register routes
    registerRoutes(fastify);
    
    // Start the server
    await fastify.listen({
      port: SERVER_CONFIG.port,
      host: SERVER_CONFIG.host
    });
    
    logger.info(`Server is running`, { 
      url: `http://localhost:${SERVER_CONFIG.port}`, 
      port: SERVER_CONFIG.port 
    });
    logger.info('To expose your server to the internet, run: ngrok http 3000');
  } catch (err) {
    logger.error('Error starting server', { error: err.message });
    process.exit(1);
  }
};

// Start the application
init(); 