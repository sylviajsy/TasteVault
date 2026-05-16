export const mockWine = {
  id: 101,
  name: "Dark Horse Cabernet",
  winery: "Dark Horse",
  year: 2021,
  grapes: ["Cabernet Sauvignon", "Merlot"],
  flavors: [
    {
      group: "black_fruit",
      notes: ["blackberry", "plum"],
    },
  ],
  image_url: "https://example.com/wine.png",
  region: "California, United States",
  price: "$29.50",
  acidity: 7,
  tannin: 5,
  intensity: 8,
  sweetness: 2,
};

export const mockWineSearchResult = {
  id: mockWine.id,
  name: mockWine.name,
  winery: mockWine.winery,
  image_url: "",
};

export const mockWineSearchResults = [mockWineSearchResult];
