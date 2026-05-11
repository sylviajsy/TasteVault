import { describe, test, expect, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
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
  { wine_id: 101, name: "Dark Horse Cabernet", winery: "Dark Horse", image_url: "" }
];

describe('Add Note Modal', () => {
    const onClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });
    test('Submit note Integration test', async () => {
        const user = userEvent.setup();

        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockTags,
            }).mockResolvedValueOnce({
                ok: true,
                json: async () => mockWines,
            })

        render(<AddNoteModal onClose={onClose} />);

        await user.type(
            screen.getByPlaceholderText(/search wines/i),
            "Chardonnay"
        );

        expect(
            screen.getByPlaceholderText(/search wines/i)
        ).toHaveValue("Chardonnay");
    })

})