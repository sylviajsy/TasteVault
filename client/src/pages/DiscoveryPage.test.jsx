import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { DiscoveryPage } from "./DiscoveryPage";
import {
  mockWineSearchResult,
  mockWineSearchResults,
} from "../../../test-data/wines.js";

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("../components/GlobalSearchBar", () => ({
  GlobalSearchBar: ({ value, onChange, onSearch }) => (
    <div>
      <input
        placeholder="Search wines, winery, region..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="button" onClick={() => onSearch(value)}>
        Search
      </button>
    </div>
  ),
}));

vi.mock("../components/WineCard", () => ({
  WineCard: ({ wine, onSelect }) => (
    <button type="button" onClick={() => onSelect(wine)}>
      {wine.name}
    </button>
  ),
}));

vi.mock("../components/WineDetailModal", () => ({
  WineDetailModal: ({ wine }) => <div>Wine Detail Modal: {wine.name}</div>,
}));

describe("DiscoveryPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    test("renders wines after fetch", async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockWineSearchResults,
        });

        render(<DiscoveryPage />);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/api/wines?search=")
            );
        });

        expect(await screen.findByText(mockWineSearchResult.name)).toBeInTheDocument();
    });

    test("fetches wines when searching", async () => {
        const user = userEvent.setup();

        global.fetch
        .mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => mockWineSearchResults,
        });

        render(<DiscoveryPage />);

        const input = screen.getByPlaceholderText(/search wines/i);
        await user.type(input, "Cabernet");
        await user.click(screen.getByRole("button", { name: /search/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenLastCalledWith(
                expect.stringContaining("/api/wines?search=Cabernet")
            );
        });
    });

    test("opens wine detail modal", async () => {
        const user = userEvent.setup();

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockWineSearchResults,
        });

        render(<DiscoveryPage />);

        const wineButton = await screen.findByRole("button", {
          name: mockWineSearchResult.name,
        });
        await user.click(wineButton);

        expect(
          await screen.findByText(`Wine Detail Modal: ${mockWineSearchResult.name}`)
        ).toBeInTheDocument();
    });

});
