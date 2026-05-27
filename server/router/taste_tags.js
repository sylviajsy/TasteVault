import express from 'express';
import pool from '../db/connection.js';
import crypto from "crypto";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, group_name, tag_name
      FROM taste_tags
      ORDER BY group_name, tag_name
    `);

    // Generate a hash based on response content
    const etag = `"${crypto
      .createHash("md5")
      .update(JSON.stringify(result.rows))
      .digest("hex")}"`;

    // Read browser's previous ETag
    const clientETag = req.headers["if-none-match"];

    // If browser cache is still valid,
    // return 304 without sending response body again
    if (clientETag === etag) {
      return res.status(304).end();
    }

    // Attach ETag header to response
    res.setHeader("ETag", etag);

    return res.json(result.rows);
  } catch (error) {
    console.error("GET /api/taste-tags failed:", error);
    res.status(500).json({ error: "Failed to fetch taste tags" });
  }
});

export default router;