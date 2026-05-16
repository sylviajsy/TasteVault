import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { AddNoteModal } from "./AddNoteModal";
import { mockWineSearchResult, mockWineSearchResults } from "../../../test-data/wines.js";

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockTags = [
  { id: 1, group_name: "fruit", tag_name: "blackberry" }
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

        global.fetch = vi.fn((url, options) => {
            if (url.includes("/api/tasteTags")) {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockTags,
                });
            }

            if (url.includes("/api/wines")) {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockWineSearchResults,
                });
            }

            if (url.includes("/api/journal") && options?.method === "POST") {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        id: 1,
                        wine_id: mockWineSearchResult.id,
                    }),
                });
            }

            return Promise.reject(new Error(`Unhandled fetch: ${url}`));
        });

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
            wine_id: mockWineSearchResult.id,
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
    
    test('AI Generation', async () => {
        const user = userEvent.setup();

        global.fetch = vi.fn((url) => {
            if (url.includes("/api/tasteTags")) {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockTags,
                });
            }

            if (url.includes("/api/ai/generate-note")) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        polishedContent:
                        "Elegant blackberry aromas with smooth tannins.",
                    }),
                });
            }

            return Promise.reject(new Error(`Unhandled fetch: ${url}`));
        })

        render(<AddNoteModal onClose={onClose} />);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/api/tasteTags")
            );
        });

        await user.type(
            screen.getByLabelText(/comment/i),
            "Bright and fresh."
        );

        await user.click(
            screen.getByRole("button", { name: /generate ai note/i })
        );

        await waitFor(() => {
            expect(
                screen.getByLabelText(/comment/i)).toHaveValue(
                    "Elegant blackberry aromas with smooth tannins."
                )
        });

        const aiCall = global.fetch.mock.calls.find(([url]) =>
            String(url).includes("/api/ai/generate-note")
        );

        expect(aiCall).toBeDefined();
    })

    test("updates slider values", async () => {
        global.fetch = vi.fn((url) => {
            if (url.includes("/api/tasteTags")) {
            return Promise.resolve({
                ok: true,
                json: async () => [],
            });
            }

            return Promise.reject(new Error(`Unhandled fetch: ${url}`));
        });

        render(<AddNoteModal onClose={vi.fn()} />);

        const aciditySlider = screen.getByRole("slider", {
            name: /acidity/i,
        });
        
        const sweetnessSlider = screen.getByRole("slider", {
            name: /sweetness/i,
        });

        fireEvent.change(aciditySlider, {
            target: { value: "8" },
        });

        expect(aciditySlider).toHaveValue("8");
        expect(sweetnessSlider).toHaveValue("5");
    });
})
