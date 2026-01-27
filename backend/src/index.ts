import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { coachRouter } from './routes/coach';
import { statsRouter } from './routes/stats';
import { subscriptionRouter } from './routes/subscription';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Rate limiting: prevents abuse
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: parseInt(process.env.API_RATE_LIMIT || '100'), // limit each IP to 100 requests per minute
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
})); // Enable CORS with origin control
app.use(express.json()); // Parse JSON bodies
app.use(limiter); // Apply rate limiting to all routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/coach', coachRouter);
app.use('/api/stats', statsRouter);
app.use('/api/subscription', subscriptionRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server (only if not in serverless environment)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🃏 Card Counter AI Backend running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export for serverless environments
export default app;
