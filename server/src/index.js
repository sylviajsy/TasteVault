import cors from 'cors';
import express from 'express';
import pool from '../db/connection.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');

    res.status(200).json({
      status: 'ok',
      database: 'connected',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
    });
  }
});

app.listen(port, async () => {
  try {
    await pool.query('SELECT 1');
    console.log(`Server listening on port ${port}`);
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed');
    console.error(error.message);
  }
});
