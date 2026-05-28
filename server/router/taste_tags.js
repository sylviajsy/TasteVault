import express from 'express';
import pool from '../db/connection.js';
import redisClient from "../db/redis.js";
import crypto from "crypto";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cacheKey = "taste_tags:all";
    let tags;

    if (redisClient) {
      const cached = await redisClient.get(cacheKey);

      if (cached) {
        tags = JSON.parse(cached);

        const etag = `"${crypto
          .createHash("md5")
          .update(JSON.stringify(tags))
          .digest("hex")}"`;

        if (req.get("if-none-match") === etag) {
          return res.status(304).end();
        }

        res.setHeader("ETag", etag);
        return res.status(200).json(tags);
      }
    }

    const result = await pool.query(`
      SELECT id, group_name, tag_name
      FROM taste_tags
      ORDER BY group_name, tag_name
    `);

    tags = result.rows;
    
    if (redisClient) {
      await redisClient.setEx(cacheKey, 60 * 60, JSON.stringify(tags));
    }

    const etag = `"${crypto
      .createHash("md5")
      .update(JSON.stringify(tags))
      .digest("hex")}"`;

    if (req.get("if-none-match") === etag) {
      return res.status(304).end();
    }

    res.setHeader("ETag", etag);

    res.json(tags);
  } catch (error) {
    console.error("GET /api/taste-tags failed:", error);
    res.status(500).json({ error: "Failed to fetch taste tags" });
  }
});

export default router;