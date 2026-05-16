import request from "supertest";
import { test, expect, describe, vi, afterEach } from "vitest";
import app from "../src/index.js";
import pool from "../db/connection.js";

vi.mock("../db/connection.js", () => ({
  default: {
    query: vi.fn(),
  },
}));

describe("Wines Routes", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("GET /api/wines returns mapped wines", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [
        {
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
        },
      ],
    });

    const res = await request(app).get("/api/wines");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      {
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
      },
    ]);
    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM wines ORDER BY wine_id");
  });
});
