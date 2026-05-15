import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { DiscoveryPage } from "./DiscoveryPage";

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("../components/GlobalSearchBar", () => ({
  GlobalSearchBar: () => <div>Mock Search Bar</div>,
}));

vi.mock("../components/WineCard", () => ({
  WineCard: ({ wine }) => <div>{wine.name}</div>,
}));

vi.mock("../components/WineDetailModal", () => ({
  WineDetailModal: () => <div>Mock Wine Detail Modal</div>,
}));

describe("DiscoveryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  test("renders wines after fetch", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 1,
          name: "Opus One",
          winery: "Opus One Winery",
        },
        {
          id: 2,
          name: "Cakebread Cabernet",
          winery: "Cakebread Cellars",
        },
      ],
    });

    render(<DiscoveryPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/wines?search=")
      );
    });

    expect(await screen.findByText("Opus One")).toBeInTheDocument();
    expect(await screen.findByText("Cakebread Cabernet")).toBeInTheDocument();
  });
});
