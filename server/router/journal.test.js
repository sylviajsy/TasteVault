import request from "supertest";
import { test, expect, describe, vi, afterEach } from 'vitest';
import app from "../src/index.js";
import pool from "../db/connection.js";

vi.mock("../db/connection.js", () => ({
  default: {
    query: vi.fn(),
  },
}));

const mockNote = {
            wine_id: 123,
            price: 19.99,
            comment: "Bright acidity and smooth finish.",
            user_acidity: 7,
            user_fizziness: 0,
            user_intensity: 8,
            user_sweetness: 3,
            user_tannin: 5,
            user_flavor: [
                {
                group: "black_fruit",
                notes: ["blackberry", "blueberry"],
                },
            ],
        }


describe('Journal Routes', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    test('POST /api/journal', async () => {
        const mockResponse = { 
            id: 1, 
            user_id: "test-user-id", 
            ...mockNote, 
            created_at: "2026-05-11T00:00:00.000Z"
        };

        pool.query.mockResolvedValueOnce({
            rows: [mockResponse],
        });

        const res = await request(app)
        .post("/api/journal")
        .send(mockNote);

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(mockResponse); 
        expect(pool.query).toHaveBeenCalledTimes(2);
    })
})