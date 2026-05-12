import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { AddNoteModal } from "./AddNoteModal";

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockTags = [
  { id: 1, group_name: "fruit", tag_name: "blackberry" }
];

const mockWines = [
  { id: 101, name: "Dark Horse Cabernet", winery: "Dark Horse", image_url: "" }
];

describe('Add Note Modal', () => {
    const onClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.setItem("token", "fake-token");
        global.fetch = vi.fn();
    });
    test('Submit note Integration test', async () => {
        const user = userEvent.setup();

        global.fetch
            .mockResolvedValueOnce({ ok: true, json: async () => mockTags }) // Load tags
            .mockResolvedValueOnce({ ok: true, json: async () => mockWines }) // Search wine
            .mockResolvedValueOnce({ ok: true, json: async () => ({ wine_id: 101, comment: "Bright and fresh.", }) }); // Submit

        render(<AddNoteModal onClose={onClose} />);

        // initial taste tags request
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/api/tasteTags")
            );
        });

        await user.type(
            screen.getByPlaceholderText(/search wines/i),
            "Dark Horse Cabernet"
        );

        const searchInput = screen.getByPlaceholderText(/search wines/i);

        await user.type(searchInput, "Dark Horse Cabernet");

        const wineText = await screen.findByText(/dark horse cabernet/i);
        await user.click(wineText.closest("button"));

        await waitFor(() => {
            expect(screen.getByText(/selected wine/i)).toBeInTheDocument();
        });

        expect(searchInput).toHaveValue("Dark Horse Cabernet");

        await user.type(screen.getByLabelText(/price/i), "20");

        await user.type(
            screen.getByLabelText(/comment/i),
            "Bright and fresh."
        );

        const submitButton = screen.getByRole("button", { name: /^submit$/i });
        await user.click(submitButton);

       const submitCall = await waitFor(() => {
            const call = global.fetch.mock.calls.find(
                ([url, options]) =>
                String(url).includes("/api/journal") &&
                options?.method === "POST"
            );

            expect(call).toBeDefined();
            return call;
        });

        expect(submitCall[1]).toMatchObject({
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer fake-token",
            },
        });

        const body = JSON.parse(submitCall[1].body);

        expect(body).toMatchObject({
            wine_id: 101,
            price: "20",
            comment: "Bright and fresh.",
            score: 5,
            user_acidity: 5,
            user_fizziness: 0,
            user_intensity: 5,
            user_sweetness: 5,
            user_tannin: 5,
            user_flavor: [],
        });

        expect(onClose).toHaveBeenCalled();
    })

})