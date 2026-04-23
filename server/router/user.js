import express from 'express';
import pool from '../db/connection.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [userId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).send('Error');
  }
});

export default router;
