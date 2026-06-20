import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { query } from './database/connection';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import rewardRoutes from './routes/rewards';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 5000;

// Run database migrations on startup
async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    const migrationPath = path.join(__dirname, '..', 'migrations', '001_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Split into individual statements (pg cannot run multiple at once)
    const statements = sql.split(';').filter((s: string) => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await query(statement);
      }
    }
    console.log('✅ Database migrations applied successfully');
  } catch (error: any) {
    // IF NOT EXISTS in SQL means this is safe to run repeatedly
    console.log('Migration note:', error.message);
  }
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// API info
app.get('/api', (req, res) => {
  res.json({ message: 'tinyChanges API v1.0.0' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/rewards', rewardRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Something went wrong',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
  });
});

// Start server after running migrations
runMigrations().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 API docs: http://localhost:${PORT}/api`);
  });
}).catch((err) => {
  console.error('Failed to run migrations, starting server anyway:', err.message);
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

export default app;
