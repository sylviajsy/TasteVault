import express from 'express';
import pool from '../db/connection.js';

const router = express.Router();

router.get('/', async (req, res) => {

  const { search } = req.query;

  try {
    let result;

    if (search) {
      result = await pool.query(
        `
        SELECT * FROM wines
        WHERE name ILIKE $1
           OR winery ILIKE $1
           OR region_display ILIKE $1
        `,
        [`%${search}%`]
      );
    } else {
      result = await pool.query('SELECT * FROM wines ORDER BY wine_id');
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET /api/wines failed:", error);
    res.status(500).json({ error: 'Failed to fetch wines' });
  }
});

router.get('/:wineId', async (req, res) => {
  try {
    const { wineId } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM wines
      WHERE wine_id = $1
      `,
      [wineId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Wine not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("GET /api/wines/:wineId failed:", error);
    res.status(500).json({
      error: "Failed to fetch wine",
    });
  }
})

export default router;
