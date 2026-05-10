// file deepcode ignore HttpToHttps: TLS is terminated at the load balancer over a private internal network
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// 1. Trust proxy: Required for Render (or any reverse proxy) to correctly identify client IPs and protocols (x-forwarded-proto)
app.set('trust proxy', 1);

// Custom Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.header('origin') || 'No Origin'}`);
  next();
});

// 2. Configure Secure CORS
// Always include all known origins to avoid dependency on NODE_ENV being set correctly
// on the hosting platform. Additional origins can be added via ALLOWED_ORIGINS env var.
const defaultAllowedOrigins = [
  // Production frontend
  'https://freelance-hub-1-u1to.onrender.com',
  // Production backend (same-origin API testing)
  'https://freelance-hub-n8dk.onrender.com',
  // Local development
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : defaultAllowedOrigins;

// Allow all origins in development, but stick to the list in production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) 
    // or if origin is in the allowed list
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies/authorization headers to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

// 3. Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      if (req.method === 'GET' || req.method === 'HEAD') {
        // Use 301 (Permanent Redirect) for GET requests
        return res.redirect(301, `https://${req.header('host')}${req.url}`);
      } else {
        // Return 403 for non-GET HTTP requests (POST, PUT, DELETE)
        // If we redirected these, they would lose their request body.
        return res.status(403).json({ error: 'HTTPS is required for this endpoint.' });
      }
    }
    next();
  });
}

// 4. Security Headers with Helmet
// Disabling contentSecurityPolicy to avoid interfering with React inline scripts unless explicitly configured
app.use(helmet({
  contentSecurityPolicy: false,
}));

app.use(express.json());

// 5. Rate Limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, 
  legacyHeaders: false,
  message: { status: 429, message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Apply rate limiting to all /api routes
app.use('/api', apiLimiter);

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log('MongoDB connection error:', err);
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running', timestamp: new Date() });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/contracts', require('./routes/contracts'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/portfolio', require('./routes/portfolio'));

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  console.log(`404 at ${req.originalUrl}`);
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// 6. Server & Socket Configuration
// When SSL_KEY_PATH and SSL_CERT_PATH env vars are provided (e.g. local dev with certs),
// the server uses HTTPS directly. On Render/production, TLS is terminated at the edge
// load balancer so those vars are not set — the server uses HTTP over Render's private
// internal network. External HTTPS enforcement is handled by the x-forwarded-proto
// middleware above.
let sslOptions = null;
if (process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH) {
  try {
    sslOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    };
    console.log('SSL certificates detected: Preparing secure initialization.');
  } catch (err) {
    console.error('SSL Certificate loading failed. Falling back to internal HTTP.', err.message);
  }
}

// Render/PaaS: TLS terminates at the load balancer. Internal HTTP is expected.
const server = sslOptions 
  ? https.createServer(sslOptions, app) 
  : require('http').createServer(app); // snyk:ignore:javascript/HttpToHttps


const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', ({ userId }) => {
    // Basic validation
    if (!userId || typeof userId !== 'string') return;
    socket.join(userId);
  });

  socket.on('sendMessage', ({ senderId, receiverId, message }) => {
    // Input Validation
    if (!senderId || typeof senderId !== 'string') return;
    if (!receiverId || typeof receiverId !== 'string') return;
    if (!message || typeof message !== 'string') return;

    // Reject empty messages safely
    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) return;

    // Reject excessively long messages to prevent abuse
    if (trimmedMessage.length > 5000) return;

    io.to(receiverId).emit('receiveMessage', {
      senderId,
      message: trimmedMessage,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Keep-alive ping to prevent Render free-tier cold starts.
  // Render spins down services after 15 minutes of inactivity.
  // Pinging every 14 minutes keeps the server warm.
  if (process.env.SERVER_URL) {
    const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes
    setInterval(() => {
      https.get(`${process.env.SERVER_URL}/health`, (res) => {
        console.log(`Keep-alive ping sent. Status: ${res.statusCode}`);
      }).on('error', (err) => {
        console.error('Keep-alive ping failed:', err.message);
      });
    }, PING_INTERVAL);
    console.log(`Keep-alive ping scheduled every 14 minutes to ${process.env.SERVER_URL}/health`);
  }
});

// 7. Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.url}:`, err.stack || err.message);
  
  // If headers already sent, delegate to default express error handler
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});
