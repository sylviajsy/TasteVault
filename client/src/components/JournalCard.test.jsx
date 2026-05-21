import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { JournalCard } from "./JournalCard";
import { mapJournalOutputDTO } from "../../../server/helpers/journalDTO.js";
import { mockJournalDbRow } from "../../../test-data/journal.js";

describe("Journal Card", () => {
  test("Renders Journal Summary", () => {
    const mockJournal = mapJournalOutputDTO(mockJournalDbRow);

    render(<JournalCard note={mockJournal} onSelect={vi.fn()} />);

    expect(screen.getByText(/cabernet sauvignon/i)).toBeInTheDocument();
    expect(screen.getByText(/test estate/i)).toBeInTheDocument();
    expect(screen.getByText(/score:\s*9/i)).toBeInTheDocument();
    expect(screen.getByText(/5\/11\/2026/i)).toBeInTheDocument();
  });

  test("calls onSelect when card is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const mockJournal = mapJournalOutputDTO(mockJournalDbRow);

    render(<JournalCard note={mockJournal} onSelect={onSelect} />);

    await user.click(screen.getByTestId("journal-card"));

    expect(onSelect).toHaveBeenCalledWith(mockJournal);
  });
});
