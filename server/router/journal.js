import express from 'express';
import pool from '../db/connection.js';
import authMiddleware from "../middleware/authMiddleware.js";
import { mapJournalInputDTO, mapJournalOutputDTO } from '../helpers/journalDTO.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const search = req.query.search?.trim();

        let query = `
            SELECT
                tn.*,
                w.name,
                w.winery,
                w.image_url,
                w.region_display
            FROM tasting_notes tn
            JOIN wines w ON tn.wine_id = w.wine_id
            WHERE tn.user_id = $1
        `
        const values = [userId];

        if (search) {
            query += `
                AND (
                    w.name ILIKE $2
                    OR w.winery ILIKE $2
                    OR tn.comment ILIKE $2
                    OR tn.user_flavor::text ILIKE $2
                )
            `;
            values.push(`%${search}%`);
        }

        query += `
            ORDER BY tn.created_at DESC
        `;

        const result = await pool.query(
            query, values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No journal found!" });
        }

        const response = result.rows.map(mapJournalOutputDTO);

        res.json(response);
    } catch (error) {
        console.error("GET /api/journal failed:", error);
        res.status(500).json({ error: "Failed to fetch journal" });
    }
})

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const noteId = req.params.id;

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
            WHERE tn.id = $1
              AND tn.user_id = $2
        `,
        [noteId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No result returned" });
        }

        const response = mapJournalOutputDTO(result.rows[0]);

        res.json(response);
    } catch (error) {
        console.error("GET /api/journal/:id failed:", error);
        res.status(500).json({ error: "Failed to fetch tasting note" });
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
                score,
                user_acidity,
                user_fizziness,
                user_intensity,
                user_sweetness,
                user_tannin,
                user_flavor,
                comment
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING *
        `,
        [
            userId,
            dto.wineId,
            dto.price,
            dto.score,
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
