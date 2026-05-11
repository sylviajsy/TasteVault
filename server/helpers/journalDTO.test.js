import { describe, test, expect } from "vitest";
import { mapJournalOutputDTO } from "./journalDTO.js";

const mockNote = {
    id: 1,
    wine_id: 123,
    name: 'Cabernet Sauvignon',
    winery: 'Test Estate',
    image_url: '//images.vivino.com/test.png',
    region_display: 'napa valley',
    price: 19.99,
    comment: "Bright acidity and smooth finish.",
    user_acidity: 7,
    user_fizziness: 0,
    user_intensity: 8,
    user_sweetness: 3,
    user_tannin: 5,
    user_flavor: [
        { group: 'fruit', notes: ['cherry', 'berry', 'plum', 'extra'] },
        { group: 'spice', notes: ['oak'] },
        { group: 'earth', notes: ['soil'] },
        { group: 'ignore', notes: ['this'] }
    ],
    score: 9,
    created_at: '2026-05-11T00:00:00Z',
}

describe ('Journal DTO', () => {
    test('mapJournalOutputDTO', () => {
        const result = mapJournalOutputDTO(mockNote);
        expect(result.noteId).toBe(1);
        expect(result.date).toBe('5/10/2026');
        expect(result.wine.name).toBe('Cabernet Sauvignon');
        expect(result.wine.imageUrl).toBe('https://images.vivino.com/test.png');
        expect(result.wine.region).toBe('NAPA VALLEY');
        expect(result.wine.flavors).toHaveLength(3);
        expect(result.wine.flavors[0].notes).toHaveLength(3);
    })
})