// POST DTO
export const mapJournalInputDTO = (body, userId) => {
    return {
        userId: userId,
        wineId: body.wine_id,
        price: body.price,
        acidity: body.user_acidity || 5,
        fizziness: body.user_fizziness || 5,
        intensity: body.user_intensity || 5,
        sweetness: body.user_sweetness || 5,
        tannin: body.user_tannin || 5,
        flavor: Array.isArray(body.user_flavor) ? body.user_flavor : [],
        comment: body.comment?.trim() || ""
    }
}