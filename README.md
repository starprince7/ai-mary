# Voice AI Assistant with Twilio and OpenAI

This project demonstrates a Voice AI Assistant that integrates Twilio for voice call handling with OpenAI's Realtime API for processing audio and generating responses in real-time. Users can interact via voice calls, with the assistant processing their input and responding with AI-generated audio seamlessly.

## Features

- Real-time voice interaction using Twilio
- Speech-to-text and text-to-speech using OpenAI's APIs
- WebSocket integration for bidirectional communication
- Built with Fastify for high performance
- Modular, maintainable codebase architecture

## Prerequisites

- Node.js installed (v14 or later recommended)
- Twilio account with a voice-capable phone number
- OpenAI account with access to the Realtime API and a valid API key
- ngrok for exposing your local server to the internet

## Project Structure

```
ai-mary/
├── .env.example               # Example environment variables
├── .gitignore                 # Git ignore file
├── package.json               # Project dependencies
├── README.md                  # Project documentation
└── src/                       # Source code
    ├── config/                # Configuration
    │   └── index.js           # Configuration variables
    ├── controllers/           # Request handlers
    │   ├── httpController.js  # HTTP endpoint handlers
    │   └── websocketController.js # WebSocket handlers
    ├── middleware/            # Express middleware
    ├── routes/                # Route definitions
    │   └── index.js           # Route registration
    ├── services/              # Business logic
    │   ├── openai/            # OpenAI integration
    │   │   └── index.js       # OpenAI service
    │   └── twilio/            # Twilio integration
    │       └── index.js       # Twilio service
    ├── utils/                 # Utility functions
    │   └── logger.js          # Logging utility
    └── index.js               # Application entry point
```

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/incoming-call` | Handles incoming Twilio calls and responds with TwiML |
| GET | `/health` | Health check endpoint |
| WebSocket | `/media-stream` | WebSocket endpoint for Twilio media streaming |

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/ai-mary.git
   cd ai-mary
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file by copying the example:
   ```bash
   cp env.example .env
   ```

4. Edit the `.env` file and add your OpenAI API key and Twilio credentials:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
   TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
   ```

## Running Locally

### Development Mode

Run the application with automatic restart on file changes:

```bash
npm run dev
```

### Production Mode

Run the application in production mode:

```bash
npm start
```

## Setup with Twilio

### 1. Expose Your Local Server with ngrok

1. Download and install ngrok from [ngrok.com](https://ngrok.com/).
2. Run ngrok to expose your local server:
   ```bash
   ngrok http 3000
   ```
3. Copy the public URL provided by ngrok (e.g., `https://<your-ngrok-subdomain>.ngrok.io`).

### 2. Configure Twilio

1. Log in to your Twilio account at [twilio.com/console](https://twilio.com/console).
2. Navigate to the Phone Numbers section and select your voice-capable phone number.
3. Under "Voice & Fax", configure the "A CALL COMES IN" webhook to point to your ngrok URL followed by `/incoming-call` (e.g., `https://<your-ngrok-subdomain>.ngrok.io/incoming-call`).
4. Set the HTTP method to POST.
5. Save the configuration.

## Testing Your Voice AI Assistant

1. Make sure your server is running and ngrok is exposing it.
2. Call your Twilio phone number.
3. Start speaking after the greeting.
4. Your voice will be processed by OpenAI and you'll receive AI-generated responses in real-time.

## Extending the Application

The modular architecture makes it easy to extend the application:

- **Add new AI providers**: Create a new service in `src/services/` for each provider.
- **Add new voice features**: Extend the WebSocket handler in `src/controllers/websocketController.js`.
- **Add new HTTP endpoints**: Add routes in `src/routes/index.js` and handlers in `src/controllers/httpController.js`.

## Troubleshooting

- If the WebSocket connection fails, ensure your OpenAI API key is correct and has the necessary permissions.
- If Twilio doesn't connect to your server, verify that your ngrok URL is correctly configured in the Twilio webhook settings.
- Check the server logs for detailed error messages.

## License

MIT 