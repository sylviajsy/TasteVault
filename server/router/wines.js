import express from 'express';
import pool from '../db/connection.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM wines ORDER BY wine_id');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Failed to fetch wines');
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch wines' });
  }
});

export default router;
