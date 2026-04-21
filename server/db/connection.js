import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'Missing DATABASE_URL. Add your Supabase Postgres connection string to .env.',
  );
}

const isSslDisabled = process.env.PGSSLMODE === 'disable';

const pool = new Pool({
  connectionString,
  ssl: isSslDisabled ? false : { rejectUnauthorized: false },
});

export const query = (text, params) => pool.query(text, params);

export default pool;
