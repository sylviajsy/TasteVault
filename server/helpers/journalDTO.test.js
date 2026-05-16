import { describe, test, expect } from "vitest";
import { mapJournalOutputDTO } from "./journalDTO.js";
import { mockJournalDbRow } from "../../test-data/journal.js";

describe ('Journal DTO', () => {
    test('mapJournalOutputDTO', () => {
        const result = mapJournalOutputDTO(mockJournalDbRow);
        expect(result.noteId).toBe(1);
        expect(result.date).toBe('5/11/2026');
        expect(result.wine.name).toBe('Cabernet Sauvignon');
        expect(result.wine.imageUrl).toBe('https://images.vivino.com/test.png');
        expect(result.wine.region).toBe('NAPA VALLEY');
        expect(result.wine.flavors).toHaveLength(3);
        expect(result.wine.flavors[0].notes).toHaveLength(3);
    })
})
