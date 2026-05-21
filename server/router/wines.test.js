import request from "supertest";
import { test, expect, describe, vi, afterEach } from "vitest";
import app from "../src/index.js";
import pool from "../db/connection.js";

vi.mock("../db/connection.js", () => ({
  default: {
    query: vi.fn(),
  },
}));

const mockWine = {
  wine_id: 101,
  name: "Test Wine",
  winery: "Test Winery",
  year: 2020,
  image_url: "//images.vivino.com/thumbs/test.png",
  region_display: "Napa Valley",
  price: 29.5,
  acidity: 7,
  tannin: 5,
  intensity: 8,
  sweetness: 2,
  grapes: ["Cabernet Sauvignon", "Merlot"],
  flavor_jsonb: [
    {
      group: "black_fruit",
      notes: ["blackberry", "plum", "black cherry", "cassis"],
    },
  ],
};

const mappedWine = {
  id: 101,
  name: "Test Wine",
  winery: "Test Winery",
  year: 2020,
  image_url: "https://images.vivino.com/thumbs/test.png",
  region: "NAPA VALLEY",
  price: "$29.50",
  acidity: 7,
  tannin: 5,
  intensity: 8,
  sweetness: 2,
  grapes: ["Cabernet Sauvignon", "Merlot"],
  flavors: [
    {
      group: "black_fruit",
      notes: ["blackberry", "plum", "black cherry"],
    },
  ],
};

describe("Wines Routes", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("GET /api/wines returns mapped wines", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [mockWine],
    });

    const res = await request(app).get("/api/wines");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([mappedWine]);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("LIMIT $1"),
      [24, 0]
    );
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("OFFSET $2"),
      [24, 0]
    );
  });
});
