const express = require('express');
const http = require('http');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { Server } = require('socket.io');
const mongoConnection = require('./util/mongoConnection');
const users = require('./User/userRouter');
const trainData = require('./TrainData/DataTableRouter');
const tempData = require('./TempData/TempDataRoutes');
const documentRouter = require('./Document/DocumentRouter');
const translationRouter = require('./Translation/TranslationRouter');
const { getDocument, updateDocument } = require('./Document/DocumentController');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

// Socket.IO setup with environment-based CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || process.env.NODE_ENV === 'production' 
      ? ["https://banglaverse.vercel.app", "https://banglaverse.netlify.app"] 
      : "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join document room
  socket.on('join-document', (documentId) => {
    socket.join(documentId);
    console.log(`User ${socket.id} joined document ${documentId}`);
  });

  // Handle document changes
  socket.on('document-change', (data) => {
    socket.to(data.documentId).emit('receive-changes', data);  // Emit changes to other users in the document room
  });

  // Save document content periodically or on-demand
  socket.on('save-document', async (data) => {
    try {
      const updatedDocument = await updateDocument(data.documentId, data.content);
      io.to(data.documentId).emit('document-saved', updatedDocument);  // Notify users that the document is saved
    } catch (error) {
      console.error('Error saving document:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || process.env.NODE_ENV === 'production' 
    ? ["https://banglaverse.vercel.app", "https://banglaverse.netlify.app"] 
    : ["http://localhost:8080", "http://localhost:3000"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));

mongoConnection();

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'BanglaVerse API',
      version: '1.0.0',
      description: 'AI-Powered Bangla Language Platform API',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://banglaverse-backend.vercel.app'
          : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: [
    './User/*.js',
    './Document/*.js',
    './TrainData/*.js',
    './TempData/*.js'
  ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.get('/', (req, res) => {
  res.json({
    message: 'BanglaVerse API Server is running',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    docs: '/api-docs'
  });
});

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version
  });
});

// Database connection test endpoint
app.get('/db-test', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const connectionState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      database: {
        status: states[connectionState] || 'unknown',
        readyState: connectionState,
        mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not Set',
        dbEnv: process.env.DB ? 'Set' : 'Not Set'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Database test failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Routes
app.use('/api/users', users);
app.use('/api/trainData', trainData);
app.use('/api/tempData', tempData);
app.use('/api/documents', documentRouter);
app.use('/api', translationRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server only if this script is executed directly
if (require.main === module) {
  server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}...`);
    console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
  });
}

// Export app and server for testing and Vercel deployment
module.exports = app; // Export app directly for Vercel
module.exports.app = app;
module.exports.server = server;
