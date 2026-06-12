import request from "supertest";
import { test, expect, describe, vi, afterEach } from "vitest";

vi.mock("../db/connection.js", () => ({
  default: {
    query: vi.fn(),
  },
}));

vi.mock("../middleware/authMiddleware.js", () => {
  const mockMiddleware = (_req, _res, next) => next();

  return {
    authMiddleware: mockMiddleware, 
    default: mockMiddleware,         
  };
});

const { default: app } = await import("../src/index.js");
const { default: pool } = await import("../db/connection.js");

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
      expect.stringContaining("LIMIT $1") && expect.stringContaining("OFFSET $2"),
      [24, 0]
    )
  });

  test("GET /api/wines supports search query", async() => {
    pool.query.mockResolvedValueOnce({
      rows: [mockWine],
    });

    const res = await request(app).get("/api/wines?search=test");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([mappedWine]);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("ILIKE $1"),
      ["%test%", 24, 0]
    );
  })
});
