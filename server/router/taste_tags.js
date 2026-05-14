import express from 'express';
import pool from '../db/connection.js';

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, group_name, tag_name
      FROM taste_tags
      ORDER BY group_name, tag_name
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("GET /api/taste-tags failed:", error);
    res.status(500).json({ error: "Failed to fetch taste tags" });
  }
});

export default router;