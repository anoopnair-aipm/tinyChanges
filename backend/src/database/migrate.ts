import { query, closePool } from '@/database/connection';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');

    // Read migration file
    const migrationPath = path.join(__dirname, '../../migrations/001_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Split by semicolon to handle multiple statements
    const statements = sql.split(';').filter(s => s.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await query(statement);
        console.log('✓ Executed:', statement.trim().substring(0, 50) + '...');
      }
    }

    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  } finally {
    await closePool();
  }
}

runMigrations();
