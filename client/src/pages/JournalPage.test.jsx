import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { JournalPage } from "./JournalPage";

vi.mock("../components/AddNoteModal", () => ({
  AddNoteModal: () => <div>Add Note Modal</div>,
}));

describe("JournalPage", () => {
  test("opens add tasting note modal", async () => {
    const user = userEvent.setup();

    render(<JournalPage />);

    await user.click(
      screen.getByRole("button", { name: /add tasting note/i })
    );

    expect(screen.getByText("Add Note Modal")).toBeInTheDocument();
  });
});
