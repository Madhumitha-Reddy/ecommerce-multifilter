import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const allowedOrigins = new Set((process.env.CLIENT_ORIGIN || '').split(',').map((origin) => origin.trim()).filter(Boolean));
app.use(cors({ origin: (origin, callback) => {
  if (!origin || process.env.NODE_ENV !== 'production' || allowedOrigins.has(origin)) return callback(null, true);
  return callback(null, false);
} }));
app.use(express.json());
app.get('/api/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({ success: connected, service: 'marketplace-api', database: connected ? 'connected' : 'unavailable' });
});
app.use('/api/products', productRoutes);
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT) || 5001;
try {
  await connectDB();
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
} catch (error) {
  console.error(`Unable to start API: ${error.message}`);
  process.exit(1);
}
