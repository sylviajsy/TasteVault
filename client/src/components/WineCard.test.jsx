import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { WineCard } from "./WineCard";
import { mockWine } from "../../../test-data/wines.js";

describe('Wine Card', () => {
    test('Renders wine info', () => {
        render(<WineCard wine={mockWine} onSelect={vi.fn()} />);

        expect(screen.getByText("Dark Horse Cabernet")).toBeInTheDocument();
        expect(screen.getByAltText("Dark Horse Cabernet")).toHaveAttribute(
            "src",
            "https://example.com/wine.png"
        );
        expect(screen.getByText("Cabernet Sauvignon")).toBeInTheDocument();
    })

    test('Calls onClick when clicked',async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();

        render(<WineCard wine={mockWine} onSelect={onSelect} />);

        await user.click(screen.getByText("Dark Horse Cabernet"));

        expect(onSelect).toHaveBeenCalledWith(mockWine);
    })

    test("returns nothing when wine is missing", () => {
        const { container } = render(<WineCard wine={null} onSelect={vi.fn()} />);

        expect(container.firstChild).toBeNull();
    });

    test("renders fallback values for incomplete wine data", () => {
        const partialWine = {
            id: 999,
            grapes: null,
        };

        render(<WineCard wine={partialWine} onSelect={vi.fn()} />);

        expect(screen.getByText("Unknown Wine")).toBeInTheDocument();
        expect(screen.getByText("Unknown Winery")).toBeInTheDocument();
        expect(screen.getByText("Region unavailable")).toBeInTheDocument();
        expect(screen.getByText("N/A")).toBeInTheDocument();
    });
})
