export const mockJournalInput = {
  wine_id: 123,
  price: 19.99,
  comment: "Bright acidity and smooth finish.",
  user_acidity: 7,
  user_fizziness: 0,
  user_intensity: 8,
  user_sweetness: 3,
  user_tannin: 5,
  score: 9,
  user_flavor: [
    {
      group: "black_fruit",
      notes: ["blackberry", "blueberry"],
    },
  ],
};

export const mockJournalDbRow = {
  id: 1,
  wine_id: 123,
  name: "Cabernet Sauvignon",
  winery: "Test Estate",
  image_url: "//images.vivino.com/test.png",
  region_display: "napa valley",
  price: 19.99,
  comment: "Bright acidity and smooth finish.",
  user_acidity: 7,
  user_fizziness: 0,
  user_intensity: 8,
  user_sweetness: 3,
  user_tannin: 5,
  user_flavor: [
    { group: "fruit", notes: ["cherry", "berry", "plum", "extra"] },
    { group: "spice", notes: ["oak"] },
    { group: "earth", notes: ["soil"] },
    { group: "ignore", notes: ["this"] },
  ],
  score: 9,
  created_at: "2026-05-11T14:00:00Z",
};
