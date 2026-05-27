import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { JournalDetailModal } from "./JournalDetailModal.jsx";
import { mapJournalOutputDTO } from "../../../server/helpers/journalDTO.js";
import { mockJournalDbRow } from "../../../test-data/journal.js";

describe("Journal Detail Modal", () => {
    const mockJournal = mapJournalOutputDTO(mockJournalDbRow);

    test("renders journal detail", () => {
        render(<JournalDetailModal journal={mockJournal} onClose={vi.fn()} />);

        expect(screen.getByText(/cabernet sauvignon/i)).toBeInTheDocument();
        expect(screen.getByText(/test estate/i)).toBeInTheDocument();
        expect(screen.getByText(/fruit/i)).toBeInTheDocument();
        expect(screen.getByText(/cherry/i)).toBeInTheDocument();
        expect(screen.getByText(/oak/i)).toBeInTheDocument();
        expect(screen.getByText(/Bright acidity and smooth finish/i)).toBeInTheDocument();
    })

    test("renders nothing when journal is null", () => {
        const { container } = render(
        <JournalDetailModal journal={null} onClose={vi.fn()} />
        );

        expect(container).toBeEmptyDOMElement();
    });

    test("calls onClose when close button is clicked", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(<JournalDetailModal journal={mockJournal} onClose={onClose} />);

        await user.click(screen.getByRole("button", { name: /close modal/i, }));

        expect(onClose).toHaveBeenCalled();
    });
})
