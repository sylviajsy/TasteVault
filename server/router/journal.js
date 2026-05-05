import express from 'express';
import pool from '../db/connection.js';
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
        `
            SELECT
                tn.*,
                w.name,
                w.winery,
                w.image_url,
                w.region_display
            FROM tasting_notes tn
            JOIN wines w ON tn.wine_id = w.wine_id
            WHERE tn.user_id = $1
            ORDER BY tn.created_at DESC
        `,
        [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("GET /api/journal failed:", error);
        res.status(500).json({ error: "Failed to fetch journal" });
    }
})

export default router;