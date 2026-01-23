import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { coachRouter } from './routes/coach';
import { statsRouter } from './routes/stats';
import { subscriptionRouter } from './routes/subscription';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

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
