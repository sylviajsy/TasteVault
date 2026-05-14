import express from 'express';
import pool from '../db/connection.js';
import { fixUrl } from "../helpers/url.js";

const router = express.Router();

const mapToWineDTO = (wine) => {
  const grapesArray = wine.grapes 
    ? (Array.isArray(wine.grapes) ? wine.grapes : wine.grapes.split(',').map(g => g.trim()))
    : [];

  return {
    id: wine.wine_id,
    name: wine.name || 'Unknown Wine',
    winery: wine.winery || 'Unknown Winery',
    year: wine.year || 'N/A',
    image_url: fixUrl(wine.image_url),
    region: (wine.region_display || 'Region unavailable').toUpperCase(),
    price: wine.price ? `$${Number(wine.price).toFixed(2)}` : 'N/A',
    acidity: wine.acidity !== null ? wine.acidity : 'N/A',
    tannin: wine.tannin !== null ? wine.tannin : 'N/A',
    intensity: wine.intensity !== null ? wine.intensity : 'N/A',
    sweetness: wine.sweetness !== null ? wine.sweetness : 'N/A',
    grapes: grapesArray,
    flavors: (wine.flavor_jsonb || []).slice(0, 3).map(f => ({
      group: f.group,
      notes: f.notes.slice(0, 3) || []
    }))
  }
}

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
    const winesDTO = result.rows.map(mapToWineDTO);

    res.status(200).json(winesDTO);
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

    const winesDTO = result.rows.map(mapToWineDTO);

    res.status(200).json(winesDTO);
  } catch (error) {
    console.error("GET /api/wines/:wineId failed:", error);
    res.status(500).json({
      error: "Failed to fetch wine",
    });
  }
})

export default router;
