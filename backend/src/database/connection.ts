import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
});

export const query = (text: string, params?: unknown[]): Promise<QueryResult<any>> => {
  return pool.query(text, params);
};

export const getClient = async () => {
  return pool.connect();
};

export const closePool = async () => {
  await pool.end();
};

export default pool;
