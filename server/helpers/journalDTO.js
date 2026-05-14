import { fixUrl } from "./url.js";

// POST DTO
export const mapJournalInputDTO = (body, userId) => {
    return {
        userId: userId,
        wineId: body.wine_id,
        score: body.score,
        price: body.price,
        acidity: body.user_acidity ?? 5,
        fizziness: body.user_fizziness ?? 5,
        intensity: body.user_intensity ?? 5,
        sweetness: body.user_sweetness ?? 5,
        tannin: body.user_tannin ?? 5,
        flavor: Array.isArray(body.user_flavor) ? body.user_flavor : [],
        comment: body.comment?.trim() || ""
    }
}

// GET DTO
export const mapJournalOutputDTO = (row) => {
  return {
    noteId: row.id,
    date: row.created_at 
            ? new Date(row.created_at).toLocaleDateString('en-US', {timeZone: "UTC"}) 
            : 'Unknown Date',
    wine: {
      id: row.wine_id,
      name: row.name,
      winery: row.winery,
      imageUrl: fixUrl(row.image_url),
      region: row.region_display?.toUpperCase(),
      flavors: (row.user_flavor || [])
        .slice(0, 3)
        .map(f => ({
          group: f.group,
          notes: (f.notes || []).slice(0, 3)
        }))
    },
    userStats: {
        price: row.price,
        score: row.score,
        acidity: row.user_acidity,
        fizziness: row.user_fizziness,
        intensity: row.user_intensity,
        sweetness: row.user_sweetness,
        tannin: row.user_tannin,
        userFlavor: row.user_flavor || [],
        comment: row.comment
    }
  };
};