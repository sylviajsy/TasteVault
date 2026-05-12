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
            .mockResolvedValueOnce({ ok: true, json: async () => mockTags }) // Load tags
            .mockResolvedValueOnce({ ok: true, json: async () => mockWines }) // Search wine
            .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1,wine_id: 101, comment: "Bright and fresh.", }) }); // Submit

        render(<AddNoteModal onClose={onClose} />);

        await user.type(
            screen.getByPlaceholderText(/search wines/i),
            "Dark Horse Cabernet"
        );

        const wineText = await screen.findByText(/Dark Horse Cabernet/i);
        await user.click(wineText.closest("button"));

        expect(
            screen.getByPlaceholderText(/search wines/i)
        ).toHaveValue("Dark Horse Cabernet");

        await user.type(screen.getByLabelText(/price/i), "19.99");

        await user.type(
            screen.getByLabelText(/comment/i),
            "Bright and fresh."
        );

        const submitButton = screen.getByRole("button", { name: /^submit$/i });
        await user.click(submitButton);

       await waitFor(() => {
            const submitCall = global.fetch.mock.calls.find(
                ([, options]) => options?.method === "POST"
            );

            expect(submitCall).toBeDefined();
        });

        const submitCall = global.fetch.mock.calls.find(
            ([, options]) => options?.method === "POST"
        );

        expect(submitCall[0]).toContain("/api/journal");

        const body = JSON.parse(submitCall[1].body);

        expect(body).toMatchObject({
            wine_id: 101,
            price: "19.99",
        });

    // //    try {
    // //         await waitFor(() => {
    // //             expect(onClose).toHaveBeenCalled();
    // //         }, { timeout: 3000 });
    // //     } catch (e) {
    // //         screen.debug(); 
    // //         throw e;
    // //     }

    //     // const submitCall = global.fetch.mock.calls.find(call => call[0].includes('/api/journal'));
    //     // expect(submitCall[1].method).toBe("POST");

        // await waitFor(() => {
        //     const submitCall = global.fetch.mock.calls.find((call) =>
        //         call[0].includes("/api/journal")
        //     );

        //     expect(submitCall).toBeDefined();
        // })

    })

})