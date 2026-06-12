import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { JournalPage } from "./JournalPage";
import { mockJournalDbRow } from "../../../test-data/journal.js";
import { mapJournalOutputDTO } from "../../../server/helpers/journalDTO.js";

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    getAccessTokenSilently: vi.fn().mockResolvedValue("fake-token"),
  }),
}));

vi.mock("../components/AddNoteModal", () => ({
  AddNoteModal: () => <div>Add Note Modal</div>,
}));

vi.mock("../components/GlobalSearchBar", () => ({
  GlobalSearchBar: ({ onSearch }) => (
    <button type="button" onClick={() => onSearch("")}>
      Search tasting notes
    </button>
  ),
}));

vi.mock("../components/JournalCard", () => ({
  JournalCard: ({ note, onSelect }) => (
    <button type="button" onClick={() => onSelect(note)}>
      {note.wine.name}
    </button>
  ),
}));

describe("JournalPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  test("renders fetched notes", async () => {
    const mockJournalNote = mapJournalOutputDTO(mockJournalDbRow);

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockJournalNote],
    });

    render(<JournalPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/journal?search="),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer fake-token",
          }),
        })
      );
    });

    expect(
      await screen.findByRole("button", { name: mockJournalNote.wine.name })
    ).toBeInTheDocument();
  });

  test("opens add tasting note modal", async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<JournalPage />);

    await user.click(
      screen.getByRole("button", { name: /add tasting note/i })
    );

    expect(screen.getByText("Add Note Modal")).toBeInTheDocument();
  });
});
