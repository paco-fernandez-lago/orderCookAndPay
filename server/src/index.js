import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { setIO } from './socket.js';
import { errorHandler } from './middleware/errorHandler.js';
import { query } from './db.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

setIO(io);

app.use(cors());
app.use(express.json());

// Middleware to test DB connection
app.use(async (req, res, next) => {
  try {
    await query('SELECT NOW()');
    next();
  } catch (err) {
    console.error('Database connection failed:', err);
    res.status(503).json({ error: 'Database unavailable' });
  }
});

// Routes placeholder
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Import routes
import tablesRouter from './routes/tables.js';
import menuItemsRouter from './routes/menuItems.js';
import ordersRouter from './routes/orders.js';
import billsRouter from './routes/bills.js';

app.use('/api/tables', tablesRouter);
app.use('/api/menu-items', menuItemsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/bills', billsRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
