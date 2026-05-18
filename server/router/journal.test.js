import request from "supertest";
import { test, expect, describe, vi, afterEach } from 'vitest';
import app from "../src/index.js";
import pool from "../db/connection.js";
import { mockJournalInput } from "../../test-data/journal.js";

vi.mock("../db/connection.js", () => ({
  default: {
    query: vi.fn(),
  },
}));

describe('Journal Routes', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    test('POST /api/journal', async () => {
        const mockResponse = { 
            id: 1, 
            user_id: "test-user-id", 
            ...mockJournalInput, 
            created_at: "2026-05-11T00:00:00.000Z"
        };

        pool.query.mockResolvedValueOnce({
            rows: [mockResponse],
        });

        const res = await request(app)
        .post("/api/journal")
        .send(mockJournalInput);

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(mockResponse); 
        expect(pool.query).toHaveBeenCalledTimes(2);
    })

    test('GET /api/journal', async () => {
        const mockResponse = { 
            id: 1, 
            user_id: "test-user-id", 
            ...mockJournalInput, 
            created_at: "2026-05-11T00:00:00.000Z"
        };

        pool.query.mockResolvedValueOnce({
            rows: [mockResponse],
        })

        const res = await request(app).get("/api/journal");

        expect(res.statusCode).toBe(200);
        expect(pool.query).toHaveBeenCalledTimes(1);
    })

    test('GET /api/journal returns no result returned when empty', async () => {
        pool.query.mockResolvedValueOnce({
            rows: [],
        });

        const res = await request(app).get("/api/journal");

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: "No journal found!" });
    })
})
