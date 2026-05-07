import express from 'express';
import pool from '../db/connection.js';
import authMiddleware from "../middleware/authMiddleware.js";
import { mapJournalInputDTO, mapJournalOutputDTO } from '../helpers/journalDTO.js';

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
        const response = result.rows.map(mapJournalOutputDTO);

        res.json(response);
    } catch (error) {
        console.error("GET /api/journal failed:", error);
        res.status(500).json({ error: "Failed to fetch journal" });
    }
})

router.post('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const dto = mapJournalInputDTO(req.body, req.user.id);

        if (!dto.wineId) {
            return res.status(400).json({ error: "wine_id is required" });
        }

        const result = await pool.query(
        `
            INSERT INTO tasting_notes (
                user_id,
                wine_id,
                price,
                user_acidity,
                user_fizziness,
                user_intensity,
                user_sweetness,
                user_tannin,
                user_flavor,
                comment
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            RETURNING *
        `,
        [
            userId,
            dto.wineId,
            dto.price,
            dto.acidity,
            dto.fizziness,
            dto.intensity,
            dto.sweetness,
            dto.tannin,
            JSON.stringify(dto.flavor),
            dto.comment,
        ]
        )
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("POST /api/journal failed:", error);
        res.status(500).json({ error: "Failed to save journal" });
    } 
})

export default router;